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
      if (this.v2rayBinaryPath){return this.v2rayBinaryPath}  
      return path.join(this.binaryDirPath, 'v2ray.exe')
    }
  }

  tun2socksBinaryPathFx(){
    // 4 windows
    if (this.platform === 'win32'){
      if (this.tun2socksBinPath){return this.tun2socksBinPath}  
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
      
      await this.writeConfigToDisk(config);
      this.processTree.isConfigToDisk = true;
      this.serverIp = await this.getIPv4FromDomain(endpoint);
      this.processTree.isResolvedServerIp = true;
      await this.establishV2RAYTunnel();
      this.processTree.isEstablishV2RAYTunnel = true;
      await this.deleteConfigFromDisk();
      this.isv2rayConfigCleaned = true;
      await this.checkSocksInternetConnectivity('127.0.0.1', 10808);
      this.isInternetConnectivityCheckPassed = true;
      await this.startInternalTunnel();
      this.isEstablishedInternalTunnel = true;

      return true
    } catch (error) {
      console.log(this.processTree)
      // await this.disconnect()
      throw error
    }
  }
  
  async disconnect(){
    try {

      // await this.closeTunnel()
      await this.deleteConfigFromDisk()
      this.processTree = {
        writeConfigToDisk: false,
        resolvingServerIp: false,
        establishV2RAYTunnel: false,
      }
      return true
    } catch (error) {
      return false
  }}


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
        // Attempt to gracefully stop the v2ray process
        this.v2rayProcess.kill('SIGINT');

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
        // Attempt to gracefully stop the tun2socks process
        this.tun2socksProcess.kill('SIGINT');

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
          fsPromises.mkdir(configDirPath, {recursive: true})      
        }
        await fs.promises.writeFile(this.v2rayconfpath, config, { flag: 'w' });
        return true;
      } catch (error) {
        console.error('Error writing v2ray config to disk', error);
        throw error;
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