import React, { ReactNode } from 'react'
import cx from 'classnames'
import styles from './styles.module.scss'

interface ModalProps {
  children: ReactNode
}

const Modal: React.FC<ModalProps> = ({ children, ...props }) => (
  <div className={styles.modalContainer}>
    <div>{children}</div>
  </div>
)

export default Modal
