'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Brain, 
  Bell, 
  Moon, 
  Sun, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  LayoutDashboard,
  BarChart3,
  Cpu,
  History,
  Search,
  Plus,
  Star,
  FileText,
  MessageSquare,
  Clock
} from 'lucide-react'

interface HeaderProps {
  darkMode: boolean
  toggleDarkMode: () => void
}

export default function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  const { user, signOut } = useAuth()
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [notifications] = useState([
    { id: 1, title: 'Model comparison completed', type: 'success', time: '2 min ago' },
    { id: 2, title: 'New models available', type: 'info', time: '1 hour ago' },
    { id: 3, title: 'Export ready for download', type: 'success', time: '3 hours ago' }
  ])

  const navigationDropdowns = {
    Compare: [
      { name: 'New Comparison', href: '/chat', icon: Plus },
      { name: 'Saved Comparisons', href: '/saved', icon: Star },
      { name: 'Templates', href: '/templates', icon: FileText }
    ],
    Models: [
      { name: 'Manage Models', href: '/models', icon: Settings },
      { name: 'Add Models', href: '/models/add', icon: Plus },
      { name: 'Model Stats', href: '/models/stats', icon: BarChart3 }
    ],
    History: [
      { name: 'All Chats', href: '/history', icon: MessageSquare },
      { name: 'Recent Comparisons', href: '/history/recent', icon: Clock },
      { name: 'Bookmarked', href: '/history/bookmarked', icon: Star }
    ]
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error during sign out:', error)
    } finally {
      setShowProfileDropdown(false)
    }
  }

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-200 ${
      darkMode 
        ? 'bg-gray-900/95 backdrop-blur-xl border-gray-800' 
        : 'bg-white/95 backdrop-blur-xl border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + App Name */}
          <Link href="/chat" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                AI Fiesta
              </h1>
            </div>
          </Link>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center space-x-1 relative">
            {/* Dashboard */}
            <Link
              href="/dashboard"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 group ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="font-medium">Dashboard</span>
            </Link>
            
            {/* Dropdown Items */}
            {Object.entries(navigationDropdowns).map(([category, items]) => (
              <div key={category} className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === category ? null : category)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 group ${
                    darkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {category === 'Compare' && <BarChart3 className="w-4 h-4" />}
                  {category === 'Models' && <Cpu className="w-4 h-4" />}
                  {category === 'History' && <History className="w-4 h-4" />}
                  <span className="font-medium">{category}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${
                    activeDropdown === category ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {/* Dropdown Menu */}
                {activeDropdown === category && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setActiveDropdown(null)}
                    />
                    <div className={`absolute top-full left-0 mt-2 w-56 rounded-2xl shadow-2xl border z-20 ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-200'
                    }`}>
                      <div className="py-2">
                        {items.map((item) => {
                          const Icon = item.icon
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={() => setActiveDropdown(null)}
                              className={`flex items-center space-x-3 px-4 py-3 transition-colors ${
                                darkMode 
                                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span className="font-medium">{item.name}</span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className={`p-2 rounded-xl transition-all duration-200 ${
              darkMode 
                ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}>
              <Search className="w-5 h-5" />
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl transition-all duration-200 ${
                darkMode 
                  ? 'text-yellow-400 hover:bg-gray-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'notifications' ? null : 'notifications')}
                className={`relative p-2 rounded-xl transition-all duration-200 ${
                  darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {activeDropdown === 'notifications' && (
                <>
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setActiveDropdown(null)}
                  />
                  <div className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl border z-20 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className={`p-4 border-b ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <h3 className={`font-semibold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Notifications
                      </h3>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b last:border-b-0 transition-colors ${
                            darkMode 
                              ? 'border-gray-700 hover:bg-gray-700' 
                              : 'border-gray-100 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'success' ? 'bg-green-500' :
                              notification.type === 'info' ? 'bg-blue-500' : 'bg-yellow-500'
                            }`} />
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {notification.title}
                              </p>
                              <p className={`text-xs mt-1 ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className={`p-3 text-center border-t ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <button className={`text-sm font-medium ${
                        darkMode ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        Mark all as read
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className={`flex items-center space-x-2 p-2 rounded-xl transition-all duration-200 ${
                    darkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showProfileDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setShowProfileDropdown(false)}
                    />
                    <div className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl border z-20 ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-200'
                    }`}>
                      <div className={`p-4 border-b ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <p className={`font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {user.email}
                        </p>
                        <p className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Free Plan
                        </p>
                      </div>
                      
                      <div className="py-2">
                        <button className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                          darkMode 
                            ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}>
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                        
                        <button className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                          darkMode 
                            ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}>
                          <User className="w-4 h-4" />
                          <span>Account</span>
                        </button>
                        
                        <button 
                          onClick={handleSignOut}
                          className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                            darkMode 
                              ? 'text-red-400 hover:text-red-300 hover:bg-gray-700' 
                              : 'text-red-600 hover:text-red-700 hover:bg-gray-50'
                          }`}
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}