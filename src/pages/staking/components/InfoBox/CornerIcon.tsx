import React from 'react'
import styles from '../styles.module.scss'
import cx from 'classnames'
import { useState } from 'react'
import GiftIcon from 'assets/img/gift.png'

const CornerIcon = () => {
    const [isOpenInfo, setIsOpenInfo] = useState(false)

    const onOpenInfo = () => {
        setIsOpenInfo(true)
    }

    const onCloseInfo = () => {
        setIsOpenInfo(false)
    }
    return <>
        <div className={styles.cornerIcon} onMouseOver={onOpenInfo} onMouseLeave={onCloseInfo}/>
        {
            isOpenInfo && <div className={styles.additionBoxInfo}>
                <img className={styles.imgGift} src={GiftIcon} alt="" />
                <span className={styles.giftTextInfo}>est. 16 BUSD</span>
            </div>
        }
    </>
}

export default CornerIcon