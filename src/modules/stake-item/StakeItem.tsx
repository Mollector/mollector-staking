import React from 'react'
import classNames from 'classnames'
import styles from './StakeItem.module.scss'
import LpdiIcon from 'assets/img/lpdi.png'

export const StakeItem = () => {
  return (
    <div className={styles.wrappBox}>
      <div className={styles.box}>
        <div className={styles.contentBox}>
          <div style={{width: '10%'}}>
              <p className={styles.colHeader}>#</p>
              <p className={styles.cellContent}>1</p>
          </div>
          <div style={{width: '15%'}}>
              <img src={LpdiIcon} alt=''/>
          </div>
          <div style={{width: '20%'}}>
              <p className={styles.colHeader}>Asset</p>
              <p className={styles.cellContent}>BDS-KUSD-T</p>
          </div>
          <div style={{width: '20%'}}>
              <p className={styles.colHeader}>Vault Assets</p>
              <p className={styles.cellContent}>$108.612</p>
          </div>
          <div style={{width: '20%'}}>
              <p className={styles.colHeader}>Net APY</p>
              <p className={styles.cellContent}>3,686,607%</p>
          </div>
          <div style={{width: '15%'}} className={styles.wrappStakeBtn}>
              <span className={styles.stakeBtn}>STAKE</span>
          </div>
        </div>
      </div>
    </div>
  )
}
