import { v4 as uuidv4 } from 'uuid';
import os from 'os'
import path from 'path'

class Config {
    constructor() {
        if (Config.instance) {
            return Config.instance;
        }

        const uniqueString = uuidv4()

        this.tmpdir = String(os.tmpdir)
        this.configDirPath = path.join(this.tmpdir, uniqueString)
        this.configPath = path.join(this.tmpdir, uniqueString, 'config.json')
        this.adapterName = 'independent_vpn'

        // loading from env
        this.apiDomain = import.meta.env.VITE_SERVER_API_URL
        this.appKey = import.meta.env.VITE_SERVER_APP_KEY

        Config.instance = this
    }

    static getInstance() {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }

    // getting value from config
    get(key) {
      return this[key];
    }

    // setting value to config
    set(key, value) {
      if (this.settings.hasOwnProperty(key)) {
        this.settings[key] = value;
      }
    }

    createConfigDir() {
      try {
        if (!fs.existsSync(this.configDirPath)) {
            fs.mkdirSync(this.configDirPath, { recursive: true });
        }
      } catch (error) {
        console.error('error creating config directory')
        throw error        
      }
    }

    deleteConfigDir() {
      try {
        if (fs.existsSync(this.configDirPath)) {
            fs.rmdirSync(this.configDirPath, { recursive: true });
        }
      } catch (error) {
        console.error('error deleting config directory')
        throw error        
      }
    }

}

export default Config;