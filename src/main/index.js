import { app, BrowserWindow } from 'electron'
import log from 'electron-log/main';
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import "./utils/axiosTweek.js"
import createWindow from './window/main.js'
import {registerDeepLink, handleDeepLink } from './utils/deepLink.js'
import Config, { deleteLogFiles } from './Config/Config.js';
import VPN from './system/classes/vpn.js';


let mainWindow;

const appConfig = new Config();
const singleInstanceLock = app.requestSingleInstanceLock()

registerDeepLink();

// initialize the logger
log.initialize({ spyRendererConsole: true });

// redirect console.log to the logger
console.log = log.log;


if (!singleInstanceLock) {
  app.quit()
} else {

  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.show()
      }
    }
    handleDeepLink(commandLine.pop())
  })

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(() => {


    // Set app user model id for windows
    electronApp.setAppUserModelId('co.sentinel')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    createWindow(mainWindow)

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow(mainWindow)
    })
  })

}

app.on('open-url', (event, url) => {handleDeepLink(url)});


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', async () => {
  await appConfig.createConfigDir();
})

app.on('will-quit', async (event) => {
  event.preventDefault
  try {
    // try{deleteLogFiles();}catch(e){console.log(e)}
    try{appConfig.deleteConfigDirectory();}catch(e){}
    
    try{const vpn = new VPN();await vpn.stop();}catch(e){}
  } catch (error) {
    
  } finally {
    app.quit();
  }

});

// app.disableHardwareAcceleration() 

