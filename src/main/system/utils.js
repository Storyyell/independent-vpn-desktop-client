
const rendererSend = (obj) => {
  const channel = connectionStatus;
  const message = obj.message;
  global.mainWindow.webContents.send(channel, message);
}

export { rendererSend };