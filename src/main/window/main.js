import { app, shell, BrowserWindow, ipcMain, screen, Tray, Menu } from 'electron'
import { join } from 'path'
import { optimizer, is } from '@electron-toolkit/utils'
import { registerIpcHandlers } from '../ipcHandlers/handlers.js';
import icon from '../../../resources/icon.png?asset'

export default function createWindow(mainWindow) {

  let tray = null;

  let screen_size = screen.getPrimaryDisplay().workAreaSize

  // Create the browser window.
  mainWindow = new BrowserWindow({
    minWidth: 393,
    minHeight: 652,
    width: 393,
    height: 652,
    x: screen_size.width - 393 - 40,
    y: screen_size.height - 652 - 50,
    backgroundColor: '#171A20',
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

  // for managing window minimize
  function minimizeHandler(event) {
    event.preventDefault();
    mainWindow.hide();
  }

  // for managing tray
  ipcMain.handle('toggle-tray', (event, isEnabled) => {
    if (isEnabled) {
      if (!tray) {
        tray = new Tray(icon);
        var contextMenu = Menu.buildFromTemplate([
          { label: 'Quit', click: function () { app.isQuiting = true; app.quit(); } }
        ]);
        tray.on('click', function () { mainWindow.show(); });
        tray.setContextMenu(contextMenu)

        tray.setToolTip('Independent VPN')

        mainWindow.on('minimize', minimizeHandler);

      }
    } else {
      if (tray) {
        tray.destroy();
        tray = null;
        mainWindow.removeListener('minimize', minimizeHandler);
      }
    }
  });


}