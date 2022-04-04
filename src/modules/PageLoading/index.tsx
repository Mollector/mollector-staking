import React from 'react'
import styles from './styles.module.scss'

const PageLoading: React.FC = () => {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingWrap}>
        <div className={styles.loadingImg}></div>
        <span>loading...</span>
      </div>
    </div>
  )
}

export default PageLoading
