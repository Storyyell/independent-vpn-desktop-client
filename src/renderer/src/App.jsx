import electronLogo from './assets/electron.svg'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  function triggerVpnConnection() {
    console.log("vpn connection triggered fron renderer");
    window.ipc();
  }


  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">sentinal - dvpn</div>
      <div className="text">
        Your Decentralized VPN Solution
      </div>
      {/* <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p> */}
      <div className="actions">
        <div className="action">
          {/* <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action" >
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a> */}
          <a target="_blank" rel="noreferrer" onClick={triggerVpnConnection}>
            vpn connect
          </a>
        </div>
      </div>
      {/* <Versions></Versions> */}
    </>
  )
}

export default App

