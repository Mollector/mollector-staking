import React, { ChangeEvent, FC } from 'react'
import cx from 'classnames'
import styles from './styles.module.scss'

interface InputProps {
  value: string
  isDisableMinMax: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onHandleChangeToMin: () => void
  onHandleChangeToMax: () => void
}

const Input: FC<InputProps> = ({ value, onChange, onHandleChangeToMin, onHandleChangeToMax, isDisableMinMax }) => {
  return (
    <div className={styles.inputContainer}>
      <div
        style={{
          width: '100%',
        }}
      >
        <div className={styles.inputInfo}>
          <button className={styles.maxBtn} onClick={onHandleChangeToMin} disabled={isDisableMinMax}>
            Min
          </button>
          <input placeholder='Enter amount' className={cx(styles.input, { [styles.empty]: `${value}` })} value={value} onChange={onChange} />
          {/* <div className={cx({ [styles.blur]: !value })}>{value || 0}</div> */}
          <button className={styles.maxBtn} onClick={onHandleChangeToMax} disabled={isDisableMinMax}>Max</button>
        </div>
      </div>
    </div>
  )
}

export default Input
