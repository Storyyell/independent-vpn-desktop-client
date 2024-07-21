import os from 'os'
import path from 'path'
import Randomstring from 'randomstring';
const fsPromises = require('fs').promises;
const { spawn } = require("child_process");
import log from 'electron-log/main';

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
        await fsPromises.mkdtemp(this.configDirPath);
    }

    async deleteConfigDirectory() {
        
        cmd = ''

        if (process.platform == 'win32') {
            cmd = `rmdir /s /q ${this.configDirPath}`
        }
        if (process.platform == 'linux') {
            cmd = `rm -rf ${this.configDirPath}`
        }
        if (process.platform == 'darwin') {
            cmd = `rm -rf ${this.configDirPath}`
        }

        const process = spawn(cmd, { shell: true, stdio: "ignore", detached: true });
        process.unref();

        }

}

export async function deleteLogFiles() {
    const logFilePath = log.transports.file.getFile().path;
    cmd = ''
    if (process.platform == 'win32') {
        cmd = `del ${logFilePath}`
    }
    if (process.platform == 'linux') {
        cmd = `rm -rf ${logFilePath}`
    }
    if (process.platform == 'darwin') {
        cmd = `rm -rf ${logFilePath}`
    }
    const process = spawn(cmd, { shell: true, stdio: "ignore", detached: true });
    process.unref();
}

export default Config;