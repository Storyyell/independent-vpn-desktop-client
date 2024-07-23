import os from 'os'
import path from 'path'
import Randomstring from 'randomstring';
const fsPromises = require('fs').promises;
const { spawn } = require("child_process");
import log from 'electron-log/main';
import process from 'process';

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
        await fsPromises.mkdir(this.configDirPath, {recursive: true});
    }

    deleteConfigDirectory() {
        let cmd = '';
    
        if (process.platform === 'win32') {
            cmd = ['rd', '/s', '/q', this.configDirPath];
        } else if (process.platform === 'linux' || process.platform === 'darwin') {
            cmd = `rm -rf ${this.configDirPath}`;
        }
    
        const shell = process.platform === 'win32' ? process.env.comspec : true;
        const args = process.platform === 'win32' ? ['/c', ...cmd] : [cmd];
    
        const childProcess = spawn(shell, args, { stdio: 'ignore', detached: true });
        childProcess.unref();
    }

}

export function deleteLogFiles() {
    const logFilePath = log.transports.file.getFile().path;
    let cmd = '';
    
    if (process.platform === 'win32') {
        cmd = ['rd', '/s', '/q', logFilePath];
    } else if (process.platform === 'linux' || process.platform === 'darwin') {
        cmd = `rm -rf ${logFilePath}`;
    }

    const shell = process.platform === 'win32' ? process.env.comspec : true;
    const args = process.platform === 'win32' ? ['/c', ...cmd] : [cmd];

    const childProcess = spawn(shell, args, { stdio: 'ignore', detached: true });
    childProcess.unref();
}

export default Config;