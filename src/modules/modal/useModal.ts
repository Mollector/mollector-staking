import React, { useContext, useCallback, ReactNode } from 'react'
import { ModalContext } from './ModalProvider'

const useModal = (modal: ReactNode) => {
  const { onPresent, onDismiss } = useContext(ModalContext)

  const onPresentCallBack = useCallback(() => {
    onPresent(modal)
  }, [modal])

  return [onPresentCallBack, onDismiss]
}

export default useModal
