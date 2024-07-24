
const rendererSend = (obj) => {
  const channel = 'connectionStatus';
  global.mainWindow.webContents.send(channel, obj);
}

export { rendererSend };