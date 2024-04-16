import { exec as execCb } from 'child_process';
import { promisify } from 'util';
const exec = promisify(execCb);
import os from 'os';
const ip = require('ip');


async function getDefaultGateway() {
    try {
        const { gateway4sync } = await import("default-gateway");
        const { gateway } = gateway4sync();
        return gateway;
    } catch (error) {
        console.error(`An error occurred while importing default-gateway: ${error}`);
        throw new Error('default-gateway error');
    }
}

function getAdapterIPs(adapter) {
    const interfaces = os.networkInterfaces();
    const ips = { ipv4: [], ipv6: [] };

    if (interfaces[adapter]) {
        for (const iface of interfaces[adapter]) {
            if ('IPv4' === iface.family) {
                ips.ipv4.push(iface.address);
            } else if ('IPv6' === iface.family) {
                ips.ipv6.push(iface.address);
            }
        }
    }

    return {
        ...ips,
        ipv4Support: ips.ipv4.length > 0,
        ipv6Support: ips.ipv6.length > 0
    };
}


function findInterfaceByIP(ip) {
    const networkInterfaces = os.networkInterfaces();

    for (const interfaceName in networkInterfaces) {
        const addresses = networkInterfaces[interfaceName];
        for (const addressInfo of addresses) {
            if (addressInfo.address === ip && !addressInfo.internal) {
                return { interfaceName, ...addressInfo };
            }
        }
    }

    throw new Error(`Interface with IP address ${ip} not found.`);
}

function getInterfaceNameByGateway(gatewayIP) {
    // Get the list of network interfaces
    const networkInterfaces = os.networkInterfaces();

    for (const interfaceName in networkInterfaces) {
        const networkInterface = networkInterfaces[interfaceName];

        for (const alias of networkInterface) {
            if (alias.family === 'IPv4' && !alias.internal) {
                // Check if the gateway IP is in the same subnet as the current alias
                const subnet = ip.subnet(alias.address, alias.netmask);
                if (subnet.contains(gatewayIP)) {
                    return interfaceName;
                }
            }
        }
    }

    throw new Error(`No interface found containing the gateway IP ${gatewayIP}`);
}

export { getDefaultGateway, getAdapterIPs, getInterfaceNameByGateway };
