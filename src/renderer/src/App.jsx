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
import { FavListProvider } from './context/FavContext';



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

// todo add case of revoed device token and followed by re-regisration

function App() {


  return (
    <>
      <ServerListProvider>
        <VpnStatusMainProvider>
          <SelectionProvider>
            <DeviceTokenProvider>
              <FavListProvider>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <Box className="app grad">
                    <Header />
                    <Home />
                  </Box>
                </ThemeProvider>
              </FavListProvider>
            </DeviceTokenProvider>
          </SelectionProvider>
        </VpnStatusMainProvider>
      </ServerListProvider>
    </>
  )
}

export default App

