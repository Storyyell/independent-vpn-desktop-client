import React from 'react';
import { useState } from 'react';
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

