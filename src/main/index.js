import { app, BrowserWindow, ipcMain } from 'electron'
import log from 'electron-log/main';
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import os from 'os'
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs'
import path from 'path'
import { vpnObj } from './system/vpnBase.js'
import "./utils/axiosTweek.js"
import createWindow from './window/init.js'


let sessionTempDir = {
  path: '',
  uuid: uuidv4()
};

global.sessionTempDir = sessionTempDir; // Todo remove this global variable 
global.vpnConnStatus = false;

global.adapterName = "independent_vpn";


// initialize the logger
log.initialize({ spyRendererConsole: true });

// redirect console.log to the logger
console.log = log.log;

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

    createWindow()

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
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

app.on('ready', () => {
  const tempDir = os.tmpdir();

  fs.mkdtemp(path.join(tempDir, sessionTempDir.uuid), (err, folder) => {
    if (err) throw err;
    sessionTempDir.path = folder;

  });

})

app.on('will-quit', async () => {
  await vpnObj.triggerDisconnection();

  //Todo: remove file just after connection and use protobuff to store the data
  if (global.sessionTempDir.path) {
    try {
      fs.rmSync(global.sessionTempDir.path, { recursive: true });
      fs.rmSync(log.transports.file.getFile().path);
    } catch (err) {
      console.error(err);
    }
  }
});

// app.disableHardwareAcceleration() 

