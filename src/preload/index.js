import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ipcRenderer } from 'electron'
import { getVpnMetric } from '../main/system/ipcs'


// Custom APIs for renderer
const api = {
  registerDevice: () => ipcRenderer.invoke('registerDevice'),
  getCountries: (device_token) => ipcRenderer.invoke('getCountries', device_token),
  getCities: (device_token, countryCode) => ipcRenderer.invoke('getCities', device_token, countryCode),
  getServers: (device_token, countryCode, cityCode) => ipcRenderer.invoke('getServers', device_token, countryCode, cityCode),
  getServerConf: (device_token, countryCode, cityCode, serverId) => ipcRenderer.invoke('getServerConf', device_token, countryCode, cityCode, serverId),
  triggerConnection: (serverObj) => ipcRenderer.invoke('triggerConnection', serverObj),
  triggerDisconnection: () => ipcRenderer.invoke('triggerDisconnection'),
  getIp: (device_token) => ipcRenderer.invoke('getIp', device_token),
  appVersion: () => ipcRenderer.invoke('appVersion'),
  sendMail: (mailObj) => ipcRenderer.invoke('openMailClient', mailObj),
  pushNotification: (title, body) => ipcRenderer.invoke('pushNotification', title, body),
  getVpnMetric: () => ipcRenderer.invoke('vpnMetric'),
  getDnsList: () => ipcRenderer.invoke('getDnsList'),
  setDns: (dnsId) => ipcRenderer.invoke('setDns', dnsId),
  adapterSpeed: () => ipcRenderer.invoke('adapterSpeed'),
  openLogger: () => ipcRenderer.invoke('openLogger'),
  toggleTray: (isEnabled) => ipcRenderer.invoke('toggle-tray', isEnabled),

  sysOpen: (...url) => ipcRenderer.invoke('sysOpen', ...url),
}


// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}

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