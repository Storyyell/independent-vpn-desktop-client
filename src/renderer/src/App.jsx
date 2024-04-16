import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ServerListProvider } from './context/ServerListContext'
import { VpnStatusMainProvider } from './context/VpnStatusMainContext'
import { DeviceTokenProvider } from './context/DeviceTokenContext'
import { SelectionProvider } from './context/SelectionContext'
import Home from './pages/Home/Home';
import { Box } from '@mui/material';
import Header from './components/Header/Header';
import { FavListProvider } from './context/FavContext';
import { SysSettingsProvider } from './context/SysSettingsContext';
import { VpnTunnelStatusProvider } from './context/VpnTunnelStatusContext';
import { DnsListProvider } from './context/DnsListContext';



const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: 'Segoe UI',
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

// todo change global state management to recoil
// todo add case of revoed device token and followed by re-regisration

function App() {

  // __electronLog.info('Log from the renderer')


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
                        <Box className="app grad">
                          <Header />
                          <Home />
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

