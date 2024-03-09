import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ipcRenderer } from 'electron'


// Custom APIs for renderer
const api = {
  registerDevice: () => ipcRenderer.invoke('registerDevice'),
  getCountries: (device_token) => ipcRenderer.invoke('getCountries', device_token),
  getCities: (device_token, countryCode) => ipcRenderer.invoke('getCities', device_token, countryCode),
  getServers: (device_token, countryCode, cityCode) => ipcRenderer.invoke('getServers', device_token, countryCode, cityCode)

}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('ipc', triggerConnectionFx)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  // window.api = api
}

function triggerConnectionFx(){
  ipcRenderer.invoke('triggerConnection')
  .then((res) => {

  })
  .catch((e) => {
    console.log(e)
  })
}

// ipcRenderer.on('connectionStatus', (event, arg) => {
//   console.log(arg)
// })


contextBridge.exposeInMainWorld(
  'ipcRenderer', {
    send: (channel, data) => {
      ipcRenderer.send(channel, data);
    },
    on: (channel, func) => {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    invoke: (channel, data) => {
      return ipcRenderer.invoke(channel, data);
    },
    removeAllListeners: (channel) => {
      ipcRenderer.removeAllListeners(channel);
    }
  }
);