
const rendererSend = (channel, message) => {
  global.mainWindow.webContents.send(channel, message);
}

export { rendererSend };