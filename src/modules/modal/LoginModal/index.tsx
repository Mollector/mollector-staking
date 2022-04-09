import React from 'react'
import { toast } from 'react-toastify'
import { MetaIcon, RightArrow, TrustIcon, WalletIcon } from 'modules/connect-wallet-pop-up/icons'
import useAuth from 'hooks/useAuth'
import { ConnectorNames } from 'utils/web3React'
import BaseModal from '../BaseModal'
import styles from './styles.module.scss'

interface LoginModalProps {
  onDismiss?: () => void
}

const connectors = [
  {
    title: 'Metamask',
    connectorId: ConnectorNames.Injected
  },
  {
    title: 'WalletConnect',
    connectorId: ConnectorNames.WalletConnect,
  },
  {
    title: 'Trust Wallet',
    connectorId: ConnectorNames.Injected
  },
  {
    title: 'Inject Wallet',
    connectorId: ConnectorNames.Injected
  },
]

const LoginModal: React.FC<LoginModalProps> = ({ onDismiss = () => {} }) => {
  const { login } = useAuth()

  return (
    <BaseModal>
      <div className={styles.component}>
        <h2 className={styles.title}>Connect to a wallet</h2>
        <ul className={styles.list}>
          <li className={styles.item}>
            <button
              className={styles.button}
              type="button"
              onClick={() => {
                if (window.ethereum && window.ethereum.isMetaMask && window.ethereum.isMetaMask === true) {
                  login(connectors[0].connectorId)
                  onDismiss()
                } else {
                  toast.error('No MetaMask Wallet', {
                    hideProgressBar: true,
                  })
                }
              }}
            >
              <span className={styles.icon}>
                <MetaIcon />
              </span>
              Metamask
              <RightArrow className={styles.arrow} />
            </button>
          </li>
          <li className={styles.item}>
            <button
              className={styles.button}
              type="button"
              onClick={() => {
                login(connectors[1].connectorId)
                onDismiss()
              }}
            >
              <span className={styles.icon}>
                <WalletIcon />
              </span>
              WalletConnect
              <RightArrow className={styles.arrow} />
            </button>
          </li>
          <li className={styles.item}>
            <button
              className={styles.button}
              type="button"
              onClick={() => {
                if (window.ethereum && window.ethereum.isMetaMask && window.ethereum.isMetaMask === true) {
                  login(connectors[2].connectorId)
                  onDismiss()
                } else {
                  toast.error('No MetaMask Wallet', {
                    hideProgressBar: true,
                  })
                }
              }}
            >
              <span className={styles.icon}>
                <TrustIcon />
              </span>
              Trust Wallet
              <RightArrow className={styles.arrow} />
            </button>
          </li>
        </ul>
      </div>
    </BaseModal>
  )
}

export default LoginModal
