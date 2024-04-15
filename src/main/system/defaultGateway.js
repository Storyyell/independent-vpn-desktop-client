import { exec as execCb } from 'child_process';
import { promisify } from 'util';
const exec = promisify(execCb);
import os from 'os';
import { get } from 'http';


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


async function getDefaultInterface() {
    try {
        const command = '(Get-NetAdapter -InterfaceIndex (Get-NetRoute -DestinationPrefix 0.0.0.0/0 | Sort-Object RouteMetric | Select-Object -First 1).InterfaceIndex).Name';
        const { stdout } = await exec(command, { shell: 'powershell.exe' });
        return stdout.trim();
    } catch (error) {
        console.error(`An error occurred while executing the command: ${error}`);
        throw error;
    }
}



export { getDefaultGateway, getDefaultInterface, getAdapterIPs };
