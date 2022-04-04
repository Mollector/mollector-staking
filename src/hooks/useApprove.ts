import { useState } from 'react';
import { useCallback } from 'react'
import { ethers } from 'ethers'
import { Contract } from 'web3-eth-contract'
import { useWeb3React } from '@web3-react/core'

const useApprove = (tokenContract: Contract, spenderAddress: string): [approveFunction: Function, b: boolean] => {
  const { account } = useWeb3React()
  const [loading, setLoading] = useState(false)

  const handleApprove = useCallback(async () => {
    try {
      setLoading(true)
      const tx = await tokenContract.methods.approve(spenderAddress, ethers.constants.MaxUint256).send({
        from: account,
      })
      setLoading(false)
      return tx
    } catch (e) {
      setLoading(false)
      return false
    }
  }, [account, tokenContract, spenderAddress])

  return [handleApprove, loading]
}

export default useApprove