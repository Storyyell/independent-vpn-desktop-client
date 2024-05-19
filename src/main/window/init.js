import { app, shell, BrowserWindow, ipcMain, screen, Tray, Menu } from 'electron'
import { join } from 'path'
import { optimizer, is } from '@electron-toolkit/utils'
import icon from '../../../resources/icon.png?asset'
import icon_ from '../../../resources/icon.ico?asset'
import { registerIpcHandlers } from '../../main/ipcHandlers/handlers.js';

export default function createWindow() {

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
      sandbox: false,
      devTools: process.env.NODE_ENV === 'production' ? false : true // disable the Developer Tools

    },
    maximizable: false,
  })

  // devtools configurations
  // mainWindow.webContents.openDevTools();
  if (process.env.NODE_ENV === 'production') {

    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools();
    });

    // application menu to null to disable default menu behavior in production
    Menu.setApplicationMenu(null);
  } else {
    optimizer.watchWindowShortcuts(mainWindow);
  }


  // Disable the default menu
  mainWindow.setMenu(null)

  mainWindow.on('ready-to-show', () => {
    //todo remove this global scope of main window
    global.mainWindow = mainWindow
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Register the IPC handlers
  registerIpcHandlers(ipcMain);

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Create the tray icon
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