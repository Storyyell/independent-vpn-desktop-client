import fs from 'node:fs';
import path from 'node:path';
import Config from '../Config/Config';
const atob = require('atob');


export async function saveV2rayConfig(serverObj) {

    const appConfig = new Config();
    let vpn_profile = decode_v2ray_vpn_profile(serverObj.payload, serverObj.uid);
    if (vpn_profile) {
        try {
            const filePath = appConfig.configPath
            const directoryPath = path.dirname(filePath);
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, { recursive: true });
            }
            await fs.promises.writeFile(filePath, gen_conf(vpn_profile.uid, vpn_profile.address, vpn_profile.listen_port), { flag: 'w' });
            return { uuid: vpn_profile.uid, address: vpn_profile.address, listen_port: vpn_profile.listen_port };
        } catch (err) {
            console.error(err);
            throw Error("Failed to cache VPN profile");
        }
    } else {
        console.log("Failed to decode VPN profile");
        throw Error("Failed to decode VPN profile");
    }
}


function gen_conf(user_id, address, port) {
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
                                    "id": "${user_id}",
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
    return config;
}

class V2RayVpnProfile {
    constructor(uid, address, listen_port, transport) {
        this.uid = uid;
        this.address = address;
        this.listen_port = listen_port;
        this.transport = transport;
    }
}

function decode_v2ray_vpn_profile(payload, uid) {
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
        
        return new V2RayVpnProfile(uid, address, port, transport);
    } catch (e) {
        return null;
    }
}
