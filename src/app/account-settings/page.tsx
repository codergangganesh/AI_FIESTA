'use client'

import { useState } from 'react'
import { ArrowLeft, User, Lock, Mail, Trash2, Moon, Sun, Bell, Shield, CreditCard, Database, Settings as SettingsIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import Link from 'next/link'

export default function AccountSettingsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const [activeTab, setActiveTab] = useState('profile')
  
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    username: user?.user_metadata?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    marketingEmails: false,
    securityAlerts: true
  })

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('New passwords do not match.')
      return
    }
    
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Password changed successfully!')
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Failed to change password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePreferences = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Preferences updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Failed to update preferences. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { 
      id: 'profile', 
      label: 'Profile Information', 
      icon: User,
      description: 'Update your personal details and preferences'
    },
    { 
      id: 'security', 
      label: 'Security & Privacy', 
      icon: Shield,
      description: 'Manage passwords and security settings'
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: Bell,
      description: 'Configure notification preferences'
    },
    { 
      id: 'billing', 
      label: 'Billing & Subscription', 
      icon: CreditCard,
      description: 'Manage your subscription and billing'
    },
    { 
      id: 'data', 
      label: 'Data & Privacy', 
      icon: Database,
      description: 'Export data and privacy controls'
    },
    { 
      id: 'delete', 
      label: 'Delete Account', 
      icon: Trash2,
      description: 'Permanently delete your account'
    }
  ]

  return (
    <div className={`flex h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      {/* Advanced Sidebar */}
      <AdvancedSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-16 lg:ml-72 transition-all duration-300 overflow-hidden">
        {/* Header */}
        <div className={`backdrop-blur-sm border-b transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-800/60 border-gray-700/30' 
            : 'bg-white/60 border-slate-200/30'
        }`}>
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    darkMode 
                      ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                      : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className={`text-3xl font-bold transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Account Settings
                  </h1>
                  <p className={`transition-colors duration-200 ${
                    darkMode ? 'text-gray-300' : 'text-slate-600'
                  }`}>
                    Manage your account preferences and security
                  </p>
                </div>
              </div>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300' 
                    : 'bg-white/80 hover:bg-white border border-slate-200 text-slate-700'
                }`}
              >
                {darkMode ? (
                  <>
                    <Sun className="w-4 h-4" />
                    <span className="hidden sm:inline">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    <span className="hidden sm:inline">Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Flexbox Layout */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Settings Sidebar */}
            <div className={`w-80 border-r transition-colors duration-200 ${
              darkMode ? 'border-gray-700/50 bg-gray-800/40' : 'border-slate-200/50 bg-white/40'
            } backdrop-blur-sm`}>
              <div className="p-6">
                <h2 className={`text-lg font-bold mb-6 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Settings
                </h2>
                
                <div className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full group flex items-start space-x-3 p-4 rounded-xl transition-all duration-200 text-left ${
                          activeTab === tab.id
                            ? darkMode
                              ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400'
                              : 'bg-blue-50 border border-blue-200 text-blue-700'
                            : darkMode
                              ? 'hover:bg-gray-700/30 text-gray-300 hover:text-white'
                              : 'hover:bg-slate-100/50 text-slate-700 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex-shrink-0">
                          <Icon className={`w-5 h-5 transition-colors duration-200 ${
                            activeTab === tab.id ? 'text-current' : 'text-current opacity-60'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm mb-1">{tab.label}</div>
                          <div className={`text-xs leading-relaxed transition-colors duration-200 ${
                            darkMode ? 'text-gray-400' : 'text-slate-500'
                          }`}>
                            {tab.description}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-8 max-w-4xl mx-auto">
                {/* Success/Error Message */}
                {message && (
                  <div className={`mb-6 p-4 rounded-xl transition-colors duration-200 ${
                    message.includes('successfully')
                      ? darkMode
                        ? 'bg-green-900/30 border border-green-700/50 text-green-400'
                        : 'bg-green-50 border border-green-200 text-green-700'
                      : darkMode
                        ? 'bg-red-900/30 border border-red-700/50 text-red-400'
                        : 'bg-red-50 border border-red-200 text-red-700'
                  }`}>
                    {message}
                  </div>
                )}

                {/* Profile Information Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-8">
                    <div className="border-b border-current border-opacity-10 pb-6">
                      <h2 className={`text-2xl font-bold transition-colors duration-200 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        Profile Information
                      </h2>
                      <p className={`mt-2 transition-colors duration-200 ${
                        darkMode ? 'text-gray-400' : 'text-slate-600'
                      }`}>
                        Update your personal details and account information
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                          darkMode ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                            darkMode
                              ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                              : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                          darkMode ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          Username
                        </label>
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                            darkMode
                              ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                              : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                          placeholder="Enter your username"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                        darkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                          darkMode
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                            : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        placeholder="Enter your email address"
                      />
                    </div>
                    
                    <button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}

                {/* Security & Privacy Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-8">
                    <div className="border-b border-current border-opacity-10 pb-6">
                      <h2 className={`text-2xl font-bold transition-colors duration-200 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        Security & Privacy
                      </h2>
                      <p className={`mt-2 transition-colors duration-200 ${
                        darkMode ? 'text-gray-400' : 'text-slate-600'
                      }`}>
                        Manage your account security and privacy settings
                      </p>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                        darkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={formData.currentPassword}
                        onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                          darkMode
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                            : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        placeholder="Enter your current password"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                          darkMode ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          New Password
                        </label>
                        <input
                          type="password"
                          value={formData.newPassword}
                          onChange={(e) => handleInputChange('newPassword', e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                            darkMode
                              ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                              : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                          placeholder="Enter new password"
                        />
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                          darkMode ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                            darkMode
                              ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                              : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={handleChangePassword}
                      disabled={isLoading}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                    >
                      {isLoading ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="space-y-8">
                    <div className="border-b border-current border-opacity-10 pb-6">
                      <h2 className={`text-2xl font-bold transition-colors duration-200 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        Notification Preferences
                      </h2>
                      <p className={`mt-2 transition-colors duration-200 ${
                        darkMode ? 'text-gray-400' : 'text-slate-600'
                      }`}>
                        Control how and when you receive notifications
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications about your account activity' },
                        { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive updates about new features and promotions' },
                        { key: 'securityAlerts', label: 'Security Alerts', description: 'Receive alerts about security events' }
                      ].map((pref) => (
                        <div key={pref.key} className={`flex items-center justify-between p-4 rounded-xl transition-colors duration-200 ${
                          darkMode ? 'bg-gray-700/30' : 'bg-slate-50'
                        }`}>
                          <div>
                            <h3 className={`font-medium transition-colors duration-200 ${
                              darkMode ? 'text-white' : 'text-slate-900'
                            }`}>
                              {pref.label}
                            </h3>
                            <p className={`text-sm transition-colors duration-200 ${
                              darkMode ? 'text-gray-400' : 'text-slate-600'
                            }`}>
                              {pref.description}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData[pref.key as keyof typeof formData] as boolean}
                              onChange={(e) => handleInputChange(pref.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={handleSavePreferences}
                      disabled={isLoading}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                )}

                {/* Billing Tab */}
                {activeTab === 'billing' && (
                  <div className="space-y-8">
                    <div className="border-b border-current border-opacity-10 pb-6">
                      <h2 className={`text-2xl font-bold transition-colors duration-200 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        Billing & Subscription
                      </h2>
                      <p className={`mt-2 transition-colors duration-200 ${
                        darkMode ? 'text-gray-400' : 'text-slate-600'
                      }`}>
                        Manage your subscription and billing information
                      </p>
                    </div>
                    
                    <div className={`p-6 rounded-xl border transition-colors duration-200 ${
                      darkMode 
                        ? 'bg-blue-900/20 border-blue-700/50' 
                        : 'bg-blue-50 border-blue-200'
                    }`}>
                      <h3 className={`font-semibold mb-2 transition-colors duration-200 ${
                        darkMode ? 'text-blue-400' : 'text-blue-700'
                      }`}>
                        Current Plan: Free
                      </h3>
                      <p className={`mb-4 transition-colors duration-200 ${
                        darkMode ? 'text-blue-300' : 'text-blue-600'
                      }`}>
                        Upgrade to Pro for unlimited access to all AI models and advanced features.
                      </p>
                      
                      <Link
                        href="/pricing"
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Upgrade Plan</span>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Data & Privacy Tab */}
                {activeTab === 'data' && (
                  <div className="space-y-8">
                    <div className="border-b border-current border-opacity-10 pb-6">
                      <h2 className={`text-2xl font-bold transition-colors duration-200 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        Data & Privacy
                      </h2>
                      <p className={`mt-2 transition-colors duration-200 ${
                        darkMode ? 'text-gray-400' : 'text-slate-600'
                      }`}>
                        Export your data and manage privacy settings
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className={`p-4 rounded-xl border transition-colors duration-200 ${
                        darkMode 
                          ? 'bg-gray-700/30 border-gray-600' 
                          : 'bg-slate-50 border-slate-200'
                      }`}>
                        <h3 className={`font-medium mb-2 transition-colors duration-200 ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          Export Data
                        </h3>
                        <p className={`text-sm mb-3 transition-colors duration-200 ${
                          darkMode ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          Download all your conversations and account data
                        </p>
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200">
                          Export Data
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delete Account Tab */}
                {activeTab === 'delete' && (
                  <div className="space-y-8">
                    <div className="border-b border-current border-opacity-10 pb-6">
                      <h2 className={`text-2xl font-bold transition-colors duration-200 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        Delete Account
                      </h2>
                      <p className={`mt-2 transition-colors duration-200 ${
                        darkMode ? 'text-gray-400' : 'text-slate-600'
                      }`}>
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    
                    <div className={`p-6 rounded-xl border transition-colors duration-200 ${
                      darkMode 
                        ? 'bg-red-900/20 border-red-700/50' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <h3 className={`font-semibold mb-2 transition-colors duration-200 ${
                        darkMode ? 'text-red-400' : 'text-red-700'
                      }`}>
                        Warning: This action cannot be undone
                      </h3>
                      <p className={`mb-4 transition-colors duration-200 ${
                        darkMode ? 'text-red-300' : 'text-red-600'
                      }`}>
                        Deleting your account will permanently remove all your data, conversations, and settings. This action is irreversible.
                      </p>
                      
                      <Link
                        href="/delete-account"
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Proceed to Delete Account</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}