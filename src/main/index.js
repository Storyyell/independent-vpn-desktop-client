import { app, shell, BrowserWindow, ipcMain, screen, Tray, Menu } from 'electron'
import log from 'electron-log/main';
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import icon_ from '../../resources/icon.ico?asset'
import os from 'os'
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs'
import path from 'path'
import { vpnObj } from './system/vpnBase.js'
import { registerIpcHandlers } from './ipcHandlers/handlers.js';
import axios from 'axios';
const { globalShortcut } = require('electron');

// todo code want to be splitted across the files for manageability [ scope increased]

let sessionTempDir = {
  path: '',
  uuid: uuidv4()
};

global.sessionTempDir = sessionTempDir; // Todo remove this global variable 
global.vpnConnStatus = false;

global.adapterName = "independent_vpn";

axios.defaults.timeout = 30000; // 30 seconds


// initialize the logger
log.initialize({ spyRendererConsole: true });

// redirect console.log to the logger
console.log = log.log;

console.log(`log path :=> ${log.transports.file.getFile().path}`);


function createWindow() {
  let screen_size = screen.getPrimaryDisplay().workAreaSize
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    minWidth: 393,
    minHeight: 652,
    width: 393,
    height: 652,
    x: screen_size.width - 393 - 40,
    y: screen_size.height - 652 - 50,
    backgroundColor: '#1E1A1B',
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    maximizable: false,
  })

  // mainWindow.webContents.openDevTools();
  if (process.env.NODE_ENV === 'production') {
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.on('ready-to-show', () => {
    //todo remove this global scope of main window
    global.mainWindow = mainWindow
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  registerIpcHandlers(ipcMain);

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  let trayvar = new Tray(icon_)
  var contextMenu = Menu.buildFromTemplate([
    { label: 'Quit', click: function () { app.isQuiting = true; app.quit(); } }
  ]);
  trayvar.on('click', function () { mainWindow.show(); });
  trayvar.setContextMenu(contextMenu)

  trayvar.setToolTip('Independent VPN')

  mainWindow.on('minimize', function (event) {
    event.preventDefault();
    mainWindow.hide();
  });
}

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

    // Disable the Alt key
    globalShortcut.register('Alt', () => { });

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    // IPC test
    ipcMain.on('ping', () => console.log('pong'))

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

