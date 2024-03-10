import axios from 'axios';

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
                console.log(error);
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
                console.log(error);
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
            console.log(error);
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
            console.log(error);
            reject(error)
        });
})
}

// pullServerConf

export async function pullServerConf(device_token, countryCode, cityCode, serverId) {

const appkey = import.meta.env.VITE_SERVER_APP_KEY
const apiUrl = import.meta.env.VITE_SERVER_API_URL

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `https://${apiUrl}/countries/${countryCode}/cities/${cityCode}/servers/${serverId}/credentials`,
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
            console.log(error);
            reject(error)
            
        });
})
}
