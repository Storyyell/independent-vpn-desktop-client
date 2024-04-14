const { exec } = require('child_process');

function getAdapterStatistics(adapterName) {
  return new Promise((resolve, reject) => {
    const command = `Get-NetAdapterStatistics | Where-Object { $_.Name -eq '${adapterName}' } | Format-List -Property "*"`;

    // Execute the PowerShell command
    exec(`powershell.exe -command "${command}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error:', error);
        reject(error);
        return;
      }
      if (stderr) {
        console.error('Stderr:', stderr);
        reject(stderr);
        return;
      }

      const lines = stdout.split('\r\n').filter(line => line.trim() !== '');
      const stats = {};

      lines.forEach(line => {
        if (line.includes(':')) {
          const [key, value] = line.split(':').map(part => part.trim());
          stats[key] = value;
        }
      });

      // Resolve the promise with the statistics
      resolve(stats);
    });
  });
}



async function adapterSpeed(adapterName) {
  try {
    const stats = await getAdapterStatistics(adapterName);
    const retVal = {
      sent: stats['SentBytes'],
      received: stats['ReceivedBytes'],
    };
    return retVal;
  }
  catch (error) {
    const retVal = {
      received: 0,
      sent: 0
    };
    return retVal;
  }
}

export { getAdapterStatistics, adapterSpeed };
