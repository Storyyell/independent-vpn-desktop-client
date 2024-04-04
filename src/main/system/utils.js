
const rendererSend = (obj) => {
  const channel = connectionStatus;
  const message = obj.message;
  let statusObj = obj.statusObj();
  global.mainWindow.webContents.send(channel, message);
}

export { rendererSend };