import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import configs from 'configuration'

export enum ConnectorNames {
  Injected = "injected",
  WalletConnect = "walletconnect",
}
const POLLING_INTERVAL = 12000

const chainIds = [configs.SUPPORTED_CHAINID]
export const injected = new InjectedConnector({ supportedChainIds: chainIds })

const walletconnect = new WalletConnectConnector({
  rpc: { 56: 'https://solitary-snowy-river.bsc.quiknode.pro/16b4e8d1466a4e5c06c88145a2faed83b3661fd9/' },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  // pollingInterval: POLLING_INTERVAL,
})

export const connectorsByName = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
}
