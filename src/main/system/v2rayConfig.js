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
                "mux": {
                    "concurrency": -1,
                    "enabled": false,
                    "xudpConcurrency": 8,
                    "xudpProxyUDP443": ""
                },
                "protocol": "vmess",
                "settings": {
                    "vnext": [
                        {
                            "address": serverIp,
                            "port": serverPort,
                            "users": [
                                {
                                    "alterId": 0,
                                    "encryption": "",
                                    "flow": "",
                                    "id": serverId,
                                    "level": 8,
                                    "security": "auto"
                                }
                            ]
                        }
                    ]
                },
                "streamSettings": {
                    "network": "ws",
                    "security": "tls",
                    "tlsSettings": {
                        "allowInsecure": false,
                        "fingerprint": "",
                        "serverName": "",
                        "show": false
                    },
                    "wsSettings": {
                        "headers": {
                            "Host": ""
                        },
                        "path": "/"
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