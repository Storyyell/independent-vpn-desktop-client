import { app, BrowserWindow } from 'electron'
import log from 'electron-log/main';
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
// import { vpnObj } from './system/vpnBase.js'
import "./utils/axiosTweek.js"
import createWindow from './window/init.js'
import Config, { deleteLogFiles } from './Config/Config.js';
const fsPromises = require('fs').promises;


global.vpnConnStatus = false;

let mainWindow;

const appConfig = new Config();

// initialize the logger
log.initialize({ spyRendererConsole: true });

// redirect console.log to the logger
Object.assign(console, log.functions);

console.log(`log path :=> ${log.transports.file.getFile().path}`);


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  const gotTheLock = app.requestSingleInstanceLock()

  if (!gotTheLock) {
    app.quit()
  } else {

    app.on('second-instance', (event, commandLine, workingDirectory) => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) {
          mainWindow.show()
        }
      }
    })

    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

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

  }

})

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
    deleteLogFiles();
    appConfig.deleteConfigDirectory();
  } catch (error) {
    
  } finally {
    app.quit();
  }

});

// app.disableHardwareAcceleration() 

