import Config from "../../Config/Config";
import Network from "./network";
import path from 'path'
import fs, { write } from 'fs'
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
    this.binaryPath = this.v2rayBinaryPath()
    
    this.appConfig = new Config()
    this.v2rayconffname = 'v2ray_config.json'

    // process objects
    this.v2rayProcess = null
    this.tun2socksProcess = null

    this.processTree = {
      writeConfigToDisk: false,
      resolvingServerIp: false,
      establishTunnel: false,
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

  v2rayBinaryPath(){
    if (this.platform !== 'win32'){
      throw new Error('v2ray binary not supported on this platform')      
    }
    // 4 windows
    if (this.binaryPath){return this.binaryPath}  
    return path.join(this.binaryDirPath, 'v2ray.exe')
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
      await this.writeConfiToDisk(config);
      this.processTree.writeConfigToDisk = true
      this.serverIp = await this.getIPv4FromDomain(endpoint)
      this.processTree.resolvingServerIp = true
      await this.establishTunnel()
      this.processTree.establishTunnel = true
      await this.deleteConfigFromDisk()

      return true
    } catch (error) {
      await this.disconnect()
      return false
    }
  }
  
  async disconnect(){
    try {

      await this.closeTunnel()
      await this.deleteConfigFromDisk()
      this.processTree = {
        writeConfigToDisk: false,
        resolvingServerIp: false,
        establishTunnel: false,
      }
      return true
    } catch (error) {
      return false
  }}


  async establishTunnel() {
    try {
      return new Promise((resolve, reject) => {

        const configPath = path.join(this.appConfig.configDirPath, this.v2rayconffname);
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
            vpnObj.v2ray = v2ray;
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

  async closeTunnel() {
    try {
      return new Promise((resolve, reject) => {
        if (this.v2rayProcess) {
          this.v2rayProcess.kill('SIGINT');
          this.v2rayProcess.on('close', (code) => {
            console.log(`v2ray process exited with code ${code}`);
            resolve(true);
          });
        } else {
          resolve(true);
        }
      });
    } catch (error) {
      throw new Error('An unexpected error occurred while closing the tunnel');
  }}


  async writeConfiToDisk(config){
    try {
      if(!config){throw new Error('config is required')}
      
      const filename = this.v2rayconffname
      const configPath = path.join(this.appConfig.configDirPath, filename)
      
      if (!fs.existsSync(configPath)) {fs.mkdirSync(configPath, { recursive: true });}
      await fs.promises.writeFile(configPath, JSON.stringify(config), { flag: 'w' });
      return configPath
    } catch (error) {
      console.error('error writing v2ray config to disk')
      throw error
    }
  }

  async deleteConfigFromDisk(){
      const filename = this.v2rayconffname
      const configPath = path.join(this.appConfig.configDirPath, filename)
      try {
        if (fs.existsSync(configPath)) {
          fs.unlinkSync(configPath)
        }
        return configPath
    }catch (error) {
      console.error('error deleting v2ray config from disk')
      throw error
    }
  }

}

export default V2RAY;