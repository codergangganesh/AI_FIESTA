'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronUp, Crown, User, Settings, LogOut, CreditCard, BarChart3, MessageSquare, Mail } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { usePopup } from '@/contexts/PopupContext'
import md5 from 'crypto-js/md5'

interface SimpleProfileIconProps {
  // darkMode prop is no longer needed as we're using the useDarkMode hook
}

export default function SimpleProfileIcon() {
  const { user, signOut } = useAuth()
  const { darkMode } = useDarkMode()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom')
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const { openPaymentPopup } = usePopup()
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const dropdownHeight = 400 // Updated height for new dropdown content
      const spaceBelow = window.innerHeight - buttonRect.bottom
      const spaceAbove = buttonRect.top
      
      // Position dropdown above if not enough space below and there's more space above
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setPosition('top')
      } else {
        setPosition('bottom')
      }
    }
  }, [isOpen])

  // Function to generate Gravatar URL
  const getGravatarUrl = (email: string) => {
    if (!email) return null;
    const hash = md5(email.toLowerCase().trim()).toString();
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
  }

  // Fetch profile picture from user_settings table
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!user) return;
      
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('user_settings')
          .select('profile_picture_url')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile picture:', error.message);
          // Fallback to avatar_url in user metadata if available
          if (user?.user_metadata?.avatar_url) {
            setProfilePicture(user.user_metadata.avatar_url);
            return;
          }
          // Fallback to Gravatar if no avatar_url in metadata
          if (user?.email) {
            setProfilePicture(getGravatarUrl(user.email));
          }
          return;
        }
        
        if (data?.profile_picture_url) {
          setProfilePicture(data.profile_picture_url);
        } else if (user?.user_metadata?.avatar_url) {
          // Fallback to avatar_url in user metadata
          setProfilePicture(user.user_metadata.avatar_url);
        } else if (user?.email) {
          // Fallback to Gravatar if no profile picture set
          setProfilePicture(getGravatarUrl(user.email));
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
        // Fallback to avatar_url in user metadata if available
        if (user?.user_metadata?.avatar_url) {
          setProfilePicture(user.user_metadata.avatar_url);
        } else if (user?.email) {
          // Fallback to Gravatar if no avatar_url in metadata
          setProfilePicture(getGravatarUrl(user.email));
        }
      }
    };
    
    fetchProfilePicture();
  }, [user]);

  // Ensure profile picture is always consistent with email
  useEffect(() => {
    if (user?.email) {
      // If we don't have a profile picture yet, or if we're using Gravatar,
      // update it when email changes
      if (!profilePicture || profilePicture.includes('gravatar.com')) {
        setProfilePicture(getGravatarUrl(user.email));
      }
    }
  }, [user?.email, profilePicture]);

  // Removed mouse enter/leave handlers to only use click functionality

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      // Use router for navigation instead of window.location
      router.push('/auth')
    }
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
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        // Removed onMouseEnter and onMouseLeave props
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
            <img 
              src={profilePicture} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover" 
              onError={(e) => {
                // Fallback to initials if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = getUserInitials();
              }}
            />
          ) : (
            getUserInitials()
          )}
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
          // Removed onMouseEnter and onMouseLeave props
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
                  <img 
                    src={profilePicture} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover" 
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = getUserInitials();
                    }}
                  />
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

          {/* Navigation Menu */}
          <div className="p-2">
            <Link
              href="/dashboard"
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                darkMode 
                  ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                  : 'hover:bg-slate-100/50 text-slate-700 hover:text-slate-900'
              }`}>
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
            
            <Link
              href="/chat"
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                darkMode 
                  ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                  : 'hover:bg-slate-100/50 text-slate-700 hover:text-slate-900'
              }`}>
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Chat</span>
            </Link>
            
            <Link
              href="/usage"
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                darkMode 
                  ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                  : 'hover:bg-slate-100/50 text-slate-700 hover:text-slate-900'
              }`}>
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Usage</span>
            </Link>
            
            <button
              onClick={openPaymentPopup}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                darkMode 
                  ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                  : 'hover:bg-slate-100/50 text-slate-700 hover:text-slate-900'
              }`}>
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Billing</span>
            </button>
            
            <Link
              href="/account-settings"
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                darkMode 
                  ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                  : 'hover:bg-slate-100/50 text-slate-700 hover:text-slate-900'
              }`}>
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </Link>
            
            <Link
              href="/contact"
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                darkMode 
                  ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                  : 'hover:bg-slate-100/50 text-slate-700 hover:text-slate-900'
              }`}>
              <Mail className="w-5 h-5" />
              <span className="font-medium">Contact</span>
            </Link>
          </div>
          

          {/* Sign Out Button */}
          <div className="p-3">
            <button
              onClick={handleSignOut}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                darkMode 
                  ? 'bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-700/30 hover:border-red-600/50' 
                  : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300'
              }`}>
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}