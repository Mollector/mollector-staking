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


// TRƯỜNG HỢP ĐỦ ĐIỀU KIỆN NHẬN REWARDS
// 1.	Cập nhật text “Your claimable reward: [Quantity] [Chest name]”
// 2.	Button “CLAIM REWARD” is available. Khi click button này sẽ nhảy lên popup “Rewards will be claimed after Open Beta date. Follow us on social media for important updates”
// 3.	Cập nhật text như sau
// •	Rewards will be revoked if Staking is withdrawn before 5/14/2022, 5:00:00 PM
// •	Rewards will be claimed after Open Beta date. Follow us on social media for important updates.
// “social media” link https://linktr.ee/Mollector
// TRƯỜNG HỢP KHÔNG ĐỦ ĐIỀU KIỆN NHẬN THƯỞNG
// 1.	“Your reward: You were not eligible for any of the listed rewards. If you have any question, please contact us via support@mollector.com and use the subject Staking Event”
// 2.	Button “CLAIM REWARD” is invisible

var nonechest = ''

var listReward: any = {
  '0x40e7c5aa34846968d37e2c6a2eaeec0072967872': {
    molText: '',
    lpText: '',
    molImage: veteranchest,
    lpImage: nonechest
  },
  '0x3e77f384c9e55d8ae52684830f0db571c5116e88': {
    molText: '',
    lpText: '',
    molImage: nonechest,
    lpImage: nonechest
  },
  '0x95843d66df555a86bf4e59f9af8fd5620d7bbe4e': {
    molText: '2 VETERAN CHEST',
    lpText: '',
    molImage: veteranchest,
    lpImage: nonechest
  },
  '0xc33216acd94b4862599f3ffedd98d370a4fb3b98': {
    molText: '',
    lpText: '',
    molImage: nonechest,
    lpImage: nonechest
  },
  '0x63eae70a7bef426dc2cd1ebbd0c176ea6448fb25': {
    molText: '4 CHAMPION CHEST',
    lpText: '',
    molImage: championchest,
    lpImage: nonechest
  },
  '0x9f73a63a3743df901028ed5bd73055e685bd9fa5': {
    molText: '1 FIGHTER CHEST',
    lpText: '',
    molImage: fighterchest,
    lpImage: nonechest
  },
  '0xc914dcff3b059bfcc1abf344ac6fdc8e8d8117ff': {
    molText: '1 FIGHTER CHEST',
    lpText: '',
    molImage: fighterchest,
    lpImage: nonechest
  },
  '0xc10842058497efb5d3c4ae200abe3e2114e0479f': {
    molText: '1 FIGHTER CHEST',
    lpText: '',
    molImage: fighterchest,
    lpImage: nonechest
  },
  '0x0e916752b8df4b17202aa4e597bbfe6ad2a6ba2e': {
    molText: '',
    lpText: '',
    molImage: nonechest,
    lpImage: nonechest
  },
  '0x95fefb9c6c66b0199e30db23fd67d5bf9badef5e': {
    molText: '4 CHAMPION CHEST',
    lpText: '',
    molImage: championchest,
    lpImage: nonechest
  },
  '0x40b13961da4c7374396ccb22d9fb3966907578f3': {
    molText: '2 VETERAN CHEST',
    lpText: '',
    molImage: veteranchest,
    lpImage: nonechest
  },
  '0x8a42a695b150f10ed895e9cfcb5d1dc5955ed1dd': {
    molText: '2 VETERAN CHEST',
    lpText: '',
    molImage: veteranchest,
    lpImage: nonechest
  },
  '0x532828631c538b5b235b0bb88da5a06b178c0623': {
    molText: '1 FIGHTER CHEST',
    lpText: '',
    molImage: fighterchest,
    lpImage: nonechest
  },
  '0xa40a7931f9c754c4ed583648fc383d27436674b9': {
    molText: '2 VETERAN CHEST',
    lpText: '',
    molImage: veteranchest,
    lpImage: nonechest
  },
  '0xdb71a18336e01ac76fd93b15ed89a720cb8c0734': {
    molText: '4 CHAMPION CHEST',
    lpText: '',
    molImage: championchest,
    lpImage: nonechest
  },
  '0xf9a35ad0d67cda8a685591b5c379a5dd99d14bf2': {
    molText: '1 FIGHTER CHEST',
    lpText: '3 MERCHANT CHEST',
    molImage: fighterchest,
    lpImage: merchantchest
  },
  '0x039b7767d2c697a9007a41c56f91d02bdefc5781': {
    molText: '2 VETERAN CHEST',
    lpText: '',
    molImage: veteranchest,
    lpImage: nonechest
  },
  '0x03556fabaf25763dcfb6af1e411820c6e776f8a8': {
    molText: '1 FIGHTER CHEST',
    lpText: '',
    molImage: fighterchest,
    lpImage: nonechest
  },
  '0x111d216f65a568f494b05da4de30dbb39b637ca7': {
    molText: '1 FIGHTER CHEST',
    lpText: '',
    molImage: fighterchest,
    lpImage: nonechest
  },
  '0x861ab6938f7aa6de8689896fc6f5899956dbcf4e': {
    molText: '1 FIGHTER CHEST',
    lpText: '',
    molImage: fighterchest,
    lpImage: nonechest
  },
  '0xdc283e1bfaae576ea5819ec684b72536ad7c8d47': {
    molText: '1 FIGHTER CHEST',
    lpText: '',
    molImage: fighterchest,
    lpImage: nonechest
  },
  '0xc0bdaf2a06b5a87035d331f9b48868357e2641a8': {
    molText: '3 MASTER CHEST',
    lpText: '',
    molImage: masterchest,
    lpImage: nonechest
  },
  '0xd567f9e3d08df3f32a7f235a6b290a68b74e73c3': {
    molText: '',
    lpText: '3 MERCHANT CHEST',
    molImage: nonechest,
    lpImage: merchantchest
  },
  '0xb752a092c915778dc73a42cfd8e527d3203fc265': {
    molText: '2 VETERAN CHEST',
    lpText: '',
    molImage: veteranchest,
    lpImage: nonechest
  },
  '0x7cf349719f21244cb4fa3c436e84bb5a2710dc5a': {
    molText: '',
    lpText: '',
    molImage: nonechest,
    lpImage: nonechest
  },
  '0x7a7c816c0817dbb624c039fc4ad86d59609952bb': {
    molText: '1 FIGHTER CHEST',
    lpText: '15 ROYAL CHEST',
    molImage: fighterchest,
    lpImage: royalchest
  },
  '0xa017fa3c190461b0b1b1c635d9b90b0b50cf3396': {
    molText: '2 VETERAN CHEST',
    lpText: '',
    molImage: veteranchest,
    lpImage: nonechest
  },
  '0xb03af61ce57bc5a0939b2f076ddb89940682d2f9': {
    molText: '',
    lpText: '',
    molImage: nonechest,
    lpImage: nonechest
  },
  '0x6f9f8d796e2ace5b69b2223cb6fb69f937a123c0': {
    molText: '',
    lpText: '3 MERCHANT CHEST',
    molImage: nonechest,
    lpImage: merchantchest
  },
  '0xcf01d6282d9db887d3a7e45dd03e13192cb6c838': {
    molText: '',
    lpText: '',
    molImage: nonechest,
    lpImage: nonechest
  },
  '0x18bb2bd0a8824a309b057fb63468f9c09d13839f': {
    molText: '1 FIGHTER CHEST',
    lpText: '',
    molImage: fighterchest,
    lpImage: nonechest
  },
  '0xb5ce675b7885c794d34f1dfd68dd1b98423bd439': {
    molText: '1 FIGHTER CHEST',
    lpText: '',
    molImage: fighterchest,
    lpImage: nonechest
  },
  '0x3b89fad59c2cfee70d5da0643278f92a2e82b565': {
    molText: '1 FIGHTER CHEST',
    lpText: '',
    molImage: fighterchest,
    lpImage: nonechest
  },
  '0x3ba26f7cce4bdd436d2a3d1d5e3126567d3863d7': {
    molText: '',
    lpText: '',
    molImage: nonechest,
    lpImage: nonechest
  },
  '0xd899a2802e9b2d1644574fb1c6be7b3671bb0d09': {
    molText: '1 FIGHTER CHEST',
    lpText: '',
    molImage: fighterchest,
    lpImage: nonechest
  },
  '0x17902aea62ffa0e56117dfa14f6ef649f3862a93': {
    molText: '4 CHAMPION CHEST',
    lpText: '',
    molImage: championchest,
    lpImage: nonechest
  },
  '0x0a2a81672be53fb6d94978a2477162030f7507e0': {
    molText: '4 CHAMPION CHEST',
    lpText: '',
    molImage: championchest,
    lpImage: nonechest
  },
  '0x3fddaedca8a6fe376a868aeb4ca8e4b8e7987df6': {
    molText: '1 FIGHTER CHEST',
    lpText: '',
    molImage: fighterchest,
    lpImage: nonechest
  },
  '0xdf693a86ca46fe0e33cc3962eea13cc743302c38': {
    molText: '1 FIGHTER CHEST',
    lpText: '',
    molImage: fighterchest,
    lpImage: nonechest
  },
  '0xba6e61797d6d9ff765aacf7a97cf2a1b475e7ce7': {
    molText: '',
    lpText: '',
    molImage: nonechest,
    lpImage: nonechest
  },
  '0x4f5bb22385b8359af23ff6e5044d13cd4fd9976c': {
    molText: '2 VETERAN CHEST',
    lpText: '',
    molImage: veteranchest,
    lpImage: nonechest
  },
  '0x5c720e7eb32c009419846d70945da9427102d9f6': {
    molText: '1 FIGHTER CHEST',
    lpText: '',
    molImage: fighterchest,
    lpImage: nonechest
  },
  '0xfaf5f1257ee1b0a550a4d4edb1e1435dc0967565': {
    molText: '',
    lpText: '',
    molImage: nonechest,
    lpImage: nonechest
  },
  '0x3550c1930d80d2d704e929954a9be6b2b4dd1ce9': {
    molText: '1 FIGHTER CHEST',
    lpText: '',
    molImage: fighterchest,
    lpImage: nonechest
  },
  '0x6dd5ee4dd0bd6dcd3da5bc41452c743e28b8ce6e': {
    molText: '1 FIGHTER CHEST',
    lpText: '3 MERCHANT CHEST',
    molImage: fighterchest,
    lpImage: merchantchest
  },
  '0x0a1ac6840048783d4db0d2d8548d76c969d51b0e': {
    molText: '',
    lpText: '',
    molImage: nonechest,
    lpImage: nonechest
  },
  '0x21c4ec2e3aef89b9cd8d590ad95c9a5cf6bec546': {
    molText: '',
    lpText: '',
    molImage: nonechest,
    lpImage: nonechest
  },
  '0x80c0632fdec7d293d58b829eee92e2f6a557dd17': {
    molText: '',
    lpText: '9 NOBLECHEST',
    molImage: nonechest,
    lpImage: noblechest
  }
}

