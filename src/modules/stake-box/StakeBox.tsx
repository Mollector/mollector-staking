import React from 'react'
import classNames from 'classnames'
import styles from './StakeBox.module.scss'

export const StakeBox = () => {
  return (
    <div className={styles.wrappBox}>
      <div className={styles.box}>
        <div className={styles.contentBox}>
          <p className={styles.title}>Your Stake</p>
          <p className={styles.valueToken}>5,000MOL</p>
          <p className={styles.total}>Total: 5,000MOL</p>
          <div className={styles.inputSection}>
            <input type="text" className={styles.input} />
            <button className={styles.button}>Claim</button>
          </div>
        </div>
      </div>
    </div>
  )
}
