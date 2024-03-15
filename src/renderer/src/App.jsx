import React from 'react';
import { Stack } from '@mui/material';
import electronLogo from './assets/electron.svg'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useEffect } from 'react';
import LocationSelection from './components/LocationSelection/LocationSelection';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ServerListContext, ServerListProvider } from './context/ServerListContext';
import { VpnStatusMainContext } from './context/VpnStatusMainContext';
import CircularProgress from '@mui/material/CircularProgress';
import { DeviceTokenContext } from './context/DeviceTokenContext';
import { SelectionContext } from './context/SelectionContext';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});


function App() {

  const [vpnStatus, setVpnStatus] = useState("VPN disconnected");
  const { serverList, setServerList } = React.useContext(ServerListContext);
  const { vpnStatusMain, setVpnStatusMain } = React.useContext(VpnStatusMainContext);
  const { deviceToken, setDeviceToken } = React.useContext(DeviceTokenContext);
  const { selectedItems, setSelectedItems } = React.useContext(SelectionContext);

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

  function triggerVpnConnection() {
    if(vpnStatusMain !== 'connected'){

    console.log("vpn connection triggered fron renderer");
    let sl =  serverList.servers?.[`${selectedItems.countryId}-${selectedItems.cityId}`] || []
    if(sl.length > 0){

      const randomIndex = Math.floor(Math.random() * sl.length);
      const server =  sl[randomIndex]
      console.log(server);

      let serverParms={
        device_token: deviceToken,
        countryCode: selectedItems.countryId,
        cityCode: selectedItems.cityId,
        serverId: server.id
      }

      window.api.triggerConnection(serverParms);
      
    }else{
      setVpnStatus("fetching server list...")
      setTimeout(() => {setVpnStatus("VPN disconnected")}, 2000);
    }
  }else{
    window.api.triggerDisconnection()
  }}


  function genLogoStyle() {
    return {
      filter: vpnStatusMain === 'connected' ? 'drop-shadow(0 0 1.2em #6988e6aa)' : 'none'
    }
  }

  return (
    <>
    <ThemeProvider theme={theme}>
    <CssBaseline />
    {/* <ServerListProvider> */}
      <img alt="logo" className="logo" style={genLogoStyle()} src={electronLogo} />
      <div className="creator">sentinel - dvpn</div>
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
            {vpnStatusMain === 'connected' && 'disconnect vpn'}
            {vpnStatusMain === 'disconnected' && 'connect vpn'}
            {vpnStatusMain === 'connecting' &&  'connecting...'}{vpnStatusMain === 'connecting' && <CircularProgress size="15px"  color="secondary" sx={{mx:2}} />}
          </Button>
        </div>
      </div>
      {/* <Versions></Versions> */}
      <LocationSelection/>
      {/* </ServerListProvider> */}
      </ThemeProvider>
    </>
  )
}

export default App

