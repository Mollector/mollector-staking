import React, { FC, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useWeb3React } from '@web3-react/core'
import cx from 'classnames'
import { useLPContract, useStakingContract } from 'web3/contract'
import { useWeb3Provider } from 'web3/web3'
import { STAKING_CONTRACT_ADDRESS } from 'const/const'
import styles from '../styles.module.scss'
import CornerIcon from './CornerIcon'
import { mapStakingHistoryData } from 'pages/staking/utils/mapHistoryData'
import { FilteredStakingData } from 'pages/staking/types'
import useTokenBalance from 'hooks/useTokenBalance'
import MolChest from '../../../../assets/img/chest/MOL-reward.png'
import LPChest from '../../../../assets/img/chest/LP-reward.png'
import BigNumber from 'bignumber.js'
interface InfoBoxProps {
  tokenInfo: {
    ADDRESS: string
    SYMBOL: string
    NAME: string
  }
}

const InfoBox: FC<InfoBoxProps> = ({
  tokenInfo
}) => {
  const { ADDRESS, SYMBOL, NAME } = tokenInfo
  const { chainId = 56, account } = useWeb3React()
  const [depositHistory, setDepositHistory] = useState<FilteredStakingData[]>([])
  const provider = useWeb3Provider()
  const [tokenBalance] = useTokenBalance(tokenInfo.ADDRESS, STAKING_CONTRACT_ADDRESS[chainId])
  const stakingContract = useStakingContract(provider, STAKING_CONTRACT_ADDRESS[chainId])
  const LPContract = useLPContract(provider, ADDRESS)
  const [reserve, setReserve] = useState({
    totalSupply: 0,
    usd: 0
  })
  
  useEffect(() => {
    (async () => {
      if (SYMBOL != 'MOL') {
        var { _reserve0, _reserve1 } = await LPContract.methods.getReserves().call()
        var totalSupply = await LPContract.methods.totalSupply().call()
  
        console.log({
          _reserve0, 
          _reserve1,
          totalSupply
        })
  
        setReserve({
          totalSupply: new BigNumber(totalSupply).div(10 ** 18).toNumber(),
          usd: new BigNumber(_reserve1).div(10 ** 18).toNumber() * 2
        })
      }
    })()
  }, [tokenBalance, SYMBOL])


  // useEffect(() => {
  //   const fetchDepositHistory = async () => {
  //     if (!account) return
  //     try {
  //       console.log('does come here')
  //       const response = await stakingContract.methods.getHistory(tokenInfo.ADDRESS, account, 2000).call()
  //       const mappedData = mapStakingHistoryData(response)
  //       setDepositHistory(mappedData)
  //     } catch (error) {
  //       toast.error('Fail to fetch history info', {
  //         hideProgressBar: true,
  //       })
  //     }
  //   }

  //   fetchDepositHistory()
  // }, [tokenInfo, account, stakingContract])

  return (
    <div className={cx(styles.box, styles.infoBoxContainer)}>
      {account?
        <div>
          <div className={styles.headerText}>Total Value Lock: {tokenBalance.toLocaleString()} <span style={{fontSize: 14}}>{tokenInfo.SYMBOL}</span></div>
          {tokenBalance && reserve.totalSupply && SYMBOL != 'MOL' ?
            <div style={{color: 'gray'}}>
              Estimate Total LP Value: <span>${parseFloat(((parseInt(tokenBalance as any) / reserve.totalSupply) * reserve.usd).toFixed(2)).toLocaleString()}</span>
            </div> : <></>
          }
          <br />
        </div>
        : <></>
      }
      <div style={{color: '#505d6f'}}>AVAILABLE REWARDS</div>
      <br/>
      <img src={tokenInfo.SYMBOL == 'MOL' ? MolChest : LPChest} style={{width: 'calc(100% + 26px)', margin: '0 -13px'}}/>
    </div>
  )
}

export default InfoBox
