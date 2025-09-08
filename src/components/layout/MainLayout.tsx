'use client'

import { ReactNode, useState, useEffect } from 'react'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import { useDarkMode } from '@/contexts/DarkModeContext'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { darkMode } = useDarkMode()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <AdvancedSidebar />
      <div className={`transition-all duration-300 ${
        isMobile ? 'ml-0' : 'ml-16 lg:ml-72'
      }`}>
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          {children}
        </div>
      </div>
    </div>
  )
}