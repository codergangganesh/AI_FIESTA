'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useAuth } from '@/contexts/AuthContext'
import { usePlan } from '@/contexts/PlanContext'
import { useToast } from '@/contexts/NotificationContext'
import { usePopup } from '@/contexts/PopupContext'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import ModernPaymentSuccess from '@/components/payment/ModernPaymentSuccess'
import { 
  CheckCircle, 
  ArrowRight, 
  Home, 
  Settings, 
  BarChart3, 
  Crown,
  Loader2,
  Sparkles
} from 'lucide-react'

export default function PaymentSuccessPage() {
  const { darkMode } = useDarkMode()
  const { user } = useAuth()
  const { refreshPlan } = usePlan()
  const { success } = useToast()
  const { openPaymentPopup } = usePopup()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [sessionDetails, setSessionDetails] = useState<any>(null)

  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      if (!sessionId) {
        // Instead of redirecting to pricing, open the payment popup
        openPaymentPopup()
        return
      }

      try {
        // Verify the session and get details
        const response = await fetch(`/api/stripe/verify-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        })

        if (response.ok) {
          const data = await response.json()
          setSessionDetails(data)
          
          // Refresh user's plan information
          await refreshPlan()
          
          // Show success message
          success(
            'Payment Successful!',
            `Welcome to ${data.planType?.toUpperCase()}! Your subscription is now active.`
          )
        } else {
          console.error('Failed to verify session')
        }
      } catch (error) {
        console.error('Error verifying payment:', error)
      } finally {
        setIsLoading(false)
      }
    }

    handlePaymentSuccess()
  }, [sessionId, router, refreshPlan, success, openPaymentPopup])

  const quickActions = [
    {
      title: 'Start Comparing Models',
      description: 'Begin using your new features',
      icon: BarChart3,
      href: '/model-comparison',
      color: 'blue'
    },
    {
      title: 'Account Settings',
      description: 'Manage your subscription',
      icon: Settings,
      href: '/account-settings',
      color: 'gray'
    },
    {
      title: 'Dashboard',
      description: 'View your usage stats',
      icon: Home,
      href: '/dashboard',
      color: 'green'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <AdvancedSidebar />
        <div className={`flex-1 flex items-center justify-center transition-colors duration-200 ${
          darkMode ? 'bg-gray-900' : 'bg-slate-50'
        }`}>
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
              Verifying your payment...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <AdvancedSidebar />
      
      <div className={`flex-1 transition-colors duration-200 overflow-auto ${
        darkMode ? 'bg-gray-900' : 'bg-slate-50'
      }`}>
        <ModernPaymentSuccess 
          planType={sessionDetails?.planType}
          onNavigate={(href) => router.push(href)}
        />
      </div>
    </div>
  )
}