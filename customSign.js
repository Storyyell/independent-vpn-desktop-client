const { exec } = require('child_process');

exports.default = async function(configuration) {

  // Path to the file that needs to be signed
  const appPath = configuration.path;

  console.log(`signing file at path: ${appPath}`);

  // Define the signtool command with updated parameters
  const signCommand = `signtool sign /debug /n "Open Source Developer, Abhishek Dhobe" /t http://timestamp.certum.pl /fd sha256 /v "${appPath}"`;

  // Execute the signtool command
  await new Promise((resolve, reject) => {
    exec(signCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error signing application: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`SignTool stderr: ${stderr}`);
      }
      console.log(`SignTool stdout: ${stdout}`);
      resolve();
    });
  });

  console.log("Custom signing completed");
};
