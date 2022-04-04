import React, { FC, useMemo, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import cx from 'classnames'
import { Layout } from 'layout'
import StakeBox from './components/StakeBox'
import InfoBox from './components/InfoBox'
import styles from './staking.module.scss'
import { ReactComponent as GiftSvg } from 'assets/img/gift.svg'
import { STAKE_TOKEN_TYPE } from './types'

const STAKE_TOKEN: STAKE_TOKEN_TYPE = {
  1: {
    ADDRESS: '0x256c8aF0Aa0F2c94C2204294aE5656e263fA6643',
    SYMBOL: 'MOL',
    NAME: 'MOL',
  },
  2: {
    ADDRESS: '0x88E602C8DFC84B311b36d216F1342e8492B5F40d',
    SYMBOL: 'BUSD',
    NAME: 'BUSD',
  },
}

const Staking: FC = () => {
  const [tabIndex, setTabIndex] = useState<1 | 2>(1)

  const onChangeTab = (tIndex: 1 | 2) => {
    setTabIndex(tIndex)
  }

  const tokenInfo = useMemo(() => {
    return STAKE_TOKEN[tabIndex]
  }, [tabIndex])

  return (
    <Layout>
      {/* <div className={styles.descriptionText}>
        <GiftSvg className={styles.giftIcon} />
        MOL is a multi-chain decentralized lottery and share all protocol fees with MOL holders!
      </div> */}
      {/* <br /> */}
      <div className={styles.tabWrapper}>
        {/* <button
          onClick={() => onChangeTab(1)}
          className={cx(styles.sidebarOption, tabIndex === 1 && styles.active)}
          style={{
            marginRight: '20px',
          }}
        >
          {STAKE_TOKEN[1].SYMBOL} Stake
        </button> */}
        {/* <button onClick={() => onChangeTab(2)} className={cx(styles.sidebarOption, tabIndex === 2 && styles.active)}>
          {STAKE_TOKEN[2].SYMBOL} Stake
        </button> */}
      </div>
      {/* <br />
      <div className={styles.headerText}>Stake {tokenInfo.SYMBOL} Token</div>
      <br /> */}
      <br />
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={tabIndex}
          addEndListener={(node, done) => {
            node.addEventListener('transitionend', done, false)
          }}
          classNames="fade"
        >
          <div className={styles.boxWrapper}>
            {tabIndex === 1 ? (
              <>
                <StakeBox tokenInfo={tokenInfo} />
                <InfoBox tokenInfo={tokenInfo} />
              </>
            ) : (
              <>
                <StakeBox tokenInfo={tokenInfo} />
                <InfoBox tokenInfo={tokenInfo} />
              </>
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </Layout>
  )
}

export default Staking
