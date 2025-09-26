'use client';

import { createContext, useContext, useState } from 'react';
import PaymentPopup from '@/components/payment/PaymentPopup';

interface PopupContextValue {
  openPaymentPopup: () => void;
}

const PopupContext = createContext<PopupContextValue | undefined>(undefined);

export function PopupProvider({ children }: { children: React.ReactNode }) {
  const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);

  const openPaymentPopup = () => {
    setIsPaymentPopupOpen(true);
  };

  return (
    <PopupContext.Provider value={{ openPaymentPopup }}>
      {children}
      <PaymentPopup 
        isOpen={isPaymentPopupOpen} 
        onClose={() => setIsPaymentPopupOpen(false)} 
      />
    </PopupContext.Provider>
  );
}

export function usePopup() {
  const ctx = useContext(PopupContext);
  if (!ctx) throw new Error('usePopup must be used within PopupProvider');
  return ctx;
}


