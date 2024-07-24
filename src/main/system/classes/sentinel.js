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
      console.error("registerDevice error ");
      throw error;
    }
  }

  setDeviceToken(token) {
    this.deviceToken = token;
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
      console.error("pullCountryList error");
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
      console.error("pullCityList error");
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
      console.error("pullServerList error");
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
      console.error("pullServerConf error");
      throw error
    }
  }

  extractVpnConf(vpnPayloadobfs) {
    const { data:{protocol, payload, uid } } = vpnPayloadobfs;
    
    if (protocol !== 'V2RAY') {
      throw new Error('Unsupported VPN protocol');
    }
    return this.decodeV2RAYConf(payload, uid);
  }

  decodeV2RAYConf(payload, uid) {
    try {
        let bytes_ = Buffer.from(atob(payload), 'binary');
        
        if (bytes_.length != 7) {
            return null;
        }
        
        let address = Array.from(bytes_.slice(0, 4)).join('.');
        
        let port = (bytes_[4] << 8) + bytes_[5];
        
        let transport_map = {
            1: "tcp",
            2: "mkcp",
            3: "websocket",
            4: "http",
            5: "domainsocket",
            6: "quic",
            7: "gun",
            8: "grpc",
        };
        let transport = transport_map[bytes_[6]] || "";

        // now we have uid, address, port, transport

        let config = `{
          "dns": {
              "hosts": {
                  "domain:googleapis.cn": "googleapis.com"
              },
              "servers": [
                  "1.1.1.1"
              ]
          },
          "inbounds": [
              {
                  "listen": "127.0.0.1",
                  "port": 10808,
                  "protocol": "socks",
                  "settings": {
                      "auth": "noauth",
                      "udp": true,
                      "userLevel": 8
                  },
                  "sniffing": {
                      "destOverride": [
                          "http",
                          "tls"
                      ],
                      "metadataOnly": false,
                      "routeOnly": false,
                      "excludedDomains": {},
                      "enabled": true
                  },
                  "tag": "socks"
              }
          ],
          "log": {
              "loglevel": "info"
          },
          "outbounds": [
              {
                  "mux": {
                      "concurrency": 8,
                      "enabled": false
                  },
                  "protocol": "vmess",
                  "settings": {
                      "vnext": [
                          {
                              "address": "${address}",
                              "port": ${port},
                              "users": [
                                  {
                                      "alterId": 0,
                                      "encryption": "",
                                      "flow": "",
                                      "id": "${uid}",
                                      "level": 8,
                                      "security": "auto"
                                  }
                              ]
                          }
                      ]
                  },
                  "streamSettings": {
                      "network": "grpc",
                      "grpcSettings": {
                          "serviceName": "",
                          "multiMode": false
                      }
                  },
                  "tag": "proxy"
              },
              {
                  "protocol": "freedom",
                  "settings": {},
                  "tag": "direct"
              },
              {
                  "protocol": "blackhole",
                  "settings": {
                      "response": {
                          "type": "http"
                      }
                  },
                  "tag": "block"
          }
        ],
        "routing": {
          "domainStrategy": "IPIfNonMatch",
          "rules": [
            {
              "ip": [
                          "1.1.1.1"
                      ],
                      "outboundTag": "proxy",
                      "port": "53",
                      "type": "field"
                  }
              ]
          }
        }`;

        return {config,
                  port,
                  uid,
                  endpoint: address,
                };
    } catch (e) {
        console.error('v2ray config decode error');
        throw e;
    }
    }

}

export default SENTINEL_API;
