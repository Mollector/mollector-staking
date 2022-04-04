import React, { ChangeEvent, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import classNames from 'classnames'
import styles from './styles.module.scss'
import theme from 'ui/styles/Theme.module.scss'
import { GutterBox } from 'ui/gutter-box'
import { getModeClassName } from 'ui/utils/get-theme-class-name'
import { useWeb3React } from '@web3-react/core'
import { Button } from 'ui/button'
import { Box } from 'modules/box'
import PageLoading from 'modules/PageLoading'
import { useBep20TokenContract, useStakingContract } from 'web3/contract'
import { useWeb3Provider } from 'web3/web3'
import { STAKING_CONTRACT_ADDRESS, TOKEN1_STAKE, TOKEN2_STAKE } from 'const/const'
import useTokenBalance from 'hooks/useTokenBalance'
import useStakeValue from 'hooks/useStakeValue'
import useIsApproved from 'hooks/useIsApproved'
import { getDecimalAmount } from 'utils/formatBalance'
import useApprove from 'hooks/useApprove'
import { Layout } from 'layout'

interface StakingProps {}

const INPUT_REGEX = /^[0-9\b]+$/

const Staking: React.FC<StakingProps> = () => {
  const { active, chainId = 56, account } = useWeb3React()
  const [token1Value, setToken1Value] = useState<string>('')
  const [token2Value, setToken2Value] = useState<string>('')
  const [input1Error, setInput1Error] = useState<string>('')
  const [input2Error, setInput2Error] = useState<string>('')
  const [isStakingToken1, setIsStakingToken1] = useState<boolean>(false)
  const [isStakingToken2, setIsStakingToken2] = useState<boolean>(false)
  const [isWithdrawToken1, setIsWithdrawToken1] = useState<boolean>(false)
  const [isWithdrawToken2, setIsWithdrawToken2] = useState<boolean>(false)
  const provider = useWeb3Provider()
  const stakingContract = useStakingContract(provider, STAKING_CONTRACT_ADDRESS[chainId])
  const [token1Balance] = useTokenBalance(TOKEN1_STAKE[chainId].ADDRESS, account)
  const [token2Balance] = useTokenBalance(TOKEN2_STAKE[chainId].ADDRESS, account)
  const [token1StakedBalance] = useTokenBalance(TOKEN1_STAKE[chainId].ADDRESS, STAKING_CONTRACT_ADDRESS[chainId])
  const [token2StakedBalance] = useTokenBalance(TOKEN2_STAKE[chainId].ADDRESS, STAKING_CONTRACT_ADDRESS[chainId])
  const stakeToken1Contract = useBep20TokenContract(provider, TOKEN1_STAKE[chainId].ADDRESS)
  const stakeToken2Contract = useBep20TokenContract(provider, TOKEN2_STAKE[chainId].ADDRESS)
  const [token1StakeValue] = useStakeValue(TOKEN1_STAKE[chainId].ADDRESS, STAKING_CONTRACT_ADDRESS[chainId])
  const [token2StakeValue] = useStakeValue(TOKEN2_STAKE[chainId].ADDRESS, STAKING_CONTRACT_ADDRESS[chainId])
  const [isToken1Approved, refetchStatusToken1, isLoadingToken1Approved] = useIsApproved(
    stakeToken1Contract,
    STAKING_CONTRACT_ADDRESS[chainId],
  )
  const [isToken2Approved, refetchStatusToken2, isLoadingToken2Approved] = useIsApproved(
    stakeToken2Contract,
    STAKING_CONTRACT_ADDRESS[chainId],
  )

  const [onApproveToken1, isLoadingOnApproveToken1] = useApprove(stakeToken1Contract, STAKING_CONTRACT_ADDRESS[chainId])
  const [onApproveToken2, isLoadingOnApproveToken2] = useApprove(stakeToken2Contract, STAKING_CONTRACT_ADDRESS[chainId])

  const onHandleApproveToken1 = async () => {
    await onApproveToken1()
    refetchStatusToken1()
  }

  const onHandleApproveToken2 = async () => {
    await onApproveToken2()
    refetchStatusToken2()
  }

  const onHandleChangeToken1Value = (e: ChangeEvent<HTMLInputElement>): void => {
    const stakeValue = e.target.value
    if (INPUT_REGEX.test(stakeValue) || stakeValue === '') {
      setToken1Value(stakeValue)
    }
  }

  const onHandleChangeToken2Value = (e: ChangeEvent<HTMLInputElement>): void => {
    const stakeValue = e.target.value
    if (INPUT_REGEX.test(stakeValue) || stakeValue === '') {
      setToken2Value(stakeValue)
    }
  }

  const TOKEN1_SYMBOL = useMemo(() => {
    return TOKEN1_STAKE[chainId].SYMBOL
  }, [chainId])

  const TOKEN2_SYMBOL = useMemo(() => {
    return TOKEN2_STAKE[chainId].SYMBOL
  }, [chainId])

  const onHandleWithdraw = async (option: Number): Promise<void> => {
    try {
      if (option === 1) {
        setIsWithdrawToken1(true)
        const withdrawAmount = getDecimalAmount(Number(token1StakeValue)).toString()
        const response = await stakingContract.methods
          .withdraw(TOKEN1_STAKE[chainId].ADDRESS, withdrawAmount)
          .send({ from: account })
        setIsWithdrawToken1(false)
      } else {
        setIsWithdrawToken2(true)
        const withdrawAmount = getDecimalAmount(Number(token2StakeValue)).toString()
        const response = await stakingContract.methods
          .withdraw(TOKEN2_STAKE[chainId].ADDRESS, withdrawAmount)
          .send({ from: account })
        setIsWithdrawToken2(false)
      }
    } catch (error) {
      setIsWithdrawToken1(false)
      setIsWithdrawToken2(false)
      toast.error('Fail to withdraw', {
        hideProgressBar: true,
      })
    }
  }

  const onHandleStake = async (option: number): Promise<void> => {
    try {
      if (option === 1) {
        setIsStakingToken1(true)
        const stakeAmount = getDecimalAmount(Number(token1Value)).toString()
        const response = await stakingContract.methods
          .lock(TOKEN1_STAKE[chainId].ADDRESS, stakeAmount)
          .send({ from: account })
        setIsStakingToken1(false)
        setToken1Value('')
      } else {
        setIsStakingToken2(true)
        const stakeAmount = getDecimalAmount(Number(token2Value)).toString()
        const response = await stakingContract.methods
          .lock(TOKEN2_STAKE[chainId].ADDRESS, stakeAmount)
          .send({ from: account })
        setIsStakingToken2(false)
        setToken2Value('')
      }

      toast.success('Successfully staked', {
        hideProgressBar: true,
      })
    } catch (error) {
      setIsStakingToken1(false)
      setIsStakingToken2(false)
      toast.error('Fail to stake', {
        hideProgressBar: true,
      })
    }
  }

  const onMaxToken1 = () => {
    setToken1Value(token1Balance.toString())
  }

  const onMaxToken2 = () => {
    setToken2Value(token2Balance.toString())
  }

  return (
    <Layout>
      <section className={styles.component}>
        <GutterBox className={styles.gutter}>
          <div className={classNames(styles.wrapper, getModeClassName('light', theme))}>
            <div className={styles.container}>
              <div className={styles.containerWrapper}>
                <div className={styles.boxWrapper}>
                  <Box
                    className={styles.miniBox}
                    style={{
                      marginRight: '30px',
                    }}
                  >
                    <p className={styles.title}>
                      Your stake:
                      <br />
                      <span>
                        {token1StakeValue} {TOKEN1_SYMBOL}
                      </span>
                    </p>
                    <p className={styles.text}>
                      Total lock value: {token1StakedBalance} {TOKEN1_SYMBOL}
                    </p>

                    <div className={styles.inputContainer}>
                      <div
                        style={{
                          width: '100%',
                        }}
                      >
                        <input
                          className={classNames({
                            [styles.input]: true,
                            [styles.empty]: `${token1Value}`,
                            [styles.inputError]: `${input1Error}`,
                          })}
                          value={token1Value}
                          onChange={onHandleChangeToken1Value}
                        />

                        <div className={styles.inputInfo}>
                          <div className={classNames({ [styles.blur]: !token1Value })}>
                            {token1Value || 0} {TOKEN1_SYMBOL}
                          </div>
                          <span className={styles.maxBtn} onClick={onMaxToken1}>
                            Max
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.wrapperBtn}>
                      {isToken1Approved ? (
                        <Button
                          color="pink"
                          size="large"
                          disabled={!token1Value}
                          variant="contained"
                          isLoading={isStakingToken1}
                          onClick={() => onHandleStake(1)}
                          className={styles.button}
                        >
                          Stake
                        </Button>
                      ) : (
                        <Button
                          color="pink"
                          size="large"
                          variant="contained"
                          onClick={onHandleApproveToken1}
                          className={styles.button}
                          isLoading={(isLoadingToken1Approved || isLoadingOnApproveToken1) as boolean}
                        >
                          Approve
                        </Button>
                      )}
                      <Button
                        color="pink"
                        size="large"
                        variant="contained"
                        disabled={token1StakeValue === 0}
                        style={{
                          backgroundColor: '#D17627',
                        }}
                        isLoading={isWithdrawToken1}
                        onClick={() => onHandleWithdraw(1)}
                        className={styles.button}
                      >
                        Withdraw all
                      </Button>
                    </div>
                  </Box>
                  <Box className={styles.info}></Box>
                </div>
                <div className={styles.boxWrapper}>
                  <Box className={styles.miniBox}>
                    <p className={styles.title}>
                      Your stake:
                      <br />
                      <span>
                        {token2StakeValue} {TOKEN2_SYMBOL}
                      </span>
                    </p>
                    <p className={styles.text}>
                      Total lock value: {token2StakedBalance} {TOKEN2_SYMBOL}
                    </p>
                    <div className={styles.inputContainer}>
                      <div
                        style={{
                          width: '100%',
                        }}
                      >
                        <input
                          className={classNames(styles.input, { [styles.empty]: `${token2Value}` })}
                          value={token2Value}
                          onChange={onHandleChangeToken2Value}
                        />
                        <div className={styles.inputInfo}>
                          <div className={classNames({ [styles.blur]: !token2Value })}>
                            {token2Value || 0} {TOKEN2_SYMBOL}
                          </div>
                          <span className={styles.maxBtn} onClick={onMaxToken2}>
                            Max
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.wrapperBtn}>
                      {isToken2Approved ? (
                        <Button
                          color="pink"
                          size="large"
                          variant="contained"
                          disabled={!token2Value}
                          isLoading={isStakingToken2}
                          onClick={() => onHandleStake(2)}
                          className={styles.button}
                        >
                          Stake
                        </Button>
                      ) : (
                        <Button
                          color="pink"
                          size="large"
                          variant="contained"
                          onClick={onHandleApproveToken2}
                          className={styles.button}
                          isLoading={(isLoadingToken2Approved || isLoadingOnApproveToken2) as boolean}
                        >
                          Approve
                        </Button>
                      )}
                      <Button
                        color="pink"
                        size="large"
                        variant="contained"
                        disabled={token2StakeValue === 0}
                        style={{
                          backgroundColor: '#D17627',
                        }}
                        isLoading={isWithdrawToken2}
                        onClick={() => onHandleWithdraw(2)}
                        className={styles.button}
                      >
                        Withdraw all
                      </Button>
                    </div>
                  </Box>
                  <Box className={styles.info}></Box>
                </div>
              </div>
            </div>
          </div>
        </GutterBox>
      </section>
    </Layout>
  )
}

export default Staking
