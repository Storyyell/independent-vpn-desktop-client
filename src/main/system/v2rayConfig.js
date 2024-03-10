import fs from 'node:fs';
import path from 'node:path';

function generateV2rayConfig(serverIp, serverPort, serverId) {  // Todo use protobuff
    return {
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
                    "enabled": true
                },
                "tag": "socks"
            },
            {
                "listen": "127.0.0.1",
                "port": 10809,
                "protocol": "http",
                "settings": {
                    "userLevel": 8
                },
                "tag": "http"
            }
        ],
        "log": {
            "loglevel": "warning"
        },
        "outbounds": [
            {
                "protocol": "vmess",
                "settings": {
                    "vnext": [
                        {
                            "address": serverIp,  // server IP address as a string
                            "port": serverPort,                     // server port as an integer
                            "users": [
                                {
                                    "id": serverId,  // server ID as a string
                                    "alterId": 0,             // alterId as an integer
                                    "security": "auto"        // security type as a string
                                }
                            ]
                        }
                    ]
                },
                "streamSettings": {
                    "network": "ws",
                    "wsSettings": {
                        "path": "/",
                        "headers": {}         // empty object for headers as there are none specified in the vmess link
                    },
                    "security": "tls",
                    "tlsSettings": {
                        "serverName": serverIp   // identical to the address field value for SNI
                    }
                },
                "tag": "proxy"  // Must match the outbound tag from the routing rules
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
    }
}

export function saveV2rayConfig(serverIp, serverPort, serverId) {
    try {
        const filePath = path.join(global.sessionTempDir.path, `${global.sessionTempDir.uuid}.json`);
        const directoryPath = path.dirname(filePath);
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(generateV2rayConfig(serverIp, serverPort, serverId)), { flag: 'w' });
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}