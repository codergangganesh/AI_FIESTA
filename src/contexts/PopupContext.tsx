'use client'

import { createContext, useContext, ReactNode, useState } from 'react'

interface PopupContextType {
  isPaymentPopupOpen: boolean
  openPaymentPopup: () => void
  closePaymentPopup: () => void
}

const PopupContext = createContext<PopupContextType | undefined>(undefined)

export function PopupProvider({ children }: { children: ReactNode }) {
  const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false)

  const openPaymentPopup = () => {
    console.log('Opening payment popup')
    setIsPaymentPopupOpen(true)
  }

  const closePaymentPopup = () => {
    console.log('Closing payment popup')
    setIsPaymentPopupOpen(false)
  }

  return (
    <PopupContext.Provider
      value={{
        isPaymentPopupOpen,
        openPaymentPopup,
        closePaymentPopup
      }}
    >
      {children}
    </PopupContext.Provider>
  )
}

export function usePopup() {
  const context = useContext(PopupContext)
  if (context === undefined) {
    throw new Error('usePopup must be used within a PopupProvider')
  }
  return context
}