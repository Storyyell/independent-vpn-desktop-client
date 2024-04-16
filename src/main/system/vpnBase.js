import { app } from "electron";
import { spawn } from "child_process"
import path from "path";
const util = require('util');
const exec = util.promisify(require('child_process').exec);
import { getDefaultGateway, getAdapterIPs, getInterfaceNameByGateway } from "./defaultGateway"
import { SocksClient } from 'socks';
import { saveV2rayConfig } from "./v2rayConfig";
import dns from "dns";
import net from "net";
const https = require('https');
import { pullServerConf } from "./ipcs";
import { rendererSend } from "./utils";
import { dnsList } from "./dns/dnsList";


var vpnObj = {
    connected: false,
    v2ray: null,
    tun2socks: null,
    setStaticIP: false,
    setDnsServer: false,
    addVpnRoute: false,
    addGlobalRoute: false,
    gateway: null,
    gatewayIps: null,
    triggerConnection: vpnConnetFx,
    triggerDisconnection: vpnDisconnect,
    disconnectionProgress: false,
    connectionProgress: false,
    serverIp: null,
    serverAddress: null,
    serverPort: null,
    serverUUID: null,
    dnsIndex: 0,

    statusObj: function () {
        return {
            connected: this.connected,
            connectionProgress: this.connectionProgress,
            disconnectionProgress: this.disconnectionProgress,
            // serverIp: this.serverIp,
            // serverAddress: this.serverAddress,
            // serverPort: this.serverPort,
            // serverUUID: this.serverUUID
        }
    }
}

// Todo case of triggered disconnection while connection in progress and connected is true
// Todo handle the case of multiple vpn disconnection function call on closing and error [ now it wont cause any bugs for performance optimization ]
// Todo integrate vpn spawn  into vpnObj variable

// todo set custom dns for all external adapter

export async function vpnConnet(serverParms) {
    return new Promise(async (resolve, reject) => {
        vpnObj.connectionProgress = true;
        // console.log(global.sessionTempDir.path);

        try {
            const gateway = await getDefaultGateway();
            const defaultInterface = getInterfaceNameByGateway(gateway);
            const gatewayIps = getAdapterIPs(defaultInterface);
            vpnObj.gateway = gateway;
            vpnObj.defaultInterface = defaultInterface;
            vpnObj.gatewayIps = gatewayIps;
            console.log("VPN connection initializing...");
            rendererSend({ message: 'VPN connection initializing...', ...(vpnObj.statusObj()) });
            rendererSend({ message: 'Fetching server configuration...', ...(vpnObj.statusObj()) });
            const res = await pullServerConf(serverParms.device_token, serverParms.countryCode, serverParms.cityCode, serverParms.serverId);
            const serverObj = res.data;
            const { uuid, address: server_address, listen_port } = await saveV2rayConfig(serverObj);

            // updating server parms
            vpnObj.serverAddress = server_address;
            vpnObj.serverPort = listen_port;
            vpnObj.serverUUID = uuid;

            // getting server ip
            const serverIp = await getIPv4(server_address);
            vpnObj.serverIp = serverIp;
            console.log(`server ip: ${vpnObj.serverIp}`);
            if (!(vpnObj.dnsIndex) || vpnObj.dnsIndex >= dnsList.length || vpnObj.dnsIndex < 0) { vpnObj.dnsIndex = 0; }
            console.log(`dns selected : ${dnsList[vpnObj.dnsIndex].name}`);
            try {
                await vpnObj.triggerConnection(gateway);
                resolve(true);
            } catch (error) {
                reject(false);
            }
        } catch (e) {
            console.log("error in VPN connection: " + e.message);
            await vpnObj.triggerDisconnection();
            reject(false);
        }
    });
}

