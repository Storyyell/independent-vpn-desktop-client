import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  RecoilRoot,
} from 'recoil';

import './assets/main.css'

import App from './App'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </RecoilRoot>
  </React.StrictMode>
)
