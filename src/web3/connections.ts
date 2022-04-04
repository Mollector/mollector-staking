import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { useCallback, useEffect } from 'react'
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
import { setupNetwork } from 'ui/utils/wallet'
import { KNOWN_WALLETS } from './wallets'

const SELECT_WEB3_PROVIDER_KEY = 'SELECT_WEB3_PROVIDER_KEY'

export const useWalletConnector = () => {
  const { activate } = useWeb3React()

  return useCallback((name: any) => {
    const connector = KNOWN_WALLETS[name]()

    activate(connector, async (error) => {
			console.log(error, 'ERROR ?')
      if (error instanceof UnsupportedChainIdError) {
        if (connector instanceof InjectedConnector && window.ethereum.isMetaMask) {
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
  }, [])
}

export const useAutomaticReconnection = () => {
  const activate = useWalletConnector()

  useEffect(() => {
    const chosenProvider = window && window.localStorage.getItem(SELECT_WEB3_PROVIDER_KEY)
    if (chosenProvider) {
      console.log('reactivate', chosenProvider)
      activate(KNOWN_WALLETS[chosenProvider])
    }
  }, [])
}