export async function vpnConnetFx() {

    return new Promise((resolve, reject) => {

        console.log(`gateway ${vpnObj.gateway}`);

        let basePath = path.join(__dirname, "../../resources/bin/");

        // Todo want to find a another way to use the resourcesPath from the main process in production
        if (app.isPackaged) {
            // When the app is packaged, the "resourcesPath" points to the "resources" directory adjacent to app.asar
            basePath = path.join(process.resourcesPath, 'app.asar.unpacked/resources/bin');
        }

        const v2rayPath = path.join(basePath, 'v2ray.exe');
        // const configPath = path.join(basePath, 'config.json');
        const configPath = path.join(global.sessionTempDir.path, `${global.sessionTempDir.uuid}.json`);


        const v2ray = spawn(v2rayPath, ['-config', configPath],);

        v2ray.on('error', async (error) => {
            console.error(`Failed to start v2ray process: ${error.message}`);
            await vpnObj.triggerDisconnection();
            reject(false);
        });

        v2ray.on('close', async (code) => {
            console.log(`v2ray process exited with code ${code}`);
            await vpnObj.triggerDisconnection();
            reject(false);
        });

        async function onDataReceived(data) {
            const output = data.toString();
            // todo want to safely print the output later
            // console.log(`child stdout:\n${output}`);

            if (output.includes('started')) {
                v2ray.stdout.removeListener('data', onDataReceived);
                vpnObj.v2ray = v2ray;
                try {
                    await onVpnConnected();
                    resolve(true);
                } catch (error) {
                    reject(false);
                }
            }
        }

        v2ray.stdout.on('data', onDataReceived);

        // v2ray.stderr.on('data', (data) => {
        //     console.error(`child stderr:\n${data}`);
        // });

        async function onVpnConnected() {
            return new Promise((resolve, reject) => {
                console.log("V2ray tunnel created");
                rendererSend({ message: 'V2ray tunnel created', ...(vpnObj.statusObj()) });
                checkConnectivity('127.0.0.1', 10808)
                    .then(async () => {
                        console.log("connectivity check passed");
                        try {
                            await startSocksInternalTunnel();
                            resolve(true);
                        } catch (error) {
                            reject(false);
                        }
                    })
                    .catch(async (e) => {
                        console.log("error in checking connectivity: " + e.message);
                        await vpnObj.triggerDisconnection();
                        reject(false);
                    });
            })
        }


        async function startSocksInternalTunnel() {
            return new Promise((resolve, reject) => {
                console.log("starting socks internal tunnel");

                const tun2socksPath = path.join(basePath, 'tun2socks.exe');

                // todo make adapter name dynamic
                const tun2socks = spawn(tun2socksPath, [
                    '-tcp-auto-tuning',
                    '-device', 'tun://independent_vpn',
                    '-proxy', 'socks5://127.0.0.1:10808'
                ]);

                tun2socks.on('error', async (error) => {
                    console.error(`Failed to start tun2socks process: ${error.message}`);
                    await vpnObj.triggerDisconnection();
                    reject(false);
                });

                tun2socks.on('close', async (code) => {
                    console.log(`tun2socks process exited with code ${code}`);
                    vpnObj.connected = false;
                    await vpnObj.triggerDisconnection();
                    reject(false);

                });

                async function onDataReceived(data) {
                    const output = data.toString();
                    console.log(`child stdout:\n${output}`);

                    if (output.includes('level=info msg="[STACK] tun://independent_vpn <-> socks5://127.0.0.1:10808')) {
                        vpnObj.tun2socks = tun2socks
                        tun2socks.stdout.removeListener('data', onDataReceived);
                        try {

                            await onTun2SocksConnected();
                            resolve(true);
                        } catch (error) {
                            reject(false);
                        }
                    }
                }

                tun2socks.stdout.on('data', onDataReceived);

                // tun2socks.stderr.on('data', (data) => {
                //     console.error(`child stderr:\n${data}`);
                // });

                async function onTun2SocksConnected() {
                    console.log("Tun2socks tunnel created");
                    rendererSend({ message: 'adapter created', ...(vpnObj.statusObj()) });
                    return await startAnotherCommand();
                }

                async function startAnotherCommand() {
                    return new Promise((resolve, reject) => {
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
                                global.vpnConnStatus = true;
                                rendererSend({ message: 'VPN connection established', ...(vpnObj.statusObj()) });
                                resolve(true);
                            })
                            .catch(async (e) => {
                                console.log("vpn connection error: " + e.message);
                                await vpnObj.triggerDisconnection();
                                reject(false);
                            });
                    });
                }
            });
        }
    })

}


async function setStaticIP() {
    console.log("assigning static ip to internal adapter");
    await exec('netsh interface ipv4 set address name="independent_vpn" source=static addr=192.168.123.1 mask=255.255.255.0');
    vpnObj.gatewayIps.ipv6Support && await exec('netsh interface ipv6 set address interface="independent_vpn" address=fd12:3456:789a:1::1/64 store=persistent');
}

async function setDnsServer() {
    console.log('enabling custom DNS server');
    await exec(`netsh interface ipv4 set dnsservers name="independent_vpn" static address=${dnsList[vpnObj.dnsIndex].ipv4[0]} register=none validate=no`);
    await exec(`netsh interface ipv4 add dnsservers name="independent_vpn" address=${dnsList[vpnObj.dnsIndex].ipv4[1]} index=2 validate=no`);

    vpnObj.gatewayIps.ipv6Support && await exec(`netsh interface ipv6 set dnsservers name="independent_vpn" static address=${dnsList[vpnObj.dnsIndex].ipv6[0]} register=none validate=no`);
    vpnObj.gatewayIps.ipv6Support && await exec(`netsh interface ipv6 add dnsservers name="independent_vpn" address=${dnsList[vpnObj.dnsIndex].ipv6[1]} index=2 validate=no`);

    // Flush DNS after setting DNS server

    // for default interface
    await exec(`netsh interface ipv4 set dnsservers name="${vpnObj.defaultInterface}" static address=${dnsList[vpnObj.dnsIndex].ipv4[0]} register=none validate=no`)
    vpnObj.gatewayIps.ipv6Support && await exec(`netsh interface ipv6 set dnsservers name="${vpnObj.defaultInterface}" static address=${dnsList[vpnObj.dnsIndex].ipv6[0]} register=none validate=no`)

    await exec('ipconfig /flushdns');
}

