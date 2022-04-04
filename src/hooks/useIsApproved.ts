import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import BigNumber from 'bignumber.js'

/**
 * Check if user approve to spend the pay token amount or not
 * If the pay token is native token - we can skip this step
 */
const useIsApproved = (
  tokenContract: Contract,
  spenderAddress: string,
): [approveStatus: boolean, refetchingStatusFunction: Function, isLoading: boolean] => {
  const [isApproved, setIsApproved] = useState(false)
  const [isLoadingApproved, setIsLoadingApproved] = useState(false)
  const { account } = useWeb3React()
  const fetchAllowanceData = async () => {
    try {
      setIsLoadingApproved(true)
      const allowance = await tokenContract.methods.allowance(account, spenderAddress).call()
      const bnAllowance = new BigNumber(allowance)
      if (bnAllowance.isGreaterThan(0)) {
        setIsApproved(true)
        setIsLoadingApproved(false)
        return null
      }

      setIsApproved(false)

      setIsLoadingApproved(false)
      return null
    } catch (error) {
      setIsApproved(false)
      setIsLoadingApproved(false)
      return null
    }
  }

  useEffect(() => {
    if (tokenContract && account) {
      fetchAllowanceData()
    }
  }, [account, spenderAddress, tokenContract])

  return [isApproved, fetchAllowanceData, isLoadingApproved]
}

export default useIsApproved
