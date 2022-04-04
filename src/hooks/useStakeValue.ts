import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { useWeb3Provider } from 'web3/web3'
import useRefresh from './useRefresh'
import { useStakingContract } from 'web3/contract'
import { getBalanceNumber } from 'utils/formatBalance'

const useStakeValue = (tokenAddress: string, stakeContractAddress: string) => {
  const provider = useWeb3Provider()
  const { account } = useWeb3React()
  const { slowRefresh } = useRefresh()
  const stakeContract = useStakingContract(provider, stakeContractAddress)
  const [balance, setBalance] = useState(0)
  const [countRefresh, setCountRefresh] = useState(0)
  async function getBalance() {
    try {
      const data = await stakeContract.methods.amounts(tokenAddress, account).call()
      const n_bal = getBalanceNumber(new BigNumber(data), 18)
      setBalance(n_bal)
    } catch (error) {
      console.log('fail fetch stake value')
    }
  }
  useEffect(() => {
    if (provider && account) {
      getBalance()
    }
  }, [account, stakeContract, countRefresh, provider, slowRefresh])

  const reFetchingBalance = () => {
    setCountRefresh(countRefresh + 1)
  }

  return [balance, reFetchingBalance]
}
export default useStakeValue