async function addGlobalRoute() {
    console.log("global traffic routing rule ");
    await exec('netsh interface ipv4 add route 0.0.0.0/0 "independent_vpn" 192.168.123.1 metric=1');
    vpnObj.gatewayIps.ipv6Support && await exec('netsh interface ipv6 add route ::/0 "independent_vpn" fd12:3456:789a:1::1 metric=1');

}

function addVpnRoute(gateway) {
    console.log("vpn traffic routing rule ");
    return exec(`route add ${vpnObj.serverIp} mask 255.255.255.255 ${gateway}`);
}

export async function vpnDisconnect() {

    global.vpnConnStatus = false;

    if (vpnObj.connectionProgress || vpnObj.connected) {
        console.log("vpn disconnection started...");
        vpnObj.connectionProgress = false;
        vpnObj.disconnectionProgress = true;
        try { rendererSend({ message: 'VPN disconnecting...', ...(vpnObj.statusObj()) }); } catch (e) { }
        setTimeout(() => { vpnObj.disconnectionProgress = false }, 5000) // 10 seconds timeout for disconnection status cleanup on error
        let keys = Object.keys(vpnObj).reverse();
        keys.forEach(async (key) => {
            // console.log(`cleaning vpn object key :=> ${key}`);
            try { await vpnConnCleanup(key); } catch (error) { }
        })
        if (!vpnObj.connected) {
            console.log("vpn disconnected");
        }
        vpnObj.connected = false;
        global.vpnConnStatus = false;
        vpnObj.disconnectionProgress = false;
        try { rendererSend({ message: 'VPN disconnected', ...(vpnObj.statusObj()) }); } catch (e) { }
    } else {
        return;
    }
}

async function vpnConnCleanup(key) {

    switch (key) {

        case "addGlobalRoute":
            if (vpnObj["setStaticIP"]) {
                await exec('netsh interface ipv4 delete route 0.0.0.0/0 "independent_vpn" 192.168.123.1')
                vpnObj.gatewayIps.ipv6Support && await exec('netsh interface ipv6 delete route ::/0 "independent_vpn" fd12:3456:789a:1::1');
                vpnObj["addGlobalRoute"] = false;
            }
            break;
        case "addVpnRoute":
            if (vpnObj["addVpnRoute"]) {
                await exec(`route delete ${vpnObj.serverIp}`)
                vpnObj["addVpnRoute"] = false;
            }
            break;
        case "setDnsServer":
            if (vpnObj["setDnsServer"]) {
                await exec('netsh interface ipv4 set dnsservers name="independent_vpn" source=dhcp');
                vpnObj.gatewayIps.ipv6Support && await exec('netsh interface ipv6 set dnsservers name="independent_vpn" source=dhcp');

                // for default interface
                await exec(`netsh interface ipv4 set dnsservers name="${vpnObj.defaultInterface}" source=dhcp`)
                vpnObj.gatewayIps.ipv6Support && await exec(`netsh interface ipv6 set dnsservers name="${vpnObj.defaultInterface}" source=dhcp`)
                vpnObj["setDnsServer"] = false;
            }
            break;
        case "setStaticIP":
            if (vpnObj["setStaticIP"]) {
                try {
                    await exec('netsh interface ipv4 set address name="independent_vpn" source=dhcp');
                    vpnObj.gatewayIps.ipv6Support && await exec('netsh interface ipv6 set address name="independent_vpn" source=dhcp');
                    vpnObj["setStaticIP"] = false;
                } catch (error) {
                    throw error;
                }
            }

            break;
        case "tun2socks":
            if (vpnObj["tun2socks"] != null) {
                await vpnObj.tun2socks.kill();
                vpnObj.tun2socks = null;
            }
            break;
        case "v2ray":
            if (vpnObj["v2ray"] != null) {
                await vpnObj.v2ray.kill();
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

    rendererSend({ message: 'checking connectivity...', ...(vpnObj.statusObj()) });

    options.agent = new https.Agent({ socket: agent.socket });

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                rendererSend({ message: 'internet connectivity check passed...', ...(vpnObj.statusObj()) });

                resolve(true);
            });
        });

        req.on('error', (e) => {
            console.error(`Request error: ${e.message}`);
            rendererSend({ message: 'internet connectivity check failed...', ...(vpnObj.statusObj()) });

            reject('internet connectivity check failed...');
        });

        req.on('timeout', () => {
            req.end();
            console.error('Request timeout after 3 seconds.');
            rendererSend({ message: 'internet connectivity check failed...', ...(vpnObj.statusObj()) });

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
