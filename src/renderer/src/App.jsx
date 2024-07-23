import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './pages/Home/Home';
import { Box, Typography } from '@mui/material';
import Header from './components/Header/Header';
import { SysSettingsProvider } from './context/SysSettingsContext';
import { DnsListProvider } from './context/DnsListContext';

import { appVersionState } from './atoms/app/version';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { deviceTokenState } from './atoms/app/token';
import { geoCoordinateState } from './atoms/app/geoCordinate';
import StateSave from './components/StateSave/StateSave';
import OfflineModal from './components/OfflineModal/OfflineModal';
import { useNetworkStatus } from './hooks/NetworkStatus/NetworkStatus';
import { onlineState } from './atoms/app/onlineState';
import LoadingSceen from './pages/LoadingScreen/LoadingSceen';
import { isLoadingState } from './atoms/app/loadingScreeen';


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
  // throw new Error('Error from the renderer');
  const setAppVersion = useSetRecoilState(appVersionState);
  const [deviceToken, setDeviceToken] = useRecoilState(deviceTokenState);
  const isOnline = useRecoilValue(onlineState);
  useNetworkStatus();
  const isLoading = useRecoilValue(isLoadingState);

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
              window.api.setDeviceToken(res);
              setDeviceToken(res);
            })
            .catch((e) => {
              // console.error(e)
              console.error('Device registration failed')
            })
        }else{
          window.api.setDeviceToken(deviceToken);
        }
      }
    )();

  }

    , [isOnline]);



  return (
    <>
      <SysSettingsProvider>
        <DnsListProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box className="app svg-background app-padding">
              {isLoading && <LoadingSceen />}
              {!isLoading && <Header />}
              {!isLoading && <Home />}
              {/* StateSave want to be moved to app level */}
              <StateSave />
              <OfflineModal />
            </Box>
          </ThemeProvider>
        </DnsListProvider>
      </SysSettingsProvider>
    </>
  )
}

export default App

