import { app, shell, } from 'electron'
import {
  getIp,
  showNotification,
  getVpnMetric,
  openLogFile
} from '../system/ipcs.js'
import { adapterSpeed } from '../system/stats/adapter.js'
import SENTINEL_API from '../system/classes/sentinel.js'
import DNS from '../system/classes/dns.js'
import Config from '../Config/Config.js'
import VPN from '../system/classes/vpn.js'

const sentinel = new SENTINEL_API();
const dns = new DNS();
const vpnInstance = new VPN();


export function registerIpcHandlers(ipcMain) {
  const appConfig = new Config();

  ipcMain.handle('triggerConnection', async (event, serverParms) => {
    console.log('vpn connection trigger on main process')
    return await vpnInstance.start({protocol: "V2RAY", ...serverParms});
  })

  ipcMain.handle('triggerDisconnection', async (event) => {
    console.log('vpn disconnection trigger on main process')
    return await vpnInstance.stop()
  })

  ipcMain.handle('vpnConnStatus', (event, serverObj) => {
    return global.vpnConnStatus
  })

  ipcMain.handle('registerDevice', async () => {
    return sentinel.registerDevice()
  })

  ipcMain.handle('setDeviceToken', async (event, device_token) => {
    return sentinel.setDeviceToken(device_token)
  })

  ipcMain.handle('getCountries', async (event, device_token) => {
    return sentinel.pullCountryList()
  })

  ipcMain.handle('getCities', async (event, device_token, countryCode) => {
    return sentinel.pullCityList(countryCode)
  })

  ipcMain.handle('getServers', async (event, device_token, countryCode, cityCode) => {
    return sentinel.pullServerList(countryCode, cityCode)
  })

  ipcMain.handle('getServerConf', async (event, device_token, countryCode, cityCode, serverId) => {
    return sentinel.pullServerConf(countryCode, cityCode, serverId)
  })

  ipcMain.handle('sysOpen', async (event, ...url) => {
    shell.openExternal(url[0], { activate: true });
  })

  ipcMain.handle('getIp', async (event, device_token) => {
    return getIp(device_token);
  })

  ipcMain.handle('appVersion', (event) => {
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
      dnsList: dns.getDNSList(),
      selectedDns: dns.getCurrentDNSIndex()
    };

  })
  ipcMain.handle('setDns', async (event, dnsId) => { dns.setCurrentDNSIndex(dnsId || 0) })

  ipcMain.handle('adapterSpeed', async (event) => { return adapterSpeed(appConfig.adapterName); });

  ipcMain.handle('openLogger', async (event) => {
    return openLogFile();
  });


}
