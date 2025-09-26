'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronUp, 
  Moon, 
  Sun, 
  DollarSign, 
  Activity, 
  Crown, 
  Trash2,
  MessageSquare,
  Send,
  BarChart3,
  Phone,
  Plus
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { usePopup } from '@/contexts/PopupContext'
import { useRouter } from 'next/navigation'
import { MD5 } from 'crypto-js'
import { createClient } from '@/utils/supabase/client'

interface ProfileDropdownProps {
  darkMode?: boolean
  onToggleDarkMode?: () => void
  onDeleteAccount?: () => void
  onNewConversation?: () => void // Add this new prop
}

export default function ProfileDropdown({ 
  darkMode = false, 
  onToggleDarkMode, 
  onDeleteAccount,
  onNewConversation // Add this new prop
}: ProfileDropdownProps) {
  const { user, signOut, deleteAccount } = useAuth() // Now properly typed
  const { openPaymentPopup } = usePopup()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null) // Add this ref for timeout

  // Function to generate Gravatar URL
  const getGravatarUrl = (email: string) => {
    if (!email) return null
    const hash = MD5(email.toLowerCase().trim()).toString()
    return `https://www.gravatar.com/avatar/${hash}?d=mp&s=200`
  }

  // Fetch profile picture from user_settings table
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!user) return
      
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('user_settings')
          .select('profile_picture_url')
          .eq('user_id', user.id)
          .limit(1)
        
        if (error) {
          console.error('Error fetching profile picture:', error.message)
          // Fallback to avatar_url in user metadata if available
          if (user?.user_metadata?.avatar_url) {
            setProfilePicture(user.user_metadata.avatar_url)
            return
          }
          // Fallback to Gravatar if no avatar_url in metadata
          if (user?.email) {
            setProfilePicture(getGravatarUrl(user.email))
          }
          return
        }
        
        // Check if we have data and use the first item
        if (data && data.length > 0 && data[0].profile_picture_url) {
          setProfilePicture(data[0].profile_picture_url)
        } else if (user?.user_metadata?.avatar_url) {
          // Fallback to avatar_url in user metadata
          setProfilePicture(user.user_metadata.avatar_url)
        } else if (user?.email) {
          // Fallback to Gravatar if no profile picture set
          setProfilePicture(getGravatarUrl(user.email))
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error)
        // Fallback to avatar_url in user metadata if available
        if (user?.user_metadata?.avatar_url) {
          setProfilePicture(user.user_metadata.avatar_url)
        } else if (user?.email) {
          // Fallback to Gravatar if no avatar_url in metadata
          setProfilePicture(getGravatarUrl(user.email))
        }
      }
    }
    
    fetchProfilePicture()
  }, [user])

  const getProfilePicture = () => {
    return profilePicture
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // Clear any existing timeout before closing
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current)
        }
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      // Clear timeout on unmount
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect()
      const dropdownHeight = 400 // Updated height for new dropdown content
      const spaceBelow = window.innerHeight - dropdownRect.bottom
      const spaceAbove = dropdownRect.top
      
      // Position dropdown above if not enough space below and there's more space above
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setPosition('top')
      } else {
        setPosition('bottom')
      }
    }
  }, [isOpen])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error during sign out:', error)
    } finally {
      // Clear any existing timeout before closing
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
      setIsOpen(false)
      // Redirect to auth page after sign out
      router.push('/auth')
    }
  }

  const handleMouseEnter = () => {
    // Clear any existing timeout when mouse enters
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    // Set a timeout to close the dropdown after 2 seconds
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 2000) // 2 seconds delay
  }

  const handleDropdownMouseEnter = () => {
    // Clear any existing timeout when mouse enters the dropdown
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
    setIsOpen(true)
  }

  const handleDropdownMouseLeave = () => {
    // Set a timeout to close the dropdown after 2 seconds
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 2000) // 2 seconds delay
  }

  const handleAccountSettings = () => {
    // Clear any existing timeout before closing
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
    setIsOpen(false)
    router.push('/settings')
  }

  const handleDeleteAccount = () => {
    // Clear any existing timeout before closing
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
    setIsOpen(false)
    onDeleteAccount?.()
  }

  const handlePricing = () => {
    // Clear any existing timeout before closing
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
    setIsOpen(false)
    openPaymentPopup()
  }

  const handleUsage = () => {
    // Clear any existing timeout before closing
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
    setIsOpen(false)
    router.push('/usage')
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
          onClick={() => {
            // Clear any existing timeout when clicking
            if (closeTimeoutRef.current) {
              clearTimeout(closeTimeoutRef.current)
            }
            setIsOpen(!isOpen)
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200 hover:shadow-md group ${
            darkMode 
              ? 'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700' 
              : 'bg-white/80 hover:bg-white/90 border border-slate-200/50'
          }`}
        >
          {/* Profile Avatar */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
            darkMode 
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' 
              : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
          }`}>
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              getUserInitials()
            )}
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

        {/* Dropdown Menu - Dynamically positioned */}
        {isOpen && (
          <div 
            className={`absolute right-0 w-72 rounded-2xl shadow-2xl border backdrop-blur-xl z-50 overflow-hidden transition-all duration-200 ${
              darkMode 
                ? 'bg-gray-800/95 border-gray-700 text-gray-100 shadow-gray-900/20' 
                : 'bg-white/95 border-slate-200/50 text-slate-900 shadow-black/10'
            }`}
            style={position === 'top' ? { bottom: '100%', marginBottom: '0.5rem' } : { top: '100%', marginTop: '0.5rem' }}
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            {/* User Info Header */}
            <div className={`p-5 border-b ${
              darkMode ? 'border-gray-700' : 'border-slate-200/50'
            }`}>
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg ${
                  darkMode ? 'bg-opacity-90' : 'bg-opacity-100'
                }`}>
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    getUserInitials()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold truncate text-base ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {getUserDisplayName()}
                  </h3>
                  <p className={`text-sm truncate ${
                    darkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    {user.email}
                  </p>
                  <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold mt-2 ${
                    darkMode 
                      ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 text-blue-400 border border-blue-700/30' 
                      : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200'
                  }`}>
                    <Crown className="w-3 h-3 mr-1" />
                    Free
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {/* Compare */}
              <button
                onClick={() => {
                  // Clear any existing timeout before closing
                  if (closeTimeoutRef.current) {
                    clearTimeout(closeTimeoutRef.current)
                  }
                  setIsOpen(false)
                  router.push('/compare')
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  darkMode 
                    ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                    : 'hover:bg-slate-100/50 text-slate-700 hover:text-slate-900'
                }`}>
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">Compare</span>
              </button>
              
              
              
              {/* Pricing */}
              <button
                onClick={() => {
                  // Clear any existing timeout before closing
                  if (closeTimeoutRef.current) {
                    clearTimeout(closeTimeoutRef.current)
                  }
                  setIsOpen(false)
                  openPaymentPopup()
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  darkMode 
                    ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                    : 'hover:bg-slate-100/50 text-slate-700 hover:text-slate-900'
                }`}>
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">Pricing</span>
              </button>
              
              {/* Dashboard */}
              <button
                onClick={() => {
                  // Clear any existing timeout before closing
                  if (closeTimeoutRef.current) {
                    clearTimeout(closeTimeoutRef.current)
                  }
                  setIsOpen(false)
                  router.push('/dashboard')
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  darkMode 
                    ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                    : 'hover:bg-slate-100/50 text-slate-700 hover:text-slate-900'
                }`}>
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </button>
              
              {/* Usage */}
              <button
                onClick={() => {
                  // Clear any existing timeout before closing
                  if (closeTimeoutRef.current) {
                    clearTimeout(closeTimeoutRef.current)
                  }
                  setIsOpen(false)
                  router.push('/usage')
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  darkMode 
                    ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                    : 'hover:bg-slate-100/50 text-slate-700 hover:text-slate-900'
                }`}>
                <Activity className="w-5 h-5" />
                <span className="font-medium">Usage</span>
              </button>
              
              

              {/* Dark Mode Toggle */}
              <button
                onClick={() => {
                  onToggleDarkMode?.()
                  // Clear any existing timeout before closing
                  if (closeTimeoutRef.current) {
                    clearTimeout(closeTimeoutRef.current)
                  }
                  setIsOpen(false)
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                  darkMode 
                    ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                    : 'hover:bg-slate-100/50 text-slate-700 hover:text-slate-900'
                }`}>
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

              {/* Account Settings */}
              <button
                onClick={handleAccountSettings}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  darkMode 
                    ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                    : 'hover:bg-slate-100/50 text-slate-700 hover:text-slate-900'
                }`}>
                <Settings className="w-5 h-5" />
                <span className="font-medium">Account Settings</span>
              </button>

              {/* Delete Account */}
              <button
                onClick={handleDeleteAccount}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  darkMode 
                    ? 'hover:bg-gray-700/50 text-red-400 hover:text-red-300' 
                    : 'hover:bg-slate-100/50 text-red-600 hover:text-red-700'
                }`}>
                <Trash2 className="w-5 h-5" />
                <span className="font-medium">Delete Account</span>
              </button>

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  darkMode 
                    ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                    : 'hover:bg-slate-100/50 text-slate-700 hover:text-slate-900'
                }`}>
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}