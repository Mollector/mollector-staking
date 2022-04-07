import baseConfigs from './base'

const configs = {
  API_CYBALL: 'https://app-api.cyball.com/api',
  NETWORK: 'bsc',
  API_MARKETPLACE: 'https://marketplace-api.cyball.com/api/static',
  SUPPORTED_CHAINID: 56,
  SUPPORTED_RPC: 'https://solitary-snowy-river.bsc.quiknode.pro/16b4e8d1466a4e5c06c88145a2faed83b3661fd9/',
  BLOCK_EXPLORER_URLS: 'https://bscscan.com/',
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
