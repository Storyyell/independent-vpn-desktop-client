import os from 'os'
import path from 'path'
import Randomstring from 'randomstring';
import { mkdtemp, rm } from 'node:fs/promises';

class Config {
    constructor() {
        if (Config.instance) {
            return Config.instance;
        }

        const uniqueString = Randomstring.generate();

        this.tmpdir = os.tmpdir()
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

    async createConfigDir() {
        await mkdtemp(this.configDirPath);
    }

    async deleteConfigDirectory() {
        await rm(this.configDirPath, { force: true, recursive: true });
    }

}
export default Config;