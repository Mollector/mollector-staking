import React, { FC, useCallback, useEffect, useState, useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { toast } from 'react-toastify'
import BN from 'bn.js'
import { Contract } from 'web3-eth-contract'
import classNames from 'classnames'
import { GutterBox } from 'ui/gutter-box'
import { Button, NavLink } from 'ui/button'
import { getModeClassName } from 'ui/utils/get-theme-class-name'
import { Box } from 'modules/box'
import { TX_SCANERS, NAME, VESTING_CONTRACT_ADDRESS } from 'const/const'
import { useWeb3Provider } from 'web3/web3'
import { useVestingContract } from 'web3/contract'
import { walletConversion } from 'utils/convertWallet'
import { getBalanceAmount } from 'utils/formatBalance'
import configuration from 'configuration'
import styles from './Vesting.module.scss'
import { Layout } from 'layout'
import theme from '../../ui/styles/Theme.module.scss'
import { ReactComponent as CopySvg } from '../../assets/img/copy.svg'
import useMediaQuery from '../../hooks/useMediaQuery'

type ParamsType = {
  address: string
}
type TokensType = {}
const fetchInformation = async (contract: Contract, address: string) => {
  var [
    releaseAmount,
    lockedAmount,
    totalShare,
    released,
    unlocked,
    tge,
    cliff,
    duration
    // vestingAmount,
    // totalReleased,
    // totalUnlocked,
  ] = await Promise.all([
    contract.methods.calculateReleaseAmount(address).call(),
    contract.methods.tgeUnlock(address).call(),
    contract.methods.shares(address).call(),
    contract.methods.released(address).call(),
    contract.methods.unlocked(address).call(),
    contract.methods.TGE().call(),
    contract.methods.cliff().call(),
    contract.methods.duration().call(),
    // contract.methods.totalVestingAmount().call(),
    // contract.methods.totalReleased().call(),
    // contract.methods.totalUnlocked().call(),
  ])

  return {
    releaseAmount: new BN(releaseAmount.toString(), 10).div(new BN('1000000000000000000')).toNumber(),
    lockedAmount: new BN(lockedAmount.toString(), 10).div(new BN('1000000000000000000')).toNumber(),
    totalShare: new BN(totalShare.toString(), 10).div(new BN('1000000000000000000')).toNumber(),
    released: new BN(released.toString(), 10).div(new BN('1000000000000000000')).toNumber(),
    unlocked: new BN(unlocked.toString(), 10).div(new BN('1000000000000000000')).toNumber(),
    tge: new BN(tge.toString(), 10).toNumber() * 1000,
    cliff: new BN(cliff.toString(), 10).toNumber() * 1000,
    duration: new BN(duration.toString(), 10).toNumber() * 1000,
    vestingAmount: 0,// getBalanceAmount(vestingAmount).toNumber(),
    totalRelease: 0, //new BN(totalReleased).add(new BN(totalUnlocked)).toNumber(),
  }
}

const Vesting: FC<TokensType> = () => {
  const [amount, setAmount] = useState<{
    releaseAmount: number
    lockedAmount: number
    totalShare: number
    released: number
    unlocked: number
    tge: number
    cliff: number
    duration: number
    vestingAmount: number
    totalRelease: number
  }>({
    releaseAmount: 0,
    lockedAmount: 0,
    totalShare: 0,
    released: 0,
    unlocked: 0,
    tge: 0,
    cliff: 0,
    duration: 0,
    vestingAmount: 0,
    totalRelease: 0,
  })
  const [txHash, setTxHash] = useState<string>('')
  const [error, setError] = useState<string>('')

  const provider = useWeb3Provider()
  const { active, chainId = 56, account } = useWeb3React()
  const { address: VESTING_CONTRACT_ADDRESS } = useParams<ParamsType>()
  const contract = useVestingContract(provider, VESTING_CONTRACT_ADDRESS || '')
  const history = useHistory()
  const isMobile = useMediaQuery('(max-width: 576px)')
  const onCancel = () => {
    history.push('/')
  }

  const formatAddress = useCallback((address) => {
    if (address && isMobile) {
      const addressArr = address.split('')
      return `${addressArr.slice(0, 7).join('')}...${addressArr.slice(-7).join('')}`
    }

    return address
  }, [isMobile])

  const updateData = useCallback(async () => {
    if (account) {
      const myAmount = await fetchInformation(contract, account)
      console.log(myAmount)
      setAmount(myAmount)
      // if (myAmount.tge <= new Date().getTime()) {
      // } else {
      //   setAmount({
      //     releaseAmount: 0,
      //     lockedAmount: 0,
      //     totalShare: 0,
      //     released: 0,
      //     unlocked: 0,
      //     tge: myAmount.tge,
      //     cliff: myAmount.cliff,
      //     duration: myAmount.duration,
      //     vestingAmount: myAmount.vestingAmount,
      //     totalRelease: myAmount.totalRelease,
      //   })
      // }
    }
  }, [contract, account])

  useEffect(() => {
    const tm = setInterval(updateData, 5000)
    return () => clearInterval(tm)
  }, [contract, updateData])

  useEffect(() => {
    if (active) {
      updateData()
    }
  }, [active, updateData])

  const claimAction = async () => {
    try {
      if (amount.lockedAmount > 0 && amount.releaseAmount > 0) {
        const claimResult = await contract.methods.unlockAndRelease().send({ from: account })
        setTxHash(claimResult.transactionHash)
      } else if (amount.lockedAmount > 0) {
        const claimResult = await contract.methods.unlock().send({ from: account })
        setTxHash(claimResult.transactionHash)
      } else if (amount.releaseAmount > 0) {
        const claimResult = await contract.methods.release().send({ from: account })
        setTxHash(claimResult.transactionHash)
      }
    } catch (ex: any) {
      console.error(ex)
      setError(ex.message || ex.toString())
    }
  }

  const onAddToken = async () => {
    const provider = window.ethereum
    if (provider) {
      try {
        await provider.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: configuration.TOKEN_INFO,
          },
        })
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    } else {
      console.error(`Can't add token`)
      return false
    }
  }

  return (
    <Layout>
      <section className={styles.component}>
        <GutterBox className={styles.gutter}>
          <div className={classNames(styles.wrapper, getModeClassName('light', theme))}>
              <div>
                <Box className={styles.box}>
                  <p className={styles.title}>
                    Available Amount:
                    <br />
                    <span>
                      {amount.tge > new Date().getTime() ? 0 : parseFloat((amount.releaseAmount + amount.lockedAmount).toFixed(4)).toLocaleString()} {NAME}
                    </span>
                  </p>

                  <div className={styles.text}>{formatAddress(account)}</div>
                  <div
                    style={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'space-around',
                      marginTop: 20,
                    }}
                  >
                    <Button color="pink" size="large" variant="outlined" onClick={onCancel} style={{ width: '46%' }}>
                      Cancel
                    </Button>
                    <Button
                      color="pink"
                      size="large"
                      variant="contained"
                      onClick={claimAction}
                      disabled={amount.releaseAmount + amount.lockedAmount == 0 || amount.tge > new Date().getTime()}
                      style={{ width: '46%' }}
                    >
                      Claim
                    </Button>
                  </div>
                  <br />
                  <div style={{ fontFamily: 'monospace', textAlign: 'center' }}>
                  {/* lockedAmount: new BN(lockedAmount.toString(), 10).div(new BN('1000000000000000000')).toNumber(),
    totalShare: new BN(totalShare.toString(), 10).div(new BN('1000000000000000000')).toNumber(),
    released: new BN(released.toString(), 10).div(new BN('1000000000000000000')).toNumber(),
    unlocked: new BN(unlocked.toString(), 10).div(new BN('1000000000000000000')).toNumber(), */}

