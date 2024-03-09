import { Stack } from '@mui/material';
import electronLogo from './assets/electron.svg'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useEffect } from 'react';
import LocationSelection from './components/LocationSelection/LocationSelection';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});


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


  if (localStorage.getItem("device_token")) {
    console.log("device token already exists")
  } else {
    console.log("device token does not exists")
    console.log("creating device token")
    window.api.registerDevice()
      .then((res) => {
        localStorage.setItem("device_token", res)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  function triggerVpnConnection() {
    console.log("vpn connection triggered fron renderer");
    window.ipc();
  }


  function genLogoStyle() {
    return {
      filter: vpnStatus === 'VPN connection established' ? 'drop-shadow(0 0 1.2em #6988e6aa)' : 'none'
    }
  }

  return (
    <>
    <ThemeProvider theme={theme}>
    <CssBaseline />
      <img alt="logo" className="logo" style={genLogoStyle()} src={electronLogo} />
      <div className="creator">sentinal - dvpn</div>
      <div className="text">
        Your Decentralized VPN Solution
      </div>
      <Stack direction="row" spacing={1} style={{ paddingTop: "8px", alignItems: 'center' }} >
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
      <LocationSelection/>
      </ThemeProvider>
    </>
  )
}

export default App

