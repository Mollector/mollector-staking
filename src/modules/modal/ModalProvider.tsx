import React, { createContext, ReactNode, useState, useEffect, HTMLAttributes, FC } from 'react'
import { CSSTransition } from 'react-transition-group'
import cx from 'classnames'
import styles from './styles.module.scss'

interface OverlayProps extends HTMLAttributes<HTMLDivElement> {}
interface ModalsContext {
  onPresent: (node: React.ReactNode, key?: string) => void
  onDismiss: () => void
}

export const ModalContext = createContext<ModalsContext>({
  onPresent: () => {},
  onDismiss: () => {},
})

const BodyLock = () => {
  useEffect(() => {
    document.body.style.cssText = `
      overflow: hidden;
    `;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.cssText = `
        overflow: visible;
        overflow: overlay;
      `;
    };
  }, []);

  return null;
};

const Overlay: FC<OverlayProps> = ({
  onClick
}) => {
  return <div onClick={onClick}>
    <BodyLock />
    <div className={styles.overlay} />
  </div>
}

const ModalProvider: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [modalElement, setModalElement] = useState<ReactNode>()

  const handlePresent = (node: ReactNode) => {
    document.body.style.overflow = 'hidden'
    setModalElement(node)
    setIsOpen(true)
  }

  const handleClose = () => {
    setModalElement(undefined)
    setIsOpen(false)
    document.body.style.overflow = 'unset'
  }

  return (
    <ModalContext.Provider
      value={{
        onPresent: handlePresent,
        onDismiss: handleClose,
      }}
    >
      <div className={cx(styles.wrapper)}>
          {isOpen && <Overlay onClick={handleClose} />}
          <div className={cx(styles.modalTransition, isOpen && styles.show)}>
          {React.isValidElement(modalElement) &&
            React.cloneElement(modalElement, {
              onDismiss: handleClose,
            })}
          </div>
        </div>

      {children}
    </ModalContext.Provider>
  )
}

export default ModalProvider
