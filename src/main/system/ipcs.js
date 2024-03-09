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