import React, { FC, useState, ChangeEvent, useMemo, useEffect } from 'react'
import { Oval } from 'react-loader-spinner'
import { toast } from 'react-toastify'
import { useWeb3React } from '@web3-react/core'
import cx from 'classnames'
import BigNumber from 'bignumber.js'
import { useWeb3Provider } from 'web3/web3'
import { useBep20TokenContract, useLPContract, useStakingContract } from 'web3/contract'
import Input from '../Input'
import useTokenBalance from 'hooks/useTokenBalance'
import useStakeValue from 'hooks/useStakeValue'
import useIsApproved from 'hooks/useIsApproved'
import useApprove from 'hooks/useApprove'
import { STAKING_CONTRACT_ADDRESS, STAKING_FINISH_AT, STAKING_REWARD_AT } from 'const/const'
import styles from '../styles.module.scss'
import { getDecimalAmount } from 'utils/formatBalance'
import championchest from '../../../../assets/img/chest/Champion.png'
import fighterchest from '../../../../assets/img/chest/Fighter.png'
import masterchest from '../../../../assets/img/chest/Master.png'
import veteranchest from '../../../../assets/img/chest/Veteran.png'

import merchantchest from '../../../../assets/img/chest/Merchant.png'
import noblechest from '../../../../assets/img/chest/Noble.png'
import royalchest from '../../../../assets/img/chest/Royal.png'
import vipchest from '../../../../assets/img/chest/VIP.png'


import CountDown from '../Countdown'
import { LoginModal, useModal } from 'modules/modal'
interface StakeBoxProps {
  tokenInfo: {
    ADDRESS: string
    SYMBOL: string
    NAME: string
    MIN: string
  }
}

