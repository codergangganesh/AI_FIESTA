'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePopup } from '@/contexts/PopupContext'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import { useDarkMode } from '@/contexts/DarkModeContext'

export default function ModernPaymentPage() {
  const { darkMode } = useDarkMode()
  const { openPaymentPopup } = usePopup()
  const router = useRouter()

  useEffect(() => {
    // When this page is accessed directly, open the popup
    openPaymentPopup()
    // Remove the automatic redirect back that was causing the cancel popup to appear
    // router.back()
  }, [openPaymentPopup])

  // This page content is now handled by the popup, so we just show a minimal layout
  return (
    <div className="flex h-screen">
      <AdvancedSidebar />
      <div className={`flex-1 transition-colors duration-200 overflow-auto ${
        darkMode ? 'bg-gray-900' : 'bg-slate-50'
      }`}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
              Loading payment options...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}