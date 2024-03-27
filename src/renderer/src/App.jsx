import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { VpnStatusMainContext } from './context/VpnStatusMainContext';
import { ServerListProvider } from './context/ServerListContext'
import { VpnStatusMainProvider } from './context/VpnStatusMainContext'
import { DeviceTokenProvider } from './context/DeviceTokenContext'
import { SelectionProvider } from './context/SelectionContext'
import Home from './pages/Home/Home';
import { Box } from '@mui/material';
import Header from './components/Header/Header';



const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// todo add case of revoed device token and followed by re-regisration

function App() {

  const [vpnStatus, setVpnStatus] = useState("VPN disconnected");
  const { vpnStatusMain, setVpnStatusMain } = React.useContext(VpnStatusMainContext);

  // for vpn status listenening
  useEffect(() => {
    window.setVpnStatus = setVpnStatus;
    window.ipcRenderer.on('connectionStatus', (arg) => {
      window.setVpnStatus(arg);

      if (arg === 'VPN connection established') {
        setVpnStatusMain('connected');
      } else if (arg === 'VPN disconnected') {
        setVpnStatusMain('disconnected');
      } else {
        setVpnStatusMain('connecting');
      }

      console.log(arg);
    });

    return () => {
      window.ipcRenderer.removeAllListeners('connectionStatus');
    };
  }, []);


  return (
    <>
      <ServerListProvider>
        <VpnStatusMainProvider>
          <SelectionProvider>
            <DeviceTokenProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box className="app grad">
                  <Header />
                  <Home />
                </Box>
              </ThemeProvider>
            </DeviceTokenProvider>
          </SelectionProvider>
        </VpnStatusMainProvider>
      </ServerListProvider>
    </>
  )
}

export default App

