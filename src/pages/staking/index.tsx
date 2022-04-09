import React, { FC, useMemo, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import cx from 'classnames'
import { Layout } from 'layout'
import StakeBox from './components/StakeBox'
import InfoBox from './components/InfoBox'
import styles from './staking.module.scss'
import { ReactComponent as GiftSvg } from 'assets/img/gift.svg'
import { STAKE_TOKEN_TYPE } from './types'
import { TOKEN1_STAKE, TOKEN2_STAKE } from 'const/const'
import { useWeb3React } from '@web3-react/core'

const Staking: FC = () => {
  const [tabIndex, setTabIndex] = useState<1 | 2>(1)
  const { account, chainId = 56 } = useWeb3React()

  const onChangeTab = (tIndex: 1 | 2) => {
    setTabIndex(tIndex)
  }

  const tokenInfo = useMemo(() => {
    return tabIndex == 1 ? TOKEN1_STAKE[chainId] : TOKEN2_STAKE[chainId]
  }, [tabIndex])

  return (
    <Layout>
      {/* <div className={styles.descriptionText}>
        <GiftSvg className={styles.giftIcon} />
        MOL is a multi-chain decentralized lottery and share all protocol fees with MOL holders!
      </div> */}
      {/* <br /> */}
      <div className={styles.tabWrapper}>
        <button
          onClick={() => onChangeTab(1)}
          className={cx(styles.sidebarOption, tabIndex === 1 && styles.active)}
          style={{
            marginRight: '20px',
          }}
        >
          Stake {TOKEN1_STAKE[chainId].SYMBOL}
        </button>
        <button onClick={() => onChangeTab(2)} className={cx(styles.sidebarOption, tabIndex === 2 && styles.active)}>
          Stake {TOKEN2_STAKE[chainId].SYMBOL}
        </button>
      </div>
      {/* <br />
      <div className={styles.headerText}>Stake {tokenInfo.SYMBOL} Token</div>
      <br /> */}
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
