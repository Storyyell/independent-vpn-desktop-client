import Config from '../../Config/Config';
import axios from 'axios';

class SENTINEL_API {
  constructor() {
    if (SENTINEL_API.instance instanceof SENTINEL_API) {
      return SENTINEL_API.instance;
    }

    this.appConfig = new Config();
    this.deviceToken = '';
    this.protocol = 'V2RAY';

    SENTINEL_API.instance = this;
  }

  async registerDevice() {
    const appkey = this.appConfig.appKey;
    const apiUrl = this.appConfig.apiDomain;

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
    try {
      const response = await axios.request(config);
      this.deviceToken = response.data?.data?.token;
      return this.deviceToken;
    } catch (error) {
      console.error("registerDevice error: ", error);
      throw error;
    }
  }

  async pullCountryList() {
    const appkey = this.appConfig.appKey;
    const apiUrl = this.appConfig.apiDomain;
    if (!this.deviceToken) {
      throw new Error('Device token not found. Please register device first');
    }

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://${apiUrl}/countries?protocol=${this.protocol}`,
      headers: {
        'x-app-token': appkey,
        'x-device-token': this.deviceToken
      }
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("pullCountryList error:");
      throw error;
    }
  }

  async pullCityList(countryCode) {
    const appkey = this.appConfig.appKey;
    const apiUrl = this.appConfig.apiDomain;
    if (!this.deviceToken) {
      throw new Error('Device token not found. Please register device first');
    }

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://${apiUrl}/countries/${countryCode}/cities?protocol=${this.protocol}`,
      headers: {
        'x-app-token': appkey,
        'x-device-token': this.deviceToken
      }
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("pullCityList error:");
      throw error;
    }
  }

  async pullServerList(countryCode, cityCode) {
    const appkey = this.appConfig.appKey;
    const apiUrl = this.appConfig.apiDomain;
    const paginationOffset = 0;
    const paginationLimit = 10;
    if (!this.deviceToken) {
      throw new Error('Device token not found. Please register device first');
    }


    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://${apiUrl}/countries/${countryCode}/cities/${cityCode}/servers?sortyBy=CURRENT_LOAD&offset=${paginationOffset}&limit=${paginationLimit}&protocol=${this.protocol}`,
      headers: {
        'x-app-token': appkey,
        'x-device-token': this.deviceToken
      }
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("pullServerList error:");
      throw error;
    }
  }

  async pullServerConf(countryCode, cityCode, serverId) {
    const appkey = this.appConfig.appKey;
    const apiUrl = this.appConfig.apiDomain;
    if (!this.deviceToken) {
      throw new Error('Device token not found. Please register device first');
    }

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://${apiUrl}/countries/${countryCode}/cities/${cityCode}/servers/${serverId}/credentials`,
      headers: {
        'x-app-token': appkey,
        'x-device-token': this.deviceToken
      }
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("pullServerConf error:");
      throw new Error('server config fetch failed');
    }
  }

}

export default SENTINEL_API;
