import { app, shell, BrowserWindow, ipcMain, screen, Tray, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import icon_ from '../../resources/icon.ico?asset'
import { vpnConnet, vpnDisconnect } from './system/vpnBase.js'
import os from 'os'
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs'
import path from 'path'
import { vpnObj } from './system/vpnBase.js'
import { registerDevice, pullCountryList, pullCityList, pullServerList, pullServerConf } from './system/ipcs.js'

let sessionTempDir = {
  path: '',
  uuid: uuidv4()
};

global.sessionTempDir = sessionTempDir; // Todo remove this global variable 
global.vpnConnStatus = false;


function createWindow() {
  let screen_size = screen.getPrimaryDisplay().workAreaSize
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    minWidth: 380,
    minHeight: 540,
    width: 380,
    height: 540,
    x: screen_size.width - 380 - 40,
    y: screen_size.height - 540 - 50,
    backgroundColor: '#1E1A1B',
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // mainWindow.webContents.openDevTools();

  mainWindow.on('ready-to-show', () => {
    //todo remove this global scope of main window
    global.mainWindow = mainWindow
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  ipcMain.handle('triggerConnection', async (event, serverParms) => {
    console.log('vpn connection trigger on main process')
    return await vpnConnet(serverParms);
  })

  ipcMain.handle('triggerDisconnection', async (event) => {
    console.log('vpn disconnection trigger on main process')
    return await vpnDisconnect()
  })

  ipcMain.handle('vpnConnStatus', (event, serverObj) => {
    return global.vpnConnStatus
  })

  ipcMain.handle('registerDevice', async () => {
    console.log('device registration triggered on main process')
    return registerDevice()
  })

  ipcMain.handle('getCountries', async (event, args) => {
    return pullCountryList(args)
  })

  ipcMain.handle('getCities', async (event, device_token, countryCode) => {
    return pullCityList(device_token, countryCode)
  })

  ipcMain.handle('getServers', async (event, device_token, countryCode, cityCode) => {
    return pullServerList(device_token, countryCode, cityCode)
  })

  ipcMain.handle('getServerConf', async (event, device_token, countryCode, cityCode, serverId) => {
    return pullServerConf(device_token, countryCode, cityCode, serverId)
  })

  ipcMain.handle('sysOpen', async (event, ...url) => {
    shell.openExternal(url[0]);
  })

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
    } catch (err) {
      console.error(err);
    }
  }
});





// app.disableHardwareAcceleration() 

