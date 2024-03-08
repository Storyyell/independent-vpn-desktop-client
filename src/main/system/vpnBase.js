import { app } from "electron";
import { spawn } from "child_process"
import path from "path";
const util = require('util');
const exec = util.promisify(require('child_process').exec);
import {getDefaultGateway} from "./defaultGateway"

export function vpnConnet(){
    getDefaultGateway()
    .then((gateway) => {
        vpnConnetFx(gateway)
    })
    .catch((e) => {console.log(e);});
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

            // Now start the other process
            startAnotherCommand();
        }

        function startAnotherCommand() {
            console.log("Starting another command after tun2socks...");
            setStaticIP()
            .then(() =>{
                return setDnsServer()
            })
            .then(() =>{
                return addVpnRoute(gateway)
            })
            .then(() =>{
                return addGlobalRoute()
            })
            .then(() =>{
                console.log("vpn connection established");
            })
            .catch((e) =>{
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

