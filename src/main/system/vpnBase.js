import { app } from "electron";
import { spawn } from "child_process"
import path from "path";
const util = require('util');
const exec = util.promisify(require('child_process').exec);
import { getDefaultGateway } from "./defaultGateway"
import child_process from "child_process";
import { SocksClient } from 'socks';
import { saveV2rayConfig } from "./v2rayConfig";

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

}

// Todo case of triggered disconnection while connection in progress and connected is true
// Todo handle the case of multiple vpn disconnection function call on closing and error [ now it wont cause any bugs for performance optimization ]
// Todo integrate vpn spawn  into vpnObj variable

export function vpnConnet() {
    console.log(global.sessionTempDir.path);
    gateway = global.gateway
    vpnObj.gateway = gateway
        if(saveV2rayConfig(import.meta.env.VITE_SERVER_IP, parseInt(import.meta.env.VITE_SERVER_PORT), import.meta.env.VITE_SERVER_UUID)){ // Todo make this function async and use await
            vpnObj.triggerConnection(gateway)
        }else{
            vpnObj.triggerDisconnection();
        }
}

export function vpnConnetFx(gateway) {

    console.log("VPN connection initializing...");
    global.mainWindow.webContents.send('connectionStatus', 'VPN connection initializing...');

    console.log(`gateway ${gateway}`);
    vpnObj.connectionProgress = true;

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
            onVpnConnected();

            v2ray.stdout.removeListener('data', onDataReceived);
        }
    }

    v2ray.stdout.on('data', onDataReceived);

    // v2ray.stderr.on('data', (data) => {
    //     console.error(`child stderr:\n${data}`);
    // });

    function onVpnConnected() {
        console.log("V2ray tunnel created");
        global.mainWindow.webContents.send('connectionStatus', 'V2ray tunnel created');
        vpnObj.v2ray = v2ray;
        // if(checkConnectivity('127.0.0.1', 10808)){
        //     startSocksInternalTunnel();
        //     console.log("vpn server internet connectivity check passed...");
        // }else{
        //     console.log("vpn server internet connectivity check failed...");
        //     vpnObj.triggerDisconnection();
        // }
        startSocksInternalTunnel();

    }


    function startSocksInternalTunnel() {
        console.log("starting socks internal tunnel");

        const tun2socksPath = path.join(basePath, 'tun2socks.exe');

        const tun2socks = spawn(tun2socksPath, [
            '-tcp-auto-tuning',
            '-device', 'tun://sentinal_vpn',
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

            if (output.includes('level=info msg="[STACK] tun://sentinal_vpn <-> socks5://127.0.0.1:10808')) {
                onTun2SocksConnected();
                tun2socks.stdout.removeListener('data', onDataReceived);
            }
        }

        tun2socks.stdout.on('data', onDataReceived);

        // tun2socks.stderr.on('data', (data) => {
        //     console.error(`child stderr:\n${data}`);
        // });

        function onTun2SocksConnected() {
            console.log("Tun2socks tunnel created");
            global.mainWindow.webContents.send('connectionStatus', 'adapter created');
            vpnObj.tun2socks = tun2socks
            // Now start the other process
            startAnotherCommand();
        }

        function startAnotherCommand() {
            console.log("Starting another command after tun2socks...");
            setStaticIP()
                .then(() => {
                    vpnObj.setStaticIP = true;
                    return setDnsServer()
                })
                .then(() => {
                    vpnObj.setDnsServer = true;

                    return addVpnRoute(gateway)
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
                    // setTimeout(() => {
                    //     vpnObj.triggerDisconnection()
                    // },10000)
                    global.mainWindow.webContents.send('connectionStatus', 'VPN connection established');

                })
                .catch((e) => {
                    vpnObj.connected = false;
                    console.log("vpn connection error: " + e.message);
                    vpnObj.triggerDisconnection();
                });
        }

    }

}


function setStaticIP() {
    console.log("assigning static ip to internal adapter");
    return exec('netsh interface ipv4 set address name="sentinal_vpn" source=static addr=192.168.123.1 mask=255.255.255.0');
}

function setDnsServer() {
    console.log('enabling custom DNS server');
    return exec('netsh interface ipv4 set dnsservers name="sentinal_vpn" static address=1.1.1.1 register=none validate=no');

}

function addGlobalRoute() {
    console.log("global traffic routing rule ");
    return exec('netsh interface ipv4 add route 0.0.0.0/0 "sentinal_vpn" 192.168.123.1 metric=1');
}

function addVpnRoute(gateway) {
    console.log("vpn traffic routing rule ");
    return exec(`route add 47.129.9.91 mask 255.255.255.255 ${gateway}`);
}

export function vpnDisconnect() {
    if(vpnObj.disconnectionProgress) {
        console.log("vpn disconnection in progress");
        return;
    }else{
        console.log("vpn disconnection started...");
        vpnObj.disconnectionProgress = true;
        setTimeout(() => {vpnObj.disconnectionProgress = false},10000) // 10 seconds timeout for disconnection status cleanup on error
        let keys = Object.keys(vpnObj).reverse();
        keys.forEach((key) => {
            console.log(`cleaning vpn object key :=> ${key}`);
            vpnConnCleanup(key);
        })
        if(!vpnObj.connected) {
            console.log("vpn disconnected");
        }
        vpnObj.disconnectionProgress = false;
        vpnObj.connected = false;
        vpnObj.connectionProgress = false;
    }
    try {
        global.mainWindow.webContents.send('connectionStatus', 'VPN disconnected');
    } catch (error) {
    }
    
}

function vpnConnCleanup(key) {

    switch (key) {
        case "addGlobalRoute":
            if (vpnObj["setStaticIP"]) {

                child_process.exec('netsh interface ipv4 delete route 0.0.0.0/0 "sentinal_vpn" 192.168.123.1', (err, result) => {
                    if (!err) {
                        vpnObj["addGlobalRoute"] = false;
                    }
                })
            }
            break;
        case "addVpnRoute":
            if (vpnObj["addVpnRoute"]) {

                child_process.exec(`route delete ${vpnObj.gateway}`, (err, result) => {
                    if (!err) {
                        vpnObj["addVpnRoute"] = false;
                    }

                })
            }
            break;
        case "setDnsServer":
            if (vpnObj["setDnsServer"]) {

                child_process.exec('netsh interface ipv4 set dnsservers name="sentinal_vpn" source=dhcp', (err, result) => {
                    if (!err) {
                        vpnObj["setDnsServer"] = false;
                    }
                })
            }
            break;
        case "setStaticIP":
            if (vpnObj["setStaticIP"]) {
                child_process.exec('netsh interface ipv4 set address name="sentinal_vpn" source=dhcp', (err, result) => {
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
        proxy: {
            ipaddress: proxyIp,
            port: proxyPort,
            type: 5
        },
        command: 'connect',
        destination: {
            host: '1.1.1.1', 
            port: 80
        }
    };

    try {
        const info = await SocksClient.createConnection(options);
        info.socket.end();
        return true;
    } catch (error) {
        console.error(`Failed to connect: ${error.message}`);
        return false;
    }
}


export { vpnObj };