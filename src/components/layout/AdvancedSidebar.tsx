'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import NotificationBell from '@/components/ui/NotificationBell'
import {
  Home,
  GitCompare,
  DollarSign,
  Activity,
  User,
  ChevronLeft,
  ChevronRight,
  Brain,
  Zap,
  Mail,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { useApiUsage } from '@/hooks/useApiUsage'

interface NavigationItem {
  id: string
  label: string
  icon: any
  href: string
  description: string
}

interface AdvancedSidebarProps {
  className?: string
}

export default function AdvancedSidebar({ className = '' }: AdvancedSidebarProps) {
  const { darkMode } = useDarkMode()
  const { user } = useAuth() // Get user from AuthContext
  const router = useRouter()
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const { apiUsage, loading } = useApiUsage()
  
  // Add error state for API usage
  const [apiUsageError, setApiUsageError] = useState<string | null>(null)

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      href: '/dashboard',
      description: 'Overview & Analytics'
    },
    {
      id: 'comparison',
      label: 'Model Comparison',
      icon: GitCompare,
      href: '/chat',
      description: 'Compare AI Models'
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: Mail,
      href: '/contact',
      description: 'Get in Touch'
    },
    {
      id: 'feedback',
      label: 'Feedback',
      icon: Star,
      href: '/feedback',
      description: 'Share Your Thoughts'
    },
    {
      id: 'pricing',
      label: 'Pricing',
      icon: DollarSign,
      href: '/payment',
      description: 'Plans & Billing'
    },
    // Only show usage link if user is authenticated
    ...(user ? [{
      id: 'usage',
      label: 'Usage',
      icon: Activity,
      href: '/usage',
      description: 'API & Quota Stats'
    }] : []),
    {
      id: 'settings',
      label: 'Account Settings',
      icon: User,
      href: '/account-settings',
      description: 'Profile & Preferences'
    }
  ]

  // Enhanced mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setIsExpanded(false)
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth < 1024 && isExpanded) {
        const sidebar = document.getElementById('advanced-sidebar')
        if (sidebar && !sidebar.contains(event.target as Node)) {
          setIsExpanded(false)
        }
      }
    }

    window.addEventListener('resize', handleResize)
    document.addEventListener('mousedown', handleClickOutside)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded])

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsExpanded(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsExpanded(false)
      setHoveredItem(null)
    }
  }

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  const isActiveRoute = (href: string) => {
    if (href === '/chat' && (pathname === '/chat' || pathname === '/history')) {
      return true
    }
    if (href === '/payment' && (pathname === '/payment' || pathname === '/pricing')) {
      return true
    }
    return pathname === href
  }

  return (
    <>
    <div
      id="advanced-sidebar"
      className={`${className} fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-72' : 'w-16'
      } ${isMobile && !isExpanded ? 'transform -translate-x-full lg:translate-x-0' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Sidebar Container */}
      <div
        className={`h-full backdrop-blur-xl border-r transition-all duration-300 ${
          darkMode
            ? 'bg-gray-900/95 border-gray-700/50'
            : 'bg-white/95 border-slate-200/50'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-current border-opacity-10">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div
                className={`transition-all duration-300 ${
                  isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                }`}
              >
                <h1
                  className={`text-lg font-bold whitespace-nowrap ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  AI Fiesta
                </h1>
                <p
                  className={`text-xs whitespace-nowrap ${
                    darkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}
                >
                  Advanced AI Platform
                </p>
              </div>
            </div>

            {/* Notification Bell and Toggle */}
            <div className="flex items-center space-x-2">
              <NotificationBell />
              
              {/* Toggle Button */}
              <button
                onClick={toggleSidebar}
                className={`p-1.5 rounded-lg transition-all duration-200 lg:hidden ${
                  darkMode
                    ? 'hover:bg-gray-700/50 text-gray-400 hover:text-white'
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'
                }`}
              >
                {isExpanded ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-2 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = isActiveRoute(item.href)

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`group relative flex items-center px-3 py-3 rounded-xl transition-all duration-200 ease-in-out transform ${
                  isActive
                    ? darkMode
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-blue-600 text-white shadow-lg'
                    : darkMode
                    ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white hover:scale-[1.02] hover:shadow-md'
                    : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900 hover:scale-[1.02] hover:shadow-md'
                }`}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  <Icon
                    className={`w-5 h-5 transition-all duration-300 ease-in-out ${
                      hoveredItem === item.id ? 'scale-125 text-blue-400' : ''
                    } ${isActive ? 'text-white' : ''}`}
                  />
                </div>

                {/* Label and Description */}
                <div
                  className={`ml-3 overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                  }`}
                >
                  <div className="whitespace-nowrap">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p
                      className={`text-xs transition-colors duration-200 ${
                        isActive
                          ? 'text-blue-100'
                          : darkMode
                          ? 'text-gray-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Tooltip for collapsed mode */}
                {!isExpanded && (
                  <div
                    className={`absolute left-full ml-2 px-3 py-2 rounded-lg shadow-lg border pointer-events-none transition-all duration-200 z-50 transform ${
                      hoveredItem === item.id
                        ? 'opacity-100 translate-x-0 scale-100'
                        : 'opacity-0 -translate-x-2 scale-95'
                    } ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="whitespace-nowrap">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p
                        className={`text-xs ${
                          darkMode ? 'text-gray-400' : 'text-slate-500'
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-2 w-2 h-2 bg-white rounded-full shadow-sm" />
                )}
              </Link>
            )
          })}
        </nav>
       
      </div>

      </div>
      
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-50 p-3 rounded-xl shadow-lg transition-all duration-200 lg:hidden ${
          darkMode
            ? 'bg-gray-800 border border-gray-700 text-white'
            : 'bg-white border border-slate-200 text-slate-900'
        } ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Overlay for mobile */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  )
}