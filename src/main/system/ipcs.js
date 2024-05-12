import axios from 'axios';
const { Notification } = require('electron')
import { vpnObj } from './vpnBase';
import log from 'electron-log/main';
import { exec } from 'child_process';


export async function registerDevice() {

    const appkey = import.meta.env.VITE_SERVER_APP_KEY
    const apiUrl = import.meta.env.VITE_SERVER_API_URL

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://${apiUrl}/device`,
        headers: {
            'x-app-token': appkey,
            'Content-Type': 'application/json'
        },
        data: {
            "platform": "OTHER"
        }
    };
    return new Promise((resolve, reject) => {
        axios.request(config)
            .then((response) => {
                resolve(response.data?.data?.token);
            })
            .catch((error) => {
                log.error("registerDevice error: ");
                reject(error)
            });
    })
}

export async function pullCountryList(device_token) {

    const appkey = import.meta.env.VITE_SERVER_APP_KEY
    const apiUrl = import.meta.env.VITE_SERVER_API_URL

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://${apiUrl}/countries?protocol=V2RAY`,
        headers: {
            'x-app-token': appkey,
            'x-device-token': device_token
        }
    };

    return new Promise((resolve, reject) => {
        axios.request(config)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                log.error("pullCountryList error:");
                // log.error(error);
                reject(error)
            });
    })
}

export async function pullCityList(device_token, countryCode) {
    // console.log(`countryCode: ${countryCode}`);

    const appkey = import.meta.env.VITE_SERVER_APP_KEY
    const apiUrl = import.meta.env.VITE_SERVER_API_URL

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://${apiUrl}/countries/${countryCode}/cities?protocol=V2RAY`,
        headers: {
            'x-app-token': appkey,
            'x-device-token': device_token
        }
    };

    return new Promise((resolve, reject) => {
        axios.request(config)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                log.error("pullCityList error:");
                reject(error)
            });
    })
}

export async function pullServerList(device_token, countryCode, cityCode) {

    const appkey = import.meta.env.VITE_SERVER_APP_KEY
    const apiUrl = import.meta.env.VITE_SERVER_API_URL

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://${apiUrl}/countries/${countryCode}/cities/${cityCode}/servers?sortyBy=CURRENT_LOAD&offset=0&limit=10&protocol=V2RAY`,
        headers: {
            'x-app-token': appkey,
            'x-device-token': device_token
        }
    };

    return new Promise((resolve, reject) => {
        axios.request(config)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                log.error("pullServerList error:");
                reject(error)
            });
    })
}

// pullServerConf

export async function pullServerConf(device_token, countryCode, cityCode, serverId) {
    const appkey = import.meta.env.VITE_SERVER_APP_KEY;
    const apiUrl = import.meta.env.VITE_SERVER_API_URL;

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://${apiUrl}/countries/${countryCode}/cities/${cityCode}/servers/${serverId}/credentials`,
        headers: {
            'x-app-token': appkey,
            'x-device-token': device_token
        }
    };

    try {
        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        throw new Error('server config fetch failed');
    }
}


export async function getIp(device_token) {
    const appkey = import.meta.env.VITE_SERVER_APP_KEY;
    const apiUrl = import.meta.env.VITE_SERVER_API_URL;

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://${apiUrl}/ip`,
        headers: {
            'x-app-token': appkey,
            'x-device-token': device_token
        }

    };

    try {
        const response = await axios.request(config);
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
    return vpnObj.statusObj()
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