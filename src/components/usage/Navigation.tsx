'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { usePopup } from '@/contexts/PopupContext'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  MessageSquare, 
  BarChart3, 
  Mail, 
  Brain,
  Menu,
  X,
  DollarSign,
  MessageCircle
} from 'lucide-react'
import ProfileDropdown from './layout/ProfileDropdown'

export default function Navigation() {
  const { user } = useAuth()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const { openPaymentPopup } = usePopup()
  const router = useRouter()
  const pathname = usePathname()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowMobileMenu(false)
    }

    if (showMobileMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showMobileMenu])

  // Check if we're on the payment cancel page
  const isCancelPage = pathname === '/payment/cancel'

  if (!user) return null

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/dashboard', description: 'View analytics and insights' },
    // We'll handle Pricing separately to open the popup instead of navigating
  ]

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault()
    openPaymentPopup()
  }

  return (
    <nav className={`relative backdrop-blur-xl border-b shadow-sm sticky top-0 z-50 transition-colors duration-200 ${
      darkMode 
        ? 'bg-gray-900/90 border-gray-700' 
        : 'bg-white/90 border-slate-200/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <Link href="/chat" className={`text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent hover:from-blue-600 hover:to-purple-600 transition-all duration-300 ${
                darkMode 
                  ? 'from-white to-gray-200' 
                  : 'from-slate-900 to-slate-700'
              }`}>
                AI Fiesta
              </Link>
              <p className={`text-xs ${
                darkMode ? 'text-gray-400' : 'text-slate-500'
              }`}>
                Compare AI Models
              </p>
            </div>
          </div>

          {/* Center Navigation - Simplified for logged-in users */}
          {/* Hide chat link on cancel page */}
          {!isCancelPage && (
            <div className="hidden md:flex items-center space-x-1">
              <Link
                href="/chat"
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 group ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <MessageSquare className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span className="font-medium">New Chat</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMobileMenu(!showMobileMenu)
              }}
              className={`p-2 rounded-xl transition-all duration-200 ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop Profile Dropdown */}
          <div className="hidden md:block">
            <ProfileDropdown 
              darkMode={darkMode} 
              onToggleDarkMode={toggleDarkMode}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className={`md:hidden backdrop-blur-xl border-t transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-900/95 border-gray-700' 
            : 'bg-white/95 border-slate-200/50'
        }`}>
          <div className="px-4 py-4 space-y-2">
            {/* Hide chat link on cancel page */}
            {!isCancelPage && (
              <Link
                href="/chat"
                onClick={() => setShowMobileMenu(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">New Chat</span>
              </Link>
            )}
            
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    darkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
            
            {/* Pricing link that opens popup */}
            <button
              onClick={(e) => {
                e.preventDefault()
                setShowMobileMenu(false)
                openPaymentPopup()
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span className="font-medium">Pricing</span>
            </button>
            
            {/* Mobile Profile Dropdown */}
            <div className="pt-2 border-t border-gray-700">
              <ProfileDropdown 
                darkMode={darkMode} 
                onToggleDarkMode={toggleDarkMode}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop Pricing Link */}
      {!isCancelPage && (
        <div className="hidden md:flex justify-center py-3 border-t border-gray-700">
          <button
            onClick={handlePricingClick}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 group ${
              darkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <DollarSign className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span className="font-medium">Pricing</span>
          </button>
        </div>
      )}
    </nav>
  )
}