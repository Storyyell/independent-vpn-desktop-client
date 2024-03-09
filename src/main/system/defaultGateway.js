const { exec } = require('child_process');

import("default-gateway").then(({ gateway4async, gateway4sync, gateway6async, gateway6sync }) => {
    const {gateway, version, int} = gateway4sync();
    global.gateway = gateway;

}).catch(error => {
    console.error(`An error occurred while importing default-gateway: ${error}`);
});

