import { app } from "electron";
import { spawn } from "child_process"
import path from "path";
const util = require('util');
const exec = util.promisify(require('child_process').exec);
import { getDefaultGateway } from "./defaultGateway"
import child_process from "child_process";
import { SocksClient } from 'socks';
import { saveV2rayConfig } from "./v2rayConfig";
import dns from "dns";
import net from "net";
import axios from 'axios';
const https = require('https');
import { pullServerConf } from "./ipcs";


var vpnObj = {
    connected: false,
    v2ray: null,
    tun2socks: null,
    setStaticIP: false,
    setDnsServer: false,
    addVpnRoute: false,
    addGlobalRoute: false,
    gateway: null,
    triggerConnection:vpnConnetFx,
    triggerDisconnection:vpnDisconnect,
    disconnectionProgress:false,
    connectionProgress:false,
    serverIp:null,
    serverAddress:null,
    serverPort:null,
    serverUUID:null
}

// Todo case of triggered disconnection while connection in progress and connected is true
// Todo handle the case of multiple vpn disconnection function call on closing and error [ now it wont cause any bugs for performance optimization ]
// Todo integrate vpn spawn  into vpnObj variable

export async function vpnConnet(serverParms) {
    vpnObj.connectionProgress = true;
    console.log(global.sessionTempDir.path);
    try {
        const gateway = await getDefaultGateway();
        vpnObj.gateway = gateway;
        console.log("VPN connection initializing...");
        global.mainWindow.webContents.send('connectionStatus', 'VPN connection initializing...');
        global.mainWindow.webContents.send('connectionStatus', 'Fetching server configuration...');
        const res = await pullServerConf(serverParms.device_token, serverParms.countryCode, serverParms.cityCode, serverParms.serverId);
        const serverObj = res.data;
        const { uuid, address:server_address, listen_port} = await saveV2rayConfig(serverObj);
        
        // updating server parms
        vpnObj.serverAddress = server_address;
        vpnObj.serverPort = listen_port;
        vpnObj.serverUUID = uuid;
        
        // getting server ip
        const serverIp = await getIPv4(server_address);
        vpnObj.serverIp = serverIp;
        console.log(`server ip: ${vpnObj.serverIp}`);
        
        vpnObj.triggerConnection(gateway);

    } catch (e) {
        console.log("error in VPN connection: " + e.message);
        vpnObj.triggerDisconnection();
    }
}

