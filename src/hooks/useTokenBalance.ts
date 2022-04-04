import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3Provider } from 'web3/web3'
import useRefresh from './useRefresh'
import { useBep20TokenContract } from 'web3/contract'
import { getBalanceNumber } from 'utils/formatBalance'

type ADDRESS_TYPE = string | undefined | null

const useTokenBalance = (tokenAddress: string, address: ADDRESS_TYPE): [number, () => void] => {
  const provider = useWeb3Provider()
  const { slowRefresh } = useRefresh()
  const stakeToken1Contract = useBep20TokenContract(provider, tokenAddress)
  const [balance, setBalance] = useState(0)
  const [countRefresh, setCountRefresh] = useState(0)
  async function getBalance() {
    try {
      const data = await stakeToken1Contract.methods.balanceOf(address).call()
      const n_bal = getBalanceNumber(new BigNumber(data), 18)
      setBalance(n_bal)
    } catch (error) {
      console.log('fail fetch token balance')
    }
  }
  useEffect(() => {
    if (provider && address) {
      getBalance()
    }
  }, [address, stakeToken1Contract, countRefresh, provider, slowRefresh])

  const reFetchingBalance = () => {
    setCountRefresh(countRefresh + 1)
  }

  return [balance, reFetchingBalance]
}
export default useTokenBalance
