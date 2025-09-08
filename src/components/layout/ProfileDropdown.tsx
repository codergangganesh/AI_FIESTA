'use client'

import { useState, useRef, useEffect } from 'react'
import { User, Settings, LogOut, Trash2, ChevronUp, Moon, Sun, DollarSign, Activity, Crown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import AccountSettingsModal from './AccountSettingsModal'
import DeleteAccountModal from './DeleteAccountModal'

interface ProfileDropdownProps {
  darkMode?: boolean
  onToggleDarkMode?: () => void
}

export default function ProfileDropdown({ darkMode = false, onToggleDarkMode }: ProfileDropdownProps) {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showAccountSettings, setShowAccountSettings] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
    router.push('/')
  }

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsHovered(true)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    timeoutRef.current = setTimeout(() => {
      if (!isHovered) {
        setIsOpen(false)
      }
    }, 150)
  }

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsHovered(true)
  }

  const handleDropdownMouseLeave = () => {
    setIsHovered(false)
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }

  const handleAccountSettings = () => {
    setIsOpen(false)
    router.push('/account-settings')
  }

  const handlePricing = () => {
    setIsOpen(false)
    router.push('/pricing')
  }

  const handleUsage = () => {
    setIsOpen(false)
    router.push('/usage')
  }

  const handleDeleteAccount = () => {
    setIsOpen(false)
    router.push('/delete-account')
  }

  const getUserInitials = () => {
    if (!user?.email) return 'U'
    return user.email.charAt(0).toUpperCase()
  }

  const getUserDisplayName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  }

  if (!user) return null

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Profile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200 hover:shadow-md group ${
            darkMode 
              ? 'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700' 
              : 'bg-white/80 hover:bg-white/90 border border-slate-200/50'
          }`}
        >
          {/* Profile Avatar */}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm ${
            darkMode 
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' 
              : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
          }`}>
            {getUserInitials()}
          </div>
          
          {/* User Info */}
          <div className="hidden sm:block text-left">
            <p className={`text-sm font-medium truncate max-w-24 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {getUserDisplayName()}
            </p>
            <p className={`text-xs truncate max-w-24 ${
              darkMode ? 'text-gray-400' : 'text-slate-500'
            }`}>
              {user.email}
            </p>
          </div>
          
          <ChevronUp className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${darkMode ? 'text-gray-400' : 'text-slate-400'}`} />
        </button>

        {/* Dropdown Menu - Positioned Above */}
        {isOpen && (
          <div 
            className={`absolute right-0 bottom-full mb-2 w-72 rounded-2xl shadow-2xl border backdrop-blur-xl z-50 overflow-hidden transition-all duration-200 ${
              darkMode 
                ? 'bg-gray-800/90 border-gray-700' 
                : 'bg-white/90 border-slate-200/50'
            }`}
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            {/* User Info Header */}
            <div className={`p-4 border-b ${
              darkMode ? 'border-gray-700' : 'border-slate-200/50'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {getUserInitials()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold truncate ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {getUserDisplayName()}
                  </h3>
                  <p className={`text-sm truncate ${
                    darkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    {user.email}
                  </p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    darkMode 
                      ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 text-blue-400 border border-blue-700/30' 
                      : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200'
                  }`}>
                    <Crown className="w-3 h-3 mr-1" />
                    Pro Plan
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => {
                  onToggleDarkMode?.()
                  setIsOpen(false)
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                  darkMode 
                    ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                    : 'hover:bg-slate-100/50 text-slate-700 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {darkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                  <span className="font-medium">
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                  </span>
                </div>
                <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ${
                  darkMode ? 'bg-blue-600' : 'bg-slate-300'
                }`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    darkMode ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </div>
              </button>

              {/* Pricing */}
              <button
                onClick={handlePricing}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  darkMode 
                    ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                    : 'hover:bg-slate-100/50 text-slate-700 hover:text-slate-900'
                }`}
              >
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">Pricing</span>
              </button>

              {/* Usage */}
              <button
                onClick={handleUsage}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  darkMode 
                    ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                    : 'hover:bg-slate-100/50 text-slate-700 hover:text-slate-900'
                }`}
              >
                <Activity className="w-5 h-5" />
                <span className="font-medium">Usage</span>
              </button>

              {/* Account Settings */}
              <button
                onClick={handleAccountSettings}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  darkMode 
                    ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                    : 'hover:bg-slate-100/50 text-slate-700 hover:text-slate-900'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Account Settings</span>
              </button>

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  darkMode 
                    ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                    : 'hover:bg-slate-100/50 text-slate-700 hover:text-slate-900'
                }`}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>

              {/* Delete Account */}
              <button
                onClick={handleDeleteAccount}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  darkMode 
                    ? 'hover:bg-red-900/20 text-red-400 hover:text-red-300' 
                    : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                }`}
              >
                <Trash2 className="w-5 h-5" />
                <span className="font-medium">Delete Account</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Account Settings Modal */}
      <AccountSettingsModal
        isOpen={showAccountSettings}
        onClose={() => setShowAccountSettings(false)}
        darkMode={darkMode}
      />

      {/* Delete Account Confirmation Modal */}
      <DeleteAccountModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          setShowDeleteConfirm(false)
          // Handle account deletion
          console.log('Account deletion confirmed')
        }}
        darkMode={darkMode}
      />
    </>
  )
}