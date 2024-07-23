import Config from "../../Config/Config";
import Network from "./network";
import path from 'path'
import fs, { mkdir } from 'fs'
const fsPromises = require('fs').promises;
import { spawn } from "child_process"
import { app } from 'electron'


class V2RAY extends Network{
  constructor(){
    if (V2RAY.instance instanceof V2RAY){
      return V2RAY.instance
    }
    super()
    this.config = null
    this.endpoint = null
    this.serverIp = null
    this.port = null
    this.uid = null

    this.platform = process.platform
    this.binaryDirPath = this.publicDirPath()
    this.v2rayBinaryPath = this.v2rayBinaryPathFx()
    this.tun2socksBinPath = this.tun2socksBinaryPathFx()
    
    this.appConfig = new Config()
    this.v2rayconffname = 'v2ray_config.json'
    this.v2rayconfpath = path.join(this.appConfig.configDirPath, this.v2rayconffname)

    // process objects
    this.v2rayProcess = null
    this.tun2socksProcess = null

    this.processTree = {
      isConfigToDisk: false,
      isResolvedServerIp: false,
      isEstablishV2RAYTunnel: false,
      isv2rayConfigCleaned: false,
      isEstablishedInternalTunnel: false,
      isInternetConnectivityCheckPassed : false,
      isAdapterIpAssigned: false,
      isDnsAssigned: false,
      isGlobalTrafficRouteRuleAssigned: false,
      isGatewayAdapterIpResolved: false,
      isVpnTrafficRouteRuleAssigned: false,
    }

    V2RAY.instance = this

  }

  publicDirPath(){
    let basePath = path.join(__dirname, "../../resources/bin/");

    if (app.isPackaged) {
        // When the app is packaged, the "resourcesPath" points to the "resources" directory adjacent to app.asar
        basePath = path.join(process.resourcesPath, 'app.asar.unpacked/resources/bin');
    }
    return basePath
  }

  v2rayBinaryPathFx(){
    // 4 windows
    if (this.platform === 'win32'){
      return path.join(this.binaryDirPath, 'v2ray.exe')
    }
  }

  tun2socksBinaryPathFx(){
    // 4 windows
    if (this.platform === 'win32'){
      return path.join(this.binaryDirPath, 'tun2socks.exe')
    }
  }

  async connect({config, endpoint, port, uid}){
    if(!config){throw new Error('config is required')}
    if(!endpoint){throw new Error('endpoint is required')}
    if(!port){throw new Error('port is required')}
    if(!uid){throw new Error('uid is required')}
    this.config = config
    this.endpoint = endpoint
    this.port = port
    this.uid = uid

    try {
      
      try {
        await this.writeConfigToDisk(config);
        this.processTree.isConfigToDisk = true;
      } catch (error) {
        console.error('Failed to write v2ray config to disk');
        await this.deleteConfigFromDisk();
        throw new Error(error);
      }

      try {
        this.serverIp = await this.getIPv4FromDomain(endpoint);
        this.processTree.isResolvedServerIp = true;
      } catch (error) {
        console.error('Failed to resolve server IP', error);
        throw new Error(error);
      }

      try {
        await this.establishV2RAYTunnel();
        this.processTree.isEstablishV2RAYTunnel = true;
      } catch (error) {
        console.error('Failed to establish v2ray tunnel');
        await this.closeV2RAYTunnel();
        throw new Error(error);
      }

      try {
        await this.deleteConfigFromDisk();
        this.processTree.isv2rayConfigCleaned = true;
      } catch (error) {
        console.error('Failed to clean up v2ray config from disk', error);
        throw new Error(error);
      }

      try {
        await this.checkSocksInternetConnectivity('127.0.0.1', 10808);
        this.processTree.isInternetConnectivityCheckPassed = true;
      } catch (error) {
        throw new Error('Failed to check internet connectivity through socks proxy');        
      }

      try {
        await this.startInternalTunnel();
        this.processTree.isEstablishedInternalTunnel = true;
      } catch (error) {
        console.error('Failed to establish internal tunnel');
        await this.stopInternalTunnel();
        throw new Error(error);
      }

      try {
        await this.assignStaticIp();
        this.processTree.isAdapterIpAssigned = true;
      } catch (error) {
        console.error('Failed to assign static IP to adapter');
        await  this.removeStaticIp();
        throw new Error(error);        
      }


      try {
        await this.assignDns();
        this.processTree.isDnsAssigned = true;
      } catch (error) {
        console.error('Failed to assign DNS');
        await  this.removeDns();
        throw new Error(error);        
      }

      try {
        await this.assignGlobalTrafficRouteRule();
        this.processTree.isGlobalTrafficRouteRuleAssigned = true;
      } catch (error) {
        console.error('Failed to assign global traffic route rule');
        await this.removeGlobalTrafficRouteRule();
        throw new Error(error);        
      }

      try {
        await this.getGatewayAdapterIp();
        this.processTree.isGatewayAdapterIpResolved = true;
      } catch (error) {
        console.error('Failed to get gateway adapter IP');
        throw new Error(error);        
      }

      try {
        await this.vpnTrafficRouteRule(this.serverIp, this.GatewayIp);
        this.processTree.isVpnTrafficRouteRuleAssigned = true;
      } catch (error) {
        console.error('Failed to assign VPN traffic route rule');
        await this.removeVpnTrafficRouteRule();
        throw new Error(error);        
      }

      return true
    } catch (error) {
      await this.disconnect()
      throw new Error(error)
    }
  }
  
  async disconnect(){
    let success = true;

    try {
      if (this.processTree.isGlobalTrafficRouteRuleAssigned) {
        try {
          await this.removeGlobalTrafficRouteRule();
        } catch (error) {
          console.error('Failed to remove global traffic route rule');
          success = false;
        }
      }

      if (this.processTree.isVpnTrafficRouteRuleAssigned) {
        try {
          await this.removeVpnTrafficRouteRule(this.serverIp);
        } catch (error) {
          console.error('Failed to remove VPN traffic route rule');
          success = false;
        }
      }

      if (this.processTree.isDnsAssigned) {
        try {
          await this.removeDns(this.getGatewayInterfaceName());
        } catch (error) {
          console.error('Failed to remove DNS');
          success = false;
        }
      }

      if (this.processTree.isAdapterIpAssigned) {
        try {
          await this.removeStaticIp();
        } catch (error) {
          console.error('Failed to remove static IP from adapter');
          success = false;
        }
      }

      if (this.processTree.isEstablishedInternalTunnel) {
        try {
          await this.stopInternalTunnel();
        } catch (error) {
          console.error('Failed to stop internal tunnel');
          success = false;
        }
      }

      if (this.processTree.isEstablishV2RAYTunnel) {
        try {
          await this.closeV2RAYTunnel();
        } catch (error) {
          console.error('Failed to close v2ray tunnel');
          success = false;
        }
      }

      if (this.processTree.isConfigToDisk) {
        try {
          await this.deleteConfigFromDisk();
        } catch (error) {
          console.error('Failed to delete v2ray config from disk');
          success = false;
        }
      }

    } finally {
      this.processTree = {
        isConfigToDisk: false,
        isResolvedServerIp: false,
        isEstablishV2RAYTunnel: false,
        isv2rayConfigCleaned: false,
        isEstablishedInternalTunnel: false,
        isInternetConnectivityCheckPassed: false,
        isAdapterIpAssigned: false,
        isDnsAssigned: false,
        isGlobalTrafficRouteRuleAssigned: false,
        isGatewayAdapterIpResolved: false,
        isVpnTrafficRouteRuleAssigned: false
      };
    }

    return success;

  }

  async establishV2RAYTunnel() {
    try {
      return new Promise((resolve, reject) => {

        const configPath = this.v2rayconfpath;
        const v2rayBinPath = this.v2rayBinaryPath;

        const v2ray = spawn(v2rayBinPath, ['-config', configPath]);
        this.v2rayProcess = v2ray;

        v2ray.on('error', async (error) => {
          console.error(`Failed to start v2ray process`);
          reject(new Error(`Failed to start v2ray process: ${error.message}`));
        });

        v2ray.on('close', async (code) => {
          console.log(`v2ray process exited`);
          reject(new Error(`v2ray process exited with code ${code}`));
        });

        async function onDataReceived(data) {
          const output = data.toString();
          if (output.includes('started')) {
            v2ray.stdout.removeListener('data', onDataReceived);
            try {
              resolve(true);
            } catch (error) {
              reject(new Error('Failed to establish VPN connection'));
            }
          }
        }
        v2ray.stdout.on('data', onDataReceived);
      });

    } catch (error) {
      throw new Error('An unexpected error occurred while establishing the tunnel');
    }
  }

  async closeV2RAYTunnel() {
    return new Promise((resolve, reject) => {

      const handleCleanup = () => {
        this.v2rayProcess = null;
        if (this.processTree) {
          this.processTree.isEstablishV2RAYTunnel = false;
        }
      };

      if (!this.v2rayProcess) {
        console.warn("No v2ray process found to close.");
        handleCleanup();
        resolve(true);
        return;
      }

      try {
        // Attempt to gracefully stop the v2-ray process
        this.v2rayProcess.kill();

        const handleProcessClosure = (eventName, detail) => {
          return (code) => {
            console.log(`v2ray process ${eventName}: ${detail}${code !== undefined ? ` with code ${code}` : ''}`);
            handleCleanup();
            resolve(eventName === 'close' || eventName === 'exit');
          };
        };

        this.v2rayProcess.once('close', handleProcessClosure('exited', ''));
        this.v2rayProcess.once('error', handleProcessClosure('failed to close', 'due to an error '));
        this.v2rayProcess.once('exit', handleProcessClosure('exited', ''));
        this.v2rayProcess.once('disconnect', handleProcessClosure('disconnected', ''));

      } catch (error) {
        console.error(`Exception in closing v2ray process: ${error.message}`);
        handleCleanup();
        resolve(false);
      }
    });
  }


  async startInternalTunnel(){
    return new Promise((resolve, reject)=>{

      const tun2socksBinPath = this.tun2socksBinPath

      const tun2socks = spawn(tun2socksBinPath, [
        '-tcp-auto-tuning',
        '-device', `tun://${this.appConfig.adapterName}`,
        '-proxy', 'socks5://127.0.0.1:10808'
      ]);
      this.tun2socksProcess = tun2socks;

      tun2socks.on('error', async (error) => {
        console.error(`Failed to start tun2socks process`);
        reject(false);
      });

      tun2socks.on('close', async (code) => {
        console.log(`tun2socks process exited with code ${code}`);
        reject(false);
      });

      const onDataReceived = async (data) => {
        const output = data.toString();
      
        if (output.includes(`level=info msg="[STACK] tun://${this.appConfig.adapterName} <-> socks5://127.0.0.1:10808"`)) {
          tun2socks.stdout.removeListener('data', onDataReceived);
          resolve(true);
        }
      };

      tun2socks.stdout.on('data', onDataReceived);
    })
    }

  async stopInternalTunnel() {
    return new Promise((resolve, reject) => {

      const handleCleanup = () => {
        this.tun2socksProcess = null;
        if (this.processTree) {
          this.processTree.isEstablishedInternalTunnel = false;
        }
      };

      if (!this.tun2socksProcess) {
        console.warn("No tun2socks process found to stop.");
        handleCleanup();
        resolve(true);
        return;
      }

      try {
        // Attempt to gracefully stop the tun 2 socks process
        this.tun2socksProcess.kill();

        const handleProcessClosure = (eventName, detail) => {
          return (code) => {
            console.log(`tun2socks process ${eventName}: ${detail}${code !== undefined ? ` with code ${code}` : ''}`);
            handleCleanup();
            resolve(eventName === 'close' || eventName === 'exit');
          };
        };

        this.tun2socksProcess.once('close', handleProcessClosure('exited', ''));
        this.tun2socksProcess.once('error', handleProcessClosure('failed to close', 'due to an error '));
        this.tun2socksProcess.once('exit', handleProcessClosure('exited', ''));
        this.tun2socksProcess.once('disconnect', handleProcessClosure('disconnected', ''));

      } catch (error) {
        console.error(`Exception in stopping tun2socks process: ${error.message}`);
        handleCleanup();
        resolve(false);
      }
    });
  }

  async writeConfigToDisk(config) {
      try {
        if (!config) {
          throw new Error('config is required');
        }

        const configDirPath = this.appConfig.configDirPath;

        if (!fs.existsSync(configDirPath)) {
          await fsPromises.mkdir(configDirPath, { recursive: true });
        }

        try {
          await fsPromises.access(configDirPath)
        } catch (error) {
          await fsPromises.mkdir(configDirPath, {recursive: true})
        }
        await fs.promises.writeFile(this.v2rayconfpath, config, { flag: 'w' });
        return true;
      } catch (error) {
        console.error('Error writing v2ray config to disk');
        throw new Error(error);
      }
    }

  async deleteConfigFromDisk(){
        try {
          await fsPromises.access(this.v2rayconfpath)
          await fsPromises.rm(this.v2rayconfpath)
        } catch (error) {
          
        }
        return true
    }

}

export default V2RAY;