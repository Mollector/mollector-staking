import React, { FC, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useWeb3React } from '@web3-react/core'
import cx from 'classnames'
import { useStakingContract } from 'web3/contract'
import { useWeb3Provider } from 'web3/web3'
import { STAKING_CONTRACT_ADDRESS } from 'const/const'
import styles from '../styles.module.scss'
import CornerIcon from './CornerIcon'
import { mapStakingHistoryData } from 'pages/staking/utils/mapHistoryData'
import { FilteredStakingData } from 'pages/staking/types'
import useTokenBalance from 'hooks/useTokenBalance'
import MolChest from '../../../../assets/img/chest/MOL-reward.png'
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
  const { chainId = 56, account } = useWeb3React()
  const [depositHistory, setDepositHistory] = useState<FilteredStakingData[]>([])
  const provider = useWeb3Provider()
  const [tokenBalance] = useTokenBalance(tokenInfo.ADDRESS, STAKING_CONTRACT_ADDRESS[chainId])
  const stakingContract = useStakingContract(provider, STAKING_CONTRACT_ADDRESS[chainId])

  useEffect(() => {
    const fetchDepositHistory = async () => {
      if (!account) return
      try {
        const response = await stakingContract.methods.getHistory(tokenInfo.ADDRESS, account, 2000).call()
        const mappedData = mapStakingHistoryData(response)
        setDepositHistory(mappedData)
      } catch (error) {
        console.log(error, 'ERROR ?')
        toast.error('Fail to fetch history info', {
          hideProgressBar: true,
        })
      }
    }

    fetchDepositHistory()
  }, [tokenInfo, account, stakingContract])
  // console.log(depositHistory, 'history ?')

  return (
    <div className={cx(styles.box, styles.infoBoxContainer)}>
      {account?
        <div className={styles.headerText}>Total Value Lock: {tokenBalance} MOL</div> : <></>
      }
      <br />
      <br />
      <div style={{color: '#505d6f'}}>AVAILABLE REWARDS</div>
      <br/>
      <img src={MolChest} style={{width: 'calc(100% + 26px)', margin: '0 -13px'}}/>
      {/* <div className={styles.amountTextBig}></div> */}
      {/* <div className={styles.titleGraph}>MOL</div>
      <div className={styles.wrappGraph}>
        <div className={styles.graph}>
          <div className={styles.graphCol}>
            <div className={styles.graphCell}>
              <div className={styles.textGraphRow}>2000</div>
              <CornerIcon />
            </div>
            <div className={styles.graphCell}>
              <div className={styles.textGraphRow}>1000</div>
              <CornerIcon />
            </div>
            <div className={styles.graphCell}>
              <div className={styles.textGraphRow}>500</div>
              <CornerIcon />
            </div>
            <div className={cx(styles.graphCell, styles.graphCellBottom)}>
              <div className={styles.textGraphRow}>200</div>
              <CornerIcon />
              <div className={cx(styles.textGraphRow, styles.textGraphRowEnd)}>0</div>
              <div className={cx(styles.textGraphCol, styles.textGraphColStart)}>7 days</div>
            </div>
          </div>
          <div className={cx(styles.graphCol, styles.graphColMiddle)}>
            <div className={styles.graphCell}>
              <CornerIcon />
            </div>
            <div className={styles.graphCell}>
              <CornerIcon />
            </div>
            <div className={styles.graphCell}>
              <CornerIcon />
            </div>
            <div className={cx(styles.graphCell, styles.graphCellBottom)}>
              <CornerIcon />
              <div className={styles.textGraphCol}>14 days</div>
            </div>
          </div>
          <div className={styles.graphCol}>
            <div className={styles.graphCell}>
              <CornerIcon />
            </div>
            <div className={styles.graphCell}>
              <CornerIcon />
            </div>
            <div className={styles.graphCell}>
              <CornerIcon />
            </div>
            <div className={cx(styles.graphCell, styles.graphCellBottom)}>
              <CornerIcon />
              <div className={styles.textGraphCol}>21 days</div>
              <div className={cx(styles.textGraphCol, styles.textGraphColEnd)}>28 days</div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default InfoBox
