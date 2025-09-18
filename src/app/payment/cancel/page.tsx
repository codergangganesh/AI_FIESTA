'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useToast } from '@/contexts/NotificationContext'
import { usePopup } from '@/contexts/PopupContext'
import Navigation from '@/components/Navigation'
import PaymentCancelPopup from '@/components/payment/PaymentCancelPopup'

export default function PaymentCancelPage() {
  const { darkMode } = useDarkMode()
  const { error } = useToast()
  const { openPaymentPopup } = usePopup()
  const router = useRouter()

  // Show toast notification
  useEffect(() => {
    error('Payment Cancelled', 'Your payment was cancelled. No charges were made to your account.')
  }, [])

  const handleRetry = () => {
    // Instead of direct navigation, open the payment popup
    openPaymentPopup()
  }

  const handleGoHome = () => {
    router.push('/') // Redirect to landing page directly
  }

  const handleContactSupport = () => {
    router.push('/contact')
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>
      {/* Header with Navigation */}
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Show the popup directly on this page */}
        <PaymentCancelPopup
          isOpen={true}
          onClose={() => router.push('/')}
          onRetry={handleRetry}
          onGoHome={handleGoHome}
          onContactSupport={handleContactSupport}
        />
      </div>
    </div>
  )
}