import baseConfigs from './base'

const configs = {
  API_CYBALL: 'https://cyball-api.azurewebsites.net/api',
  // API_CYBALL: 'http://localhost:7071/api',
  NETWORK: 'tomochain',
  API_MARKETPLACE: 'https://marketplace-api-test.cyball.com/api/static',
  SUPPORTED_CHAINID: 89,
  SUPPORTED_RPC: 'https://rpc.testnet.tomochain.com/',
  BLOCK_EXPLORER_URLS: 'https://scan.testnet.tomochain.com/',
  TOKEN_INFO: {
    address: '0x06597FFaFD82E66ECeD9209d539032571ABD50d9',
    symbol: 'MOL',
    decimals: 18,
    image: '',
  }
}

export default Object.freeze({
  ...baseConfigs,
  ...configs,
})