{/* contract.methods.tgeUnlock(address).call(),
    contract.methods.shares(address).call(),
    contract.methods.released(address).call(),
    contract.methods.unlocked(address).call(), */}
                    <div className={styles.text}>
                      Your Total Lock: <span className={styles.amount}>{parseFloat((amount.totalShare  - amount.released).toFixed(4)).toLocaleString()}</span> MOL
                    </div>
                    <div className={styles.text}>
                      Your Total Release : <span className={styles.amount}>{parseFloat((amount.released + amount.unlocked).toFixed(4)).toLocaleString()}</span> MOL
                    </div>
                    <div className={styles.text}>
                      Your TGE Amount : <span className={styles.amount}>{parseFloat(amount.lockedAmount.toFixed(4)).toLocaleString()}</span> MOL
                    </div>
                    <br/>

                    <p className={styles.text} style={{fontWeight: "bold"}}>
                      Token address: 
                      <div>{formatAddress('0x06597FFaFD82E66ECeD9209d539032571ABD50d9')}</div>
                      <div style={{display: 'inline-flex', alignItems: 'center'}}>
                        <div onClick={onAddToken}>
                          <span className={styles.addBtn}>+</span>
                        </div>
                        &nbsp;
                        <div style={{display: 'flex', alignItems: 'center'}}>
                          <CopyToClipboard
                            text="0x06597FFaFD82E66ECeD9209d539032571ABD50d9"
                            onCopy={() =>
                              toast.success('Copied', {
                                hideProgressBar: true,
                              })
                            }
                          >
                            <CopySvg className={styles.copyIcon} />
                          </CopyToClipboard>
                        </div>
                      </div>
                    </p>
                    <br/>

                    <p className={styles.text}>
                      TGE:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {new Date(amount.tge).toLocaleDateString()} {new Date(amount.tge).toLocaleTimeString()}
                    </p>
                    <p className={styles.text}>
                      Cliff at:&nbsp;&nbsp;{new Date(amount.cliff).toLocaleDateString()}{' '}
                      {new Date(amount.cliff).toLocaleTimeString()}
                    </p>
                    <p className={styles.text}>
                      Finish at:&nbsp;{new Date(amount.tge + amount.duration).toLocaleDateString()}{' '}
                      {new Date(amount.tge + amount.duration).toLocaleTimeString()}
                    </p>
                  </div>
                </Box>
                {/* {
									error&&
									<div style={{textAlign: 'center', color: 'red'}}><br/>{error}</div>
								} */}{' '}
                {txHash && (
                  <div style={{ textAlign: 'center' }}>
                    <br />
                    Transaction:{' '}
                    <a href={`${TX_SCANERS[chainId]}${txHash}`} target="__blank">
                      {txHash}
                    </a>
                  </div>
                )}
              </div>
          </div>
        </GutterBox>
      </section>
    </Layout>
  )
}

export default Vesting
