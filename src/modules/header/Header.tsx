import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import classNames from 'classnames'
import styles from './Header.module.scss'
import { MaybeWithClassName } from 'helper/react/types'
import LogoMenu from 'assets/img/menu.png'
import { LoginModal, useModal } from 'modules/modal'
import CountDown from 'pages/staking/components/Countdown'
import { STAKING_FINISH_AT } from 'const/const'

type HeaderType = {
  fixed?: boolean
  transparent?: boolean
}

export const Header: FC<HeaderType & MaybeWithClassName> = ({ className, fixed, transparent }) => {
  const { account } = useWeb3React()
  const [onPresentLoginModal] = useModal(<LoginModal />)
  
  return (
    <div style={{textAlign: 'center'}}>
      <img src={LogoMenu} alt="logo" style={{height: 60}} />
      <div style={{color: '#333333', fontSize: 24}}>
        {new Date().getTime() >= STAKING_FINISH_AT ? <b>MOL STAKING EVENT CLOSED</b>
          :<b style={{textTransform: 'uppercase'}}>STAKING EVENT CLOSES IN <CountDown finishAt={STAKING_FINISH_AT} /></b>
        }
        
      </div>
      <br/>
    </div>
    // <header className={classNames(styles.component, styles.fixed, className)}>
    //   <div className={classNames(styles.wrapper, transparent && styles.transparent)}>
    //     {/* {!account && <button className={styles.connectStyle} onClick={onPresentLoginModal}>Connect to wallet</button>}
    //     {account && <button className={styles.account}>{account.slice(0, 6)}...{account.slice(account.length - 5, account.length)}</button>} */}
    //   </div>
    // </header>
  )
}
