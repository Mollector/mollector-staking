/* eslint-disable no-else-return */
import { useCallback } from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'


import { toast } from 'react-toastify'
import {
  InjectedConnector,
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector'
import { ConnectorNames, connectorsByName } from 'utils/web3React'
import { setupNetwork } from 'ui/utils/wallet'

const useAuth = () => {
  const { activate, deactivate, chainId } = useWeb3React()

  const logout = useCallback(() => {
    deactivate()
    // This localStorage key is set by @web3-react/walletconnect-connector
    if (window.localStorage.getItem('walletconnect')) {
      connectorsByName.walletconnect.close()
      connectorsByName.walletconnect.walletConnectProvider = undefined
    }
  }, [deactivate])

  const login = useCallback((connectorID: ConnectorNames) => {
    const connector = connectorsByName[connectorID]

    if (connector) {
      activate(connector, async (error) => {
        if (error instanceof UnsupportedChainIdError) {
          if (connector instanceof InjectedConnector && (window.ethereum.isMetaMask || window.ethereum.isTrust)) {
            const hasSetup = await setupNetwork()
            if (hasSetup) {
              activate(connector)
            } else {
              toast.error('Wrong Network!', {
                hideProgressBar: true,
              })
            }
          } else {
            toast.error('Wrong Network!', {
              hideProgressBar: true,
            })
          }
          if (window.localStorage.getItem('walletconnect')) {
            window.localStorage.removeItem('walletconnect')
          }
        } else {
          if (error instanceof NoEthereumProviderError) {
            toast.error('No Binance Wallet', {
              hideProgressBar: true,
            })
          } else if (
            error instanceof UserRejectedRequestErrorInjected ||
            error instanceof UserRejectedRequestErrorWalletConnect
          ) {
            if (connector instanceof WalletConnectConnector) {
              const walletConnector = connector
              walletConnector.walletConnectProvider = undefined
            }
            toast.error('Please authorize to access your account', {
              hideProgressBar: true,
            })
          } else {
            toast.error(error.message, {
              hideProgressBar: true,
            })
          }
        }
      })
    } else {
      toast.error('Unable to find connector', {
        hideProgressBar: true,
      })
    }
  }, [])

  return { login, logout }
}

export default useAuth
