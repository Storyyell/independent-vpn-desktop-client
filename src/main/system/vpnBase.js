import { app } from "electron";
import { spawn } from "child_process"
import path from "path";
const util = require('util');
const exec = util.promisify(require('child_process').exec);
import { getDefaultGateway } from "./defaultGateway"
import child_process from "child_process";

var vpnStatusObj = {
    connected: false,
    v2ray: null,
    tun2socks: null,
    setStaticIP: false,
    setDnsServer: false,
    addVpnRoute: false,
    addGlobalRoute: false,
    gateway: null,
}


export function vpnConnet() {
    getDefaultGateway()
        .then((gateway) => {
            vpnStatusObj.gateway = gateway
            vpnConnetFx(gateway)
        })
        .catch((e) => { console.log(e); });
}

export function vpnConnetFx(gateway) {

    console.log("VPN connection initializing...");

    console.log(`gateway ${gateway}`);

    let basePath = path.join(__dirname, "../../resources/bin/");

    const v2rayPath = path.join(basePath, 'v2ray.exe');
    const configPath = path.join(basePath, 'config.json');

    const v2ray = spawn(v2rayPath, ['-config', configPath],);

    v2ray.on('error', (error) => {
        console.error(`Failed to start v2ray process: ${error.message}`);
    });

    v2ray.on('close', (code) => {
        console.log(`v2ray process exited with code ${code}`);
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

    v2ray.stderr.on('data', (data) => {
        console.error(`child stderr:\n${data}`);
    });

    function onVpnConnected() {
        console.log("V2ray tunnel created");
        vpnStatusObj.v2ray = v2ray;
        startSocksInternalTunnel();
    }


    function startSocksInternalTunnel() {
        console.log("starting socks internal tunnel");

        const tun2socksPath = path.join(basePath, 'tun2socks.exe');

        const tun2socks = spawn(tun2socksPath, [
            '-tcp-auto-tuning',
            '-device', 'tun://wintun',
            '-proxy', 'socks5://127.0.0.1:10808'
        ]);

        tun2socks.on('error', (error) => {
            console.error(`Failed to start tun2socks process: ${error.message}`);
        });

        tun2socks.on('close', (code) => {
            console.log(`tun2socks process exited with code ${code}`);
            vpnStatusObj.connected = false;
        });

        function onDataReceived(data) {
            const output = data.toString();
            console.log(`child stdout:\n${output}`);

            if (output.includes('level=info msg="[STACK] tun://wintun <-> socks5://127.0.0.1:10808')) {
                onTun2SocksConnected();
                tun2socks.stdout.removeListener('data', onDataReceived);
            }
        }

        tun2socks.stdout.on('data', onDataReceived);

        tun2socks.stderr.on('data', (data) => {
            console.error(`child stderr:\n${data}`);
        });

        function onTun2SocksConnected() {
            console.log("Tun2socks tunnel created");

            vpnStatusObj.tun2socks = tun2socks
            // Now start the other process
            startAnotherCommand();
        }

        function startAnotherCommand() {
            console.log("Starting another command after tun2socks...");
            setStaticIP()
                .then(() => {
                    vpnStatusObj.setStaticIP = true;
                    return setDnsServer()
                })
                .then(() => {
                    vpnStatusObj.setDnsServer = true;

                    return addVpnRoute(gateway)
                })
                .then(() => {
                    vpnStatusObj.addVpnRoute = true;

                    return addGlobalRoute()
                })
                .then(() => {
                    vpnStatusObj.addGlobalRoute = true;
                    vpnStatusObj.connected = true;
                    console.log(vpnStatusObj);
                    console.log("vpn connection established");
                })
                .catch((e) => {
                    vpnStatusObj.connected = false;
                    console.log("vpn connection error: " + e.message);
                });
        }

    }

}


function setStaticIP() {
    console.log("assigning static ip to internal adapter");
    return exec('netsh interface ipv4 set address name="wintun" source=static addr=192.168.123.1 mask=255.255.255.0');
}

function setDnsServer() {
    console.log('enabling custom DNS server');
    return exec('netsh interface ipv4 set dnsservers name="wintun" static address=8.8.8.8 register=none validate=no');

}

function addGlobalRoute() {
    console.log("global traffic routing rule ");
    return exec('netsh interface ipv4 add route 0.0.0.0/0 "wintun" 192.168.123.1 metric=1');
}

function addVpnRoute(gateway) {
    console.log("vpn traffic routing rule ");
    return exec(`route add 47.129.9.91 mask 255.255.255.255 ${gateway}`);
}

export function vpnDisconnect() {
    let keys = Object.keys(vpnStatusObj).reverse();
    keys.forEach((key) => {
        vpnConnCleanup(key);
    })
    if(!vpnStatusObj.connected) {
        console.log("vpn disconnected");
    }
}

function vpnConnCleanup(key) {

    switch (key) {
        case "addGlobalRoute":
            if (vpnStatusObj["setStaticIP"]) {

                child_process.exec('netsh interface ipv4 delete route 0.0.0.0/0 "wintun" 192.168.123.1', (err, result) => {
                    if (!err) {
                        vpnStatusObj["addGlobalRoute"] = false;
                    }
                })
            }
            break;
        case "addVpnRoute":
            if (vpnStatusObj["addVpnRoute"]) {

                child_process.exec(`route delete ${vpnStatusObj.gateway}`, (err, result) => {
                    if (!err) {
                        vpnStatusObj["addVpnRoute"] = false;
                    }

                })
            }
            break;
        case "setDnsServer":
            if (vpnStatusObj["setDnsServer"]) {

                child_process.exec('netsh interface ipv4 set dnsservers name="wintun" source=dhcp', (err, result) => {
                    if (!err) {
                        vpnStatusObj["setDnsServer"] = false;
                    }
                })
            }
            break;
        case "setStaticIP":
            if (vpnStatusObj["setStaticIP"]) {
                child_process.exec('netsh interface ipv4 set address name="wintun" source=dhcp', (err, result) => {
                    if (!err) {
                        vpnStatusObj["setStaticIP"] = false;
                    }
                })
            }
            break;
        case "tun2socks":
            if (vpnStatusObj["tun2socks"] != null) {
                vpnStatusObj.tun2socks.kill();
                vpnStatusObj.tun2socks = null;
            }
            break;
        case "v2ray":
            if (vpnStatusObj["v2ray"] != null) {
                vpnStatusObj.v2ray.kill();
                vpnStatusObj.v2ray = null;
            }
            break;
        case "connected":
            if (vpnStatusObj["connected"]) {
                vpnStatusObj.connected = false;
                vpnStatusObj.gateway = null;
            }
            break;
        case "gateway":
            if (vpnStatusObj["gateway"] != null) {
                vpnStatusObj.gateway = null;
            }
            break;
        default:
            break
    }
}
