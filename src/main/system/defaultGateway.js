import { exec as execCb } from 'child_process';
import { promisify } from 'util';
const exec = promisify(execCb);

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

export { getDefaultGateway, getDefaultInterface };
