import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ServerListProvider } from './context/ServerListContext'
import { VpnStatusMainProvider } from './context/VpnStatusMainContext'
import { DeviceTokenProvider } from './context/DeviceTokenContext'
import { SelectionProvider } from './context/SelectionContext'
import Home from './pages/Home/Home';
import { Box, Typography } from '@mui/material';
import Header from './components/Header/Header';
import { FavListProvider } from './context/FavContext';
import { SysSettingsProvider } from './context/SysSettingsContext';
import { VpnTunnelStatusProvider } from './context/VpnTunnelStatusContext';
import { DnsListProvider } from './context/DnsListContext';

import { appVersionState } from './atoms/app/version';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { deviceTokenState } from './atoms/app/token';
import { geoCoordinateState } from './atoms/app/geoCordinate';
import StateSave from './components/StateSave/StateSave';
import OfflineModal  from './components/OfflineModal/OfflineModal';
import { useNetworkStatus } from './hooks/NetworkStatus/NetworkStatus';
import { onlineState } from './atoms/app/onlineState';


const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: 'Montserrat',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*::-webkit-scrollbar': {
          width: '6px',
        },
        '*::-webkit-scrollbar-track': {
          background: '#1E1A1B',
        },
        '*::-webkit-scrollbar-thumb': {
          background: '#1D388F61',
          borderRadius: '2px',
        },
      },
    },
  },
});



function App() {

  // __electronLog.info('Log from the renderer')

  const setAppVersion = useSetRecoilState(appVersionState);
  const [deviceToken, setDeviceToken] = useRecoilState(deviceTokenState);
  const setLocation = useSetRecoilState(geoCoordinateState);
  isOnline = useRecoilValue(onlineState);
  useNetworkStatus();

  React.useEffect(() => {

    // setting app version
    (() => {
      window.api.appVersion()
        .then((appVersion) => {
          setAppVersion(appVersion);
        })
    })();

    // registerDevice
    (
      () => {
        if (deviceToken == "") {
          window.api.registerDevice()
            .then((res) => {
              setDeviceToken(res)
            })
            .catch((e) => {
              log.error(e)
            })
        }
      }
    )();

    // fetching home ip
    (() => {
      if (deviceToken != "") {
        window.api.getIp(deviceToken)
          .then(({ data }) => {
            if (data) {
              setLocation({
                lat: data.latitude,
                lng: data.longitude,
                ip: data.ip
              })
            }
          })
          .catch((e) => { });
      }
    })();

  }, [isOnline]);



  return (
    <>
      <ServerListProvider>
        <VpnStatusMainProvider>
          <VpnTunnelStatusProvider>
            <SelectionProvider>
              <DeviceTokenProvider>
                <FavListProvider>
                  <SysSettingsProvider>
                    <DnsListProvider>
                      <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <Box className="app svg-background app-padding">
                          <Header />
                          <Home />
                          {/* StateSave want to be moved to app level */}
                          <StateSave/>
                          <OfflineModal />
                        </Box>
                      </ThemeProvider>
                    </DnsListProvider>
                  </SysSettingsProvider>
                </FavListProvider>
              </DeviceTokenProvider>
            </SelectionProvider>
          </VpnTunnelStatusProvider>
        </VpnStatusMainProvider>
      </ServerListProvider>
    </>
  )
}

export default App

