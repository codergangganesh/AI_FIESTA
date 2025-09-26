'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'

export default function PaymentMessage() {
  const { darkMode } = useDarkMode()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  const paymentStatus = searchParams.get('payment')
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (paymentStatus) {
      setIsVisible(true)
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
        // Remove payment params from URL
        const newUrl = new URL(window.location.href)
        newUrl.searchParams.delete('payment')
        newUrl.searchParams.delete('session_id')
        router.replace(newUrl.pathname + newUrl.search)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [paymentStatus, router])

  if (!isVisible || !paymentStatus) return null

  const getMessageConfig = () => {
    switch (paymentStatus) {
      case 'success':
        return {
          icon: <CheckCircle className="w-8 h-8 text-green-500" />,
          title: 'Payment Successful!',
          message: 'Your subscription has been activated. You now have access to all premium features.',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          textColor: 'text-green-800 dark:text-green-200',
        }
      case 'cancelled':
        return {
          icon: <XCircle className="w-8 h-8 text-red-500" />,
          title: 'Payment Cancelled',
          message: 'Your payment was cancelled. You can try again anytime.',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-800 dark:text-red-200',
        }
      default:
        return {
          icon: <AlertCircle className="w-8 h-8 text-yellow-500" />,
          title: 'Payment Status Unknown',
          message: 'We received your payment but the status is unclear. Please contact support.',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          textColor: 'text-yellow-800 dark:text-yellow-200',
        }
    }
  }

  const config = getMessageConfig()

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className={`p-4 rounded-xl border shadow-lg backdrop-blur-md ${config.bgColor} ${config.borderColor}`}>
        <div className="flex items-start space-x-3">
          {config.icon}
          <div className="flex-1">
            <h3 className={`font-semibold ${config.textColor}`}>
              {config.title}
            </h3>
            <p className={`text-sm mt-1 ${config.textColor}`}>
              {config.message}
            </p>
            {sessionId && (
              <p className={`text-xs mt-2 opacity-75 ${config.textColor}`}>
                Session ID: {sessionId.slice(0, 8)}...
              </p>
            )}
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className={`p-1 rounded-lg transition-colors ${config.textColor} hover:bg-black/10`}
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
