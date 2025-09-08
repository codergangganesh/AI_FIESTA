'use client'

import { useState, useRef } from 'react'
import { X, User, Mail, Lock, Camera, Eye, EyeOff, Check, AlertCircle, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface AccountSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  darkMode?: boolean
}

export default function AccountSettingsModal({ isOpen, onClose, darkMode = false }: AccountSettingsModalProps) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Profile form state
  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    username: user?.user_metadata?.username || user?.email?.split('@')[0] || '',
    email: user?.email || '',
    profilePicture: user?.user_metadata?.avatar_url || ''
  })

  // Password form stat----
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // UI state
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [emailPreferences, setEmailPreferences] = useState({
    promotional: true,
    updates: true,
    security: true
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleProfileUpdate = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess('Password updated successfully!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError('Failed to update password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: e.target?.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const getUserInitials = () => {
    if (profileData.fullName) {
      return profileData.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    }
    return profileData.email.charAt(0).toUpperCase()
  }

  if (!isOpen) return null

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'preferences', label: 'Email Preferences', icon: Mail },
    { id: 'danger', label: 'Delete Account', icon: Trash2 }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl ${
        darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-slate-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          darkMode ? 'border-gray-700' : 'border-slate-200'
        }`}>
          <h2 className={`text-2xl font-bold ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Account Settings
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all duration-200 ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <div className={`lg:w-80 p-6 border-r ${
            darkMode ? 'border-gray-700 bg-gray-800/30' : 'border-slate-200 bg-slate-50/50'
          }`}>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? darkMode
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-blue-500 text-white shadow-lg'
                        : darkMode
                        ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                        : 'hover:bg-white text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Success/Error Messages */}
            {(success || error) && (
              <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
                success 
                  ? darkMode 
                    ? 'bg-green-900/30 border border-green-700 text-green-400'
                    : 'bg-green-50 border border-green-200 text-green-700'
                  : darkMode
                  ? 'bg-red-900/30 border border-red-700 text-red-400'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {success ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span>{success || error}</span>
              </div>
            )}

            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className={`text-xl font-semibold ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Profile Information
                </h3>

                {/* Profile Picture */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    {profileData.profilePicture ? (
                      <img
                        src={profileData.profilePicture}
                        alt="Profile"
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                        {getUserInitials()}
                      </div>
                    )}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <h4 className={`font-medium ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Profile Picture
                    </h4>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-slate-500'
                    }`}>
                      Upload a new profile picture
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      Username
                    </label>
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      placeholder="Enter your username"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <button
                  onClick={handleProfileUpdate}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="space-y-6">
                <h3 className={`text-xl font-semibold ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Password Management
                </h3>

                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className={`w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-200 ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                          darkMode ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className={`w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-200 ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                          darkMode ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className={`w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-200 ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                          darkMode ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePasswordUpdate}
                  disabled={loading || !passwordData.currentPassword || !passwordData.newPassword}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            )}

            {/* Email Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h3 className={`text-xl font-semibold ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Email Preferences
                </h3>

                <div className="space-y-4">
                  {Object.entries(emailPreferences).map(([key, value]) => (
                    <div key={key} className={`flex items-center justify-between p-4 rounded-xl border ${
                      darkMode ? 'border-gray-700 bg-gray-800/30' : 'border-slate-200 bg-slate-50/50'
                    }`}>
                      <div>
                        <h4 className={`font-medium ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {key === 'promotional' ? 'Promotional Emails' : 
                           key === 'updates' ? 'Product Updates' : 'Security Notifications'}
                        </h4>
                        <p className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-slate-500'
                        }`}>
                          {key === 'promotional' ? 'Receive emails about new features and offers' :
                           key === 'updates' ? 'Get notified about product updates and changes' :
                           'Important security and account notifications'}
                        </p>
                      </div>
                      <button
                        onClick={() => setEmailPreferences(prev => ({ ...prev, [key]: !value }))}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${
                          value ? 'bg-blue-500' : darkMode ? 'bg-gray-600' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                          value ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delete Account Tab */}
            {activeTab === 'danger' && (
              <div className="space-y-6">
                <h3 className={`text-xl font-semibold ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Delete Account
                </h3>

                <div className={`p-6 rounded-xl border-2 border-dashed ${
                  darkMode ? 'border-red-800 bg-red-900/10' : 'border-red-200 bg-red-50/50'
                }`}>
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      darkMode ? 'bg-red-900/30' : 'bg-red-100'
                    }`}>
                      <AlertCircle className={`w-6 h-6 ${
                        darkMode ? 'text-red-400' : 'text-red-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold mb-2 ${
                        darkMode ? 'text-red-400' : 'text-red-700'
                      }`}>
                        Permanently Delete Account
                      </h4>
                      <p className={`text-sm mb-4 ${
                        darkMode ? 'text-gray-300' : 'text-slate-600'
                      }`}>
                        Once you delete your account, there is no going back. Please be certain. This action will:
                      </p>
                      <ul className={`text-sm space-y-1 mb-4 ${
                        darkMode ? 'text-gray-400' : 'text-slate-500'
                      }`}>
                        <li>• Delete all your conversation history</li>
                        <li>• Remove your profile and personal data</li>
                        <li>• Cancel any active subscriptions</li>
                        <li>• Permanently disable your account access</li>
                      </ul>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                          darkMode 
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        } hover:shadow-lg`}
                      >
                        Delete My Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}