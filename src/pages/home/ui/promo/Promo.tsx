import { FC, useMemo } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import styles from './Promo.module.scss'
import { MaybeWithClassName } from 'helper/react/types'
import { GutterBox } from 'ui/gutter-box'
import { Heading1 } from 'ui/typography'
import { Header } from 'modules/header'
import { LoginModal, useModal } from 'modules/modal'
import { Layout } from 'layout'
import { VESTING_CONTRACT_ADDRESS } from 'const/const'
type PromoType = {}

export const Promo: FC<PromoType & MaybeWithClassName> = ({ className }) => {
  const { chainId, account } = useWeb3React()
  const history = useHistory()
  const [onPresentLoginModal] = useModal(<LoginModal />)
  const VESTING_CONTRACT_ADDRESSES = VESTING_CONTRACT_ADDRESS[Number(chainId) || 56]

  const isLoggedIn = useMemo(() => {
    return !!account
  }, [account])

  const onNavigateTo = (path: string): void => {
    if (isLoggedIn) {
      history.push(path)
      return
    }

    onPresentLoginModal()
  }

  return (
    <section>
      <Layout>
        <GutterBox className={styles.wrapper}>
          <Heading1 className={styles.title}>
            Explore and Conquer <br />
            the Mollector World
          </Heading1>
          {Object.keys(VESTING_CONTRACT_ADDRESSES).map((type) => {
            return (
              <button className={styles.button} onClick={() => onNavigateTo(`/vesting/${VESTING_CONTRACT_ADDRESSES[type]}`)}>{type} POOL | CLAIM YOUR TOKEN</button>
            )
          })}
          <button className={styles.button} onClick={() => onNavigateTo('/staking')}>STAKE YOUR TOKEN</button>
        </GutterBox>
      </Layout>
    </section>
  )
}
