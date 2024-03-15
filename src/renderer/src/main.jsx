import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ServerListProvider } from './context/ServerListContext'
import { VpnStatusMainProvider } from './context/VpnStatusMainContext'
import { DeviceTokenProvider } from './context/DeviceTokenContext'
import { SelectionProvider } from './context/SelectionContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ServerListProvider>
      <VpnStatusMainProvider>
        <SelectionProvider>
          <DeviceTokenProvider>
            <App />
          </DeviceTokenProvider>
        </SelectionProvider>
      </VpnStatusMainProvider>
    </ServerListProvider>
  </React.StrictMode>
)
