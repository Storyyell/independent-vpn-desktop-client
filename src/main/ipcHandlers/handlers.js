import { app, shell, } from 'electron'
import { vpnConnet, vpnDisconnect } from '../system/vpnBase.js'
import { vpnObj } from '../system/vpnBase.js'
import {
  registerDevice,
  pullCountryList,
  pullCityList,
  pullServerList,
  pullServerConf,
  getIp,
  showNotification,
  getVpnMetric,
  openLogFile

} from '../system/ipcs.js'
import { dnsList } from '../system/dns/dnsList.js'
import { adapterSpeed } from '../system/stats/adapter.js'


export function registerIpcHandlers(ipcMain) {

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
    shell.openExternal(url[0], { activate: true });
  })

  ipcMain.handle('getIp', async (event, device_token) => {
    return getIp(device_token);
  })

  ipcMain.handle('appVersion', async (event) => {
    let appVersion = app.getVersion();
    return appVersion;
  })

  ipcMain.handle('openMailClient', async (event, mailObj) => {
    return new Promise((resolve, reject) => {
      const mailtoLink = `mailto:${mailObj.to}?subject=${mailObj.subject}&body=${mailObj.body}`;
      shell.openExternal(mailtoLink, { activate: true }, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  })

  ipcMain.handle('pushNotification', async (event, title, body) => {
    if (title && body) {
      showNotification(title, body);
    }

  })

  ipcMain.handle('vpnMetric', async (event) => {
    return getVpnMetric();
  })

  ipcMain.handle('getDnsList', async (event) => {

    return {
      dnsList: dnsList || [],
      selectedDns: vpnObj.dnsIndex || 0
    };

  })
  ipcMain.handle('setDns', async (event, dnsId) => { vpnObj.dnsIndex = dnsId || 0 })

  ipcMain.handle('adapterSpeed', async (event) => { return adapterSpeed(global.adapterName); });

  ipcMain.handle('openLogger', async (event) => {
    return openLogFile();
  });


}
