import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import ModalProvider from 'modules/modal/ModalProvider'
import './index.css'
import './theme/globals.scss'
import 'react-toastify/dist/ReactToastify.css'
import './theme/variables.scss'
import App from './App'
import { RefreshContextProvider } from 'context/RefreshContext'

function getLibrary(provider: any) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 8000
  return library
}

delete localStorage.walletconnect

ReactDOM.render(
  <React.StrictMode>
    <HashRouter basename='/'>
      <Web3ReactProvider getLibrary={getLibrary}>
        <RefreshContextProvider>
          <ModalProvider>
            <App />
            <ToastContainer />
          </ModalProvider>
        </RefreshContextProvider>
      </Web3ReactProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root'),
)