export function vpnConnetFx() {

    console.log(`gateway ${vpnObj.gateway}`);
    
    let basePath = path.join(__dirname, "../../resources/bin/");
    
    // Todo want to find a another way to use the resourcesPath from the main process in production
    if (app.isPackaged) {
        // When the app is packaged, the "resourcesPath" points to the "resources" directory adjacent to app.asar
        basePath = path.join(process.resourcesPath, 'app.asar.unpacked/resources/bin');
    }

    const v2rayPath = path.join(basePath, 'v2ray.exe');
    // const configPath = path.join(basePath, 'config.json');
    const configPath = path.join(global.sessionTempDir.path ,`${global.sessionTempDir.uuid}.json`);


    const v2ray = spawn(v2rayPath, ['-config', configPath],);

    v2ray.on('error', (error) => {
        console.error(`Failed to start v2ray process: ${error.message}`);
        vpnObj.triggerDisconnection();
    });

    v2ray.on('close', (code) => {
        console.log(`v2ray process exited with code ${code}`);
        vpnObj.triggerDisconnection();

    });

    function onDataReceived(data) {
        const output = data.toString();
        console.log(`child stdout:\n${output}`);

        if (output.includes('started')) {
            v2ray.stdout.removeListener('data', onDataReceived);
            vpnObj.v2ray = v2ray;
            onVpnConnected();
        }
    }

    v2ray.stdout.on('data', onDataReceived);

    // v2ray.stderr.on('data', (data) => {
    //     console.error(`child stderr:\n${data}`);
    // });

    function onVpnConnected() {
        console.log("V2ray tunnel created");
        global.mainWindow.webContents.send('connectionStatus', 'V2ray tunnel created');
        checkConnectivity('127.0.0.1', 10808)
            .then(() => {
                    console.log("connectivity check passed");
                    startSocksInternalTunnel();
            })
            .catch((e) => {
                console.log("error in checking connectivity: " + e.message);
                vpnObj.triggerDisconnection();
            });
    }


    function startSocksInternalTunnel() {
        console.log("starting socks internal tunnel");

        const tun2socksPath = path.join(basePath, 'tun2socks.exe');

        const tun2socks = spawn(tun2socksPath, [
            '-tcp-auto-tuning',
            '-device', 'tun://sentinel_vpn',
            '-proxy', 'socks5://127.0.0.1:10808'
        ]);

        tun2socks.on('error', (error) => {
            console.error(`Failed to start tun2socks process: ${error.message}`);
            vpnObj.triggerDisconnection();
        });

        tun2socks.on('close', (code) => {
            console.log(`tun2socks process exited with code ${code}`);
            vpnObj.connected = false;
            vpnObj.triggerDisconnection();

        });

        function onDataReceived(data) {
            const output = data.toString();
            console.log(`child stdout:\n${output}`);

            if (output.includes('level=info msg="[STACK] tun://sentinel_vpn <-> socks5://127.0.0.1:10808')) {
                vpnObj.tun2socks = tun2socks
                tun2socks.stdout.removeListener('data', onDataReceived);
                onTun2SocksConnected();
            }
        }

        tun2socks.stdout.on('data', onDataReceived);

        // tun2socks.stderr.on('data', (data) => {
        //     console.error(`child stderr:\n${data}`);
        // });

        function onTun2SocksConnected() {
            console.log("Tun2socks tunnel created");
            global.mainWindow.webContents.send('connectionStatus', 'adapter created');
            startAnotherCommand();
        }

        function startAnotherCommand() {
            console.log("Starting command post tun2socks...");
            setStaticIP()
                .then(() => {
                    vpnObj.setStaticIP = true;
                    return setDnsServer()
                })
                .then(() => {
                    vpnObj.setDnsServer = true;

                    return addVpnRoute(vpnObj.gateway)
                })
                .then(() => {
                    vpnObj.addVpnRoute = true;

                    return addGlobalRoute()
                })
                .then(() => {
                    vpnObj.addGlobalRoute = true;
                    vpnObj.connected = true;
                    vpnObj.connectionProgress = false;
                    console.log("vpn connection established");
                    global.vpnConnStatus= true;
                    global.mainWindow.webContents.send('connectionStatus', 'VPN connection established');
                })
                .catch((e) => {
                    console.log("vpn connection error: " + e.message);
                    vpnObj.triggerDisconnection();
                });
        }

    }

}


function setStaticIP() {
    console.log("assigning static ip to internal adapter");
    return exec('netsh interface ipv4 set address name="sentinel_vpn" source=static addr=192.168.123.1 mask=255.255.255.0');
}

function setDnsServer() {
    console.log('enabling custom DNS server');
    return exec('netsh interface ipv4 set dnsservers name="sentinel_vpn" static address=1.1.1.1 register=none validate=no');

}

function addGlobalRoute() {
    console.log("global traffic routing rule ");
    return exec('netsh interface ipv4 add route 0.0.0.0/0 "sentinel_vpn" 192.168.123.1 metric=1');
}

function addVpnRoute(gateway) {
    console.log("vpn traffic routing rule ");
    return exec(`route add ${vpnObj.serverIp} mask 255.255.255.255 ${gateway}`);
}

export function vpnDisconnect() {

    global.vpnConnStatus = false;

    if( vpnObj.connectionProgress || vpnObj.connected ) {
        console.log("vpn disconnection started...");
        vpnObj.connectionProgress = false;
        vpnObj.disconnectionProgress = true;
        setTimeout(() => {vpnObj.disconnectionProgress = false}, 5000) // 10 seconds timeout for disconnection status cleanup on error
        let keys = Object.keys(vpnObj).reverse();
        keys.forEach((key) => {
            console.log(`cleaning vpn object key :=> ${key}`);
            vpnConnCleanup(key);
        })
        if(!vpnObj.connected) {
            console.log("vpn disconnected");
        }
        vpnObj.connected= false;
        vpnObj.disconnectionProgress = false;
        try {global.mainWindow.webContents.send('connectionStatus', 'VPN disconnected');} catch (e) {}
    }else{
        return;
    }
}

