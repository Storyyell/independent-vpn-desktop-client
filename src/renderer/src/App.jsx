import { Stack } from '@mui/material';
import electronLogo from './assets/electron.svg'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useEffect } from 'react';

function App() {

  const [vpnStatus, setVpnStatus] = useState("VPN disconnected");

  useEffect(() => {
    window.setVpnStatus = setVpnStatus;
    window.ipcRenderer.on('connectionStatus', (arg) => {
      window.setVpnStatus(arg);
      console.log(arg);
    });

    return () => {
      window.ipcRenderer.removeAllListeners('connectionStatus');
    };
  }, []);

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
      <Stack direction="row" spacing={1}  style={{paddingTop:"8px",alignItems:'center' }} >
      <Typography variant="overline" display="block" gutterBottom>
        {`status :`}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom >
        {vpnStatus ? vpnStatus : 'VPN disconnected'}
      </Typography>
      </Stack>

      <div className="actions">
        <div className="action">
          <Button
            size="medium"
            variant="outlined"
            style={{ minWidth: "150px", height: "40px", borderRadius: "20px" }}
            onClick={triggerVpnConnection}
          >
            {vpnStatus !== 'VPN disconnected' ? 'disconnect vpn' : 'connect vpn'}
          </Button>
        </div>
      </div>
      {/* <Versions></Versions> */}
    </>
  )
}

export default App

