import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ServerListProvider } from './context/ServerListContext'
import { VpnStatusMainProvider } from './context/VpnStatusMainContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ServerListProvider>
      <VpnStatusMainProvider>
        <App />
      </VpnStatusMainProvider>
    </ServerListProvider>
  </React.StrictMode>
)