const LoadingComponent = () => {
  return (
    <Oval
      ariaLabel="loading-indicator"
      height={32}
      width={32}
      strokeWidth={5}
      color="#ffffff"
      wrapperStyle={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      secondaryColor="#ddd"
    />
  )
}
const StakeBox: FC<StakeBoxProps> = ({ tokenInfo }) => {
  const { ADDRESS, SYMBOL, NAME, MIN } = tokenInfo
  const { account, chainId = 56 } = useWeb3React()
  const provider = useWeb3Provider()
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [isWithdraw, setIsWithdraw] = useState(false)
  const [isStaking, setIsStaking] = useState(false)
  const stakingContract = useStakingContract(provider, STAKING_CONTRACT_ADDRESS[chainId])
  const [tokenBalance] = useTokenBalance(ADDRESS, account)
  const [allTokenStakedBalance] = useTokenBalance(ADDRESS, STAKING_CONTRACT_ADDRESS[chainId])
  const tokenContract = useBep20TokenContract(provider, ADDRESS)
  const [tokenStakedValue] = useStakeValue(ADDRESS, STAKING_CONTRACT_ADDRESS[chainId])
  const LPContract = useLPContract(provider, ADDRESS)
  const [reserve, setReserve] = useState({
    totalSupply: 0,
    usd: 0,
    mol: 0
  })

  const [isTokenApproved, refetchStatusToken, isLoadingTokenApproved] = useIsApproved(
    tokenContract,
    STAKING_CONTRACT_ADDRESS[chainId],
  )
  const [onApproveToken, isLoadingOnApproveToken] = useApprove(tokenContract, STAKING_CONTRACT_ADDRESS[chainId])
  const onHandleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const stakeValue = e.target.value
    if (/^[0-9\b]+$/.test(stakeValue) || stakeValue === '') {
      setValue(stakeValue)
    }
  }

  const [onPresentLoginModal] = useModal(<LoginModal />)

  const isSufficient = useMemo(() => {
    const comparedValue = new BigNumber(tokenBalance).comparedTo(new BigNumber(value)) 
    if (comparedValue === 1 || comparedValue === 0) {
      return true
    }

    return false
  }, [tokenBalance, value])

  const isDisableMinMax = useMemo(() => {
    if (!isTokenApproved) return true

    return false
  }, [isTokenApproved])

  const onHandleWithdraw = async (): Promise<void> => {
    try {
      setIsWithdraw(true)
      const withdrawAmount = getDecimalAmount(Number(tokenStakedValue)).toString()
      const response = await stakingContract.methods.withdraw(ADDRESS, withdrawAmount).send({ from: account })
      setIsWithdraw(false)
    } catch (error) {
      setIsWithdraw(false)
      toast.error('Fail to withdraw', {
        hideProgressBar: true,
      })
    }
  }

  const onHandleStake = async (): Promise<void> => {
    try {
      if (!(parseFloat(value) > 0)) {
        return 
      }
      setIsStaking(true)
      const stakeAmount = getDecimalAmount(Number(value)).toString()
      const response = await stakingContract.methods.lock(ADDRESS, stakeAmount).send({ from: account })
      setIsStaking(false)
      setValue('')
      toast.success('Successfully staked', {
        hideProgressBar: true,
      })
    } catch (error) {
      setIsStaking(false)
      toast.error('Fail to stake', {
        hideProgressBar: true,
      })
    }
  }

  const onHandleChangeToMin = () => {
    setValue(MIN)
  }

  const onHandleChangeToMax = () => {
    setValue(tokenBalance.toString())
  }

  const onHandleApproveToken = async () => {
    await onApproveToken()
    refetchStatusToken()
  }

  const buttonText = useMemo(() => {
    if (isStaking) return <LoadingComponent />

    // if (!value) return 'Enter Amount'

    return 'Stake'

    // if (!isSufficient) return <>Insufficient {SYMBOL} balance</>
  }, [isSufficient, value, isStaking, SYMBOL])

  useEffect(() => {
    (async () => {
      if (SYMBOL != 'MOL' && account) {
        var { _reserve0, _reserve1 } = await LPContract.methods.getReserves().call()
        var totalSupply = await LPContract.methods.totalSupply().call()
  
        setReserve({
          totalSupply: new BigNumber(totalSupply).div(10 ** 18).toNumber(),
          usd: new BigNumber(_reserve1).div(10 ** 18).toNumber(),
          mol: new BigNumber(_reserve0).div(10 ** 18).toNumber()
        })
      }
    })()
  }, [tokenStakedValue, account, SYMBOL])

  
  function getChestImage(amount: any): string {

    if (SYMBOL != 'MOL') {
      var v = estimateUSD(amount)

      if (v < 500) return ''

      if (v < 1249) return merchantchest
      if (v < 2499) return vipchest
      if (v < 4999) return noblechest

      return royalchest
    }

    if (amount < 12000) return ''
    if (amount < 30000) return fighterchest
    if (amount < 60000) return veteranchest
    if (amount < 120000) return masterchest
    if (amount >= 120000) return championchest
    
    return ''
  }
  
  function getChestName(amount: any): string {

    if (SYMBOL != 'MOL') {
      var v = estimateUSD(amount)

      if (v < 500) return ''

      if (v < 1249) return 'MERCHANT CHEST'
      if (v < 2499) return 'VIP CHEST'
      if (v < 4999) return 'NOBLECHEST'

      return 'ROYAL CHEST'
    }

    if (amount < 12000) return ''
    if (amount < 30000) return 'FIGHTER CHEST'
    if (amount < 60000) return 'VETERAN CHEST'
    if (amount < 120000) return 'MASTER CHEST'
    if (amount >= 120000) return 'CHAMPION CHEST'
    
    return ''
  }

  function estimateUSD(v: number) : number {
    if (reserve.usd / reserve.mol < 0.01) {
      return parseFloat((
        (v / reserve.totalSupply) * reserve.usd 
        + (v / reserve.totalSupply) * reserve.mol * 0.01
      ).toFixed(2))
    }
    else {
      return parseFloat((
        (v / reserve.totalSupply) * reserve.usd * 2
      ).toFixed(2))
    }
  }

  function estimateMin() : string {
    if (SYMBOL == 'MOL') {
      return parseFloat(MIN).toLocaleString() + ' MOL ';
    }
    else {
      var v = reserve.usd / reserve.mol
      return `250 BUSD + ${Math.round(250 / v + 10).toLocaleString()} MOL `
    }
  }

  if (!account) {
    return (
      <div className={cx(styles.container, styles.stakeBoxContainer, styles.box)}>
        <div style={{color: 'black', textAlign: 'center', marginTop: 50}}>
          Connect wallet to continue
          <br/><br/>
          <button className={styles.connectStyle} onClick={onPresentLoginModal}>Connect wallet</button>
        </div>
      </div>
    )
  }


  return (
    <div className={cx(styles.container, styles.stakeBoxContainer, styles.box)}>
      <div>
        <div className={styles.headerText}>
            Your Stake <span
            style={{
              color: '#14b5b1',
              margin: '10px 0px',
            }}
          >
            <span>{tokenStakedValue.toLocaleString()} <span style={{fontSize: 14}}>{SYMBOL}</span></span>
          </span>
        </div>
        {tokenStakedValue && reserve.totalSupply && SYMBOL != 'MOL' ?
          <div style={{color: 'gray'}}>
            Estimate Your Staked LP Value: <span>${estimateUSD(parseFloat(tokenStakedValue as any)).toLocaleString()}</span>
          </div> : <></>
        }
        <div className={styles.amountText}>Your {SYMBOL} balance: <b>{tokenBalance.toLocaleString()}</b> | {account.slice(0, 5)}...{account.slice(account.length - 5)}</div>
        <Input
          value={value}
          isDisableMinMax={isDisableMinMax}
          onChange={onHandleChange}
          onHandleChangeToMin={onHandleChangeToMin}
          onHandleChangeToMax={onHandleChangeToMax}
        />
        {reserve.totalSupply && parseFloat(value) > 0 && SYMBOL != 'MOL' ?
          <div style={{color: 'gray', textAlign: 'center', marginTop: 5}}>
            Estimate Value: <span>${estimateUSD(parseFloat(value)).toLocaleString()}</span>
          </div> : <></>
        }
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <button className={styles.withdraw2Button} style={{width: '40%'}} disabled={tokenStakedValue == 0} onClick={() => onHandleWithdraw()}>
            Withdraw All
          </button>
          {STAKING_FINISH_AT > new Date().getTime() &&
            <div style={{width: '40%'}}>
              {isTokenApproved ? (
                <button className={styles.stakeButton} onClick={() => onHandleStake()}>
                  {buttonText}
                </button>
              ) : (
                <button className={styles.stakeButton} onClick={() => onHandleApproveToken()}>
                  {isLoadingOnApproveToken || isLoadingTokenApproved ? <LoadingComponent /> : <>Approve</>}
                </button>
              )}
            </div>
          }
        </div>
        {getChestName(tokenStakedValue) ?
            <div className={styles.infoWrapper} style={{textAlign: 'center'}}>
              <span style={{color: '#505d6e', fontWeight: 'normal'}}>Your Reward: <b>{getChestName(tokenStakedValue)}</b></span>
              <div style={{position: 'relative'}}>
                <img src={getChestImage(tokenStakedValue)} style={{width: '40%'}} className="animate__animated animate__pulse animate__infinite"/>
              </div>
              <button className={styles.claimReward} style={{width: '250px'}}>
                <CountDown finishAt={STAKING_REWARD_AT} />
              </button>
              <div style={{color: '#f95554', fontWeight: 'normal'}}>
                <br/>
                Rewards will be revoked if Staking is withdrawn<br/>before {new Date(STAKING_REWARD_AT).toLocaleString()}
              </div>
            </div>
            : <div style={{color: 'gray', marginTop: 50, textAlign: 'center'}}>
              You have not staked enough {SYMBOL}.<br/>Complete at least {estimateMin()}to earn NFT rewards.
            </div>
        }
      </div>
    </div>
  )
}

export default StakeBox