function vpnConnCleanup(key) {

    switch (key) {
        case "addGlobalRoute":
            if (vpnObj["setStaticIP"]) {

                child_process.exec('netsh interface ipv4 delete route 0.0.0.0/0 "sentinel_vpn" 192.168.123.1', (err, result) => {
                    if (!err) {
                        vpnObj["addGlobalRoute"] = false;
                    }
                })
            }
            break;
        case "addVpnRoute":
            if (vpnObj["addVpnRoute"]) {

                child_process.exec(`route delete ${vpnObj.serverIp}`, (err, result) => {
                    if (!err) {
                        vpnObj["addVpnRoute"] = false;
                    }

                })
            }
            break;
        case "setDnsServer":
            if (vpnObj["setDnsServer"]) {

                child_process.exec('netsh interface ipv4 set dnsservers name="sentinel_vpn" source=dhcp', (err, result) => {
                    if (!err) {
                        vpnObj["setDnsServer"] = false;
                    }
                })
            }
            break;
        case "setStaticIP":
            if (vpnObj["setStaticIP"]) {
                child_process.exec('netsh interface ipv4 set address name="sentinel_vpn" source=dhcp', (err, result) => {
                    if (!err) {
                        vpnObj["setStaticIP"] = false;
                    }
                })
            }
            break;
        case "tun2socks":
            if (vpnObj["tun2socks"] != null) {
                vpnObj.tun2socks.kill();
                vpnObj.tun2socks = null;
            }
            break;
        case "v2ray":
            if (vpnObj["v2ray"] != null) {
                vpnObj.v2ray.kill();
                vpnObj.v2ray = null;
            }
            break;
        case "connected":
            if (vpnObj["connected"]) {
                vpnObj.connected = false;
                vpnObj.gateway = null;
            }
            break;
        case "gateway":
            if (vpnObj["gateway"] != null) {
                vpnObj.gateway = null;
            }
            break;
        default:
            break
    }
}


async function checkConnectivity(proxyIp, proxyPort) {
    const options = {
        hostname: 'www.google.com',
        port: 443,
        path: '/',
        method: 'GET',
        timeout: 3000 // 3 seconds timeout
    };

    // Create a socks agent
    const agent = await SocksClient.createConnection({
        proxy: {
            ipaddress: proxyIp,
            port: proxyPort,
            type: 5 // For SOCKS5
        },
        command: 'connect',
        destination: {
            host: options.hostname,
            port: options.port
        }
    });

    global.mainWindow.webContents.send('connectionStatus', 'checking connectivity...');

    options.agent = new https.Agent({ socket: agent.socket });

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                console.log('Successfully connected to www.google.com');
                global.mainWindow.webContents.send('connectionStatus', 'internet connectivity check passed...');

                resolve(true);
            });
        });

        req.on('error', (e) => {
            console.error(`Request error: ${e.message}`);
            global.mainWindow.webContents.send('connectionStatus', 'internet connectivity check failed...');

            reject('internet connectivity check failed...');
        });

        req.on('timeout', () => {
            req.end();
            console.error('Request timeout after 3 seconds.');
            global.mainWindow.webContents.send('connectionStatus', 'internet connectivity check failed...');

            reject('internet connectivity check failed...');
        });

        req.end();
    });
}

async function getIPv4(input) {
    return new Promise((resolve, reject) => {
        if (net.isIPv4(input)) {
            resolve(input);
        } else {
            dns.resolve4(input, (err, addresses) => {
                if (err) {
                    reject('Failed to resolve server address');
                } else {
                    resolve(addresses[0]);
                }
            });
        }
    });
}

export { vpnObj };
