const { dialog } = require('electron');
const { autoUpdater } = require('electron-updater');

// Enable logging
autoUpdater.logger = require('electron-log');

// Disable auto downloading
autoUpdater.autoDownload = false;

// Check for updates
export default function initUpdater() {
  // Start update check
  autoUpdater.checkForUpdates();

  // Listen for download (update) found
  autoUpdater.on('update-available', async () => {

    // Prompt user to update
    const { response } = await dialog.showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: 'A new version of Independent VPN is available. Do you want to update now?',
      buttons: ['Update', 'No'],
    });

    // If not 'Update' button, return
    if (response !== 0) return;

    // Else start download and show download progress in new window
    autoUpdater.downloadUpdate();

    // Listen for completed update download
    autoUpdater.on('update-downloaded', async () => {
      // Prompt user to quit and install update
      const { response } = await dialog.showMessageBox({
        type: 'info',
        title: 'Update Ready',
        message: 'A new version of Independent VPN is ready. Quit and install now?',
        buttons: ['Yes', 'Later'],
      });

      // Update if 'Yes'
      if (response === 0) autoUpdater.quitAndInstall();
    });
  });
}
