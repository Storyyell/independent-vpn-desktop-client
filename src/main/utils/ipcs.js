import axios from 'axios';
const { Notification } = require('electron')
// import { vpnObj } from './vpnBase';
import log from 'electron-log/main';
import { exec } from 'child_process';
const axiosRetry = require('axios-retry').default;

export async function getIp(device_token) {
    const ipApikey = import.meta.env.VITE_IP_API_KEY;
    const apiUrl = "pro.ip-api.com";

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://${apiUrl}/json/?key=${ipApikey}`,
        headers: { }
    };

    const client = axios.create({});
    axiosRetry(client, { 
        retries: 3,
        retryDelay: axiosRetry.exponentialDelay,
    });

    try {
        const response = await client.request(config);
        return response.data;
    } catch (error) {
        // log.error("getIp error:");
        // throw new Error('ipfetch failed');
    }
}

export async function showNotification(title, body) {

    const NOTIFICATION_TITLE = title
    const NOTIFICATION_BODY = body
    new Notification({
        title: NOTIFICATION_TITLE,
        body: NOTIFICATION_BODY
    }).show()
}

export async function getVpnMetric() {
    return
}


// todo want to change log file open logic later
export async function openLogFile() {
    return new Promise((resolve, reject) => {
        const logFilePath = log.transports.file.getFile().path;

        exec(`start ${logFilePath}`, (error, stdout, stderr) => {
            if (error) {
                console.error('Error:', error);
                reject(error);
            }
            if (stderr) {
                console.error('Stderr:', stderr);
                reject(stderr);
            }

            console.log('Log file opened successfully');
            resolve();
        });
    });
}