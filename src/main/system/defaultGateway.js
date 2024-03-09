const { exec } = require('child_process');

export function getDefaultGateway() {   // Todo think of the case of after vpn connection
    return new Promise((resolve, reject) => {
        exec(
            'wmic path Win32_NetworkAdapterConfiguration where IPEnabled=true get DefaultIPGateway',
            (error, stdout, stderr) => {
                if (error) {
                    reject(`An error occurred: ${error}`);
                    return;
                }
                if (stderr) {
                    reject(`stderr: ${stderr}`);
                    return;
                }

                // Process the standard output to find the Default Gateway
                const lines = stdout.split('\n');
                const gatewayLine = lines.find(line => line.includes('{'));
                if (!gatewayLine) {
                    reject('No default gateway found.');
                    return;
                }

                const gatewayMatch = gatewayLine.match(/{\s*"([^"]+)"\s*}/);
                if (gatewayMatch && gatewayMatch[1]) {
                    resolve(gatewayMatch[1]);
                } else {
                    reject('Default gateway information not found');
                }
            }
        );
    });
}