function reward(s: string) {
  return listReward[s] || {
    molText: '',
    lpText: '',
    molImage: nonechest,
    lpImage: nonechest
  }
}
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
      var v = await tokenContract.methods.balanceOf(account).call()
      var stakeAmount = getDecimalAmount(Number(value))

      if (stakeAmount.isGreaterThan(v)) {
        stakeAmount = v
        console.log(v.toString())
      }

      console.log(stakeAmount.toString())

      const response = await stakingContract.methods.lock(ADDRESS, stakeAmount.toString()).send({ from: account })
      setIsStaking(false)
      setValue('')
      toast.success('Successfully staked', {
        hideProgressBar: true,
      })
    } catch (error) {
      setIsStaking(false)
      toast.error('Fail to stake ' + (((error as any) || {}).message || ((error as any) || {}).msg || (error as any)).toString(), {
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

      if (v < 1249) return '3 MERCHANT CHEST'
      if (v < 2499) return '6 VIP CHEST'
      if (v < 4999) return '9 NOBLECHEST'

      return '15 ROYAL CHEST'
    }

    if (amount < 12000) return ''
    if (amount < 30000) return '1 FIGHTER CHEST'
    if (amount < 60000) return '2 VETERAN CHEST'
    if (amount < 120000) return '3 MASTER CHEST'
    if (amount >= 120000) return '4 CHAMPION CHEST'
    
    return ''
  }

  function estimateUSD(v: number) : number {
    console.log('hello')
    console.log(reserve.usd, reserve.mol, reserve.totalSupply)
    if (reserve.usd / reserve.mol < 0.015) {
      return parseFloat((
        (v / reserve.totalSupply) * reserve.usd 
        + (v / reserve.totalSupply) * reserve.mol * 0.015
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

        {SYMBOL == 'MOL' && reward(account.toLowerCase()).molText &&
          <div className={styles.infoWrapper} style={{textAlign: 'center'}}>
            <span style={{color: '#505d6e', fontWeight: 'normal'}}>Your claimable reward: <b>{reward(account.toLowerCase()).molText}</b></span>
            <div style={{position: 'relative'}}>
              <img src={reward(account.toLowerCase()).molImage} style={{width: '40%'}} className="animate__animated animate__pulse animate__infinite"/>
            </div>
            <button className={styles.claimReward} style={{width: '250px', opacity: 0.5}}>
              CLAIM REWARD
            </button>
            <div style={{color: '#f95554', fontWeight: 'normal'}}>
              <br/>
              Rewards will be claimed after <b>Open Beta date.</b><br/> Follow us on <a href="https://linktr.ee/Mollector">social media</a> for important updates.
            </div>
          </div>
        }

        {SYMBOL != 'MOL' && reward(account.toLowerCase()).lpText &&
          <div className={styles.infoWrapper} style={{textAlign: 'center'}}>
            <span style={{color: '#505d6e', fontWeight: 'normal'}}>Your claimable reward: <b>{reward(account.toLowerCase()).lpText}</b></span>
            <div style={{position: 'relative'}}>
              <img src={reward(account.toLowerCase()).lpImage} style={{width: '40%'}} className="animate__animated animate__pulse animate__infinite"/>
            </div>
            <button className={styles.claimReward} style={{width: '250px', opacity: 0.5}}>
              CLAIM REWARD
            </button>
            <div style={{color: '#f95554', fontWeight: 'normal'}}>
              <br/>
              Rewards will be claimed after <b>Open Beta date.</b><br/> Follow us on <a href="https://linktr.ee/Mollector">social media</a> for important updates.
            </div>
          </div>
        }

        {(SYMBOL == 'MOL' && !reward(account.toLowerCase()).molText) &&
          <div style={{color: '#505d6e', fontWeight: 'normal', textAlign: 'center'}}>Your reward: You were not eligible for any of the listed rewards. If you have any question, please contact us via support@mollector.com and use the subject Staking Event</div>
        }
        {(SYMBOL != 'MOL' && !reward(account.toLowerCase()).lpText) &&
          <div style={{color: '#505d6e', fontWeight: 'normal', textAlign: 'center'}}>Your reward: You were not eligible for any of the listed rewards. If you have any question, please contact us via support@mollector.com and use the subject Staking Event</div>
        }

        {/* {(!reward(account.toLowerCase()).molText && !reward(account.toLowerCase()).lpText) && (getChestName(tokenStakedValue) ?
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
            </div>)
        } */}
      </div>
    </div>
  )
}

export default StakeBox
