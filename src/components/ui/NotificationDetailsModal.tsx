'use client'

import { useState, useEffect } from 'react'
import { X, Clock, CheckCircle, AlertTriangle, Info, CreditCard, UserCheck } from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { Notification } from '@/contexts/NotificationContext'

interface NotificationDetailsModalProps {
  notification: Notification | null
  isOpen: boolean
  onClose: () => void
}

export default function NotificationDetailsModal({ 
  notification, 
  isOpen, 
  onClose 
}: NotificationDetailsModalProps) {
  const { darkMode } = useDarkMode()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible || !notification) return null

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'error':
        return <AlertTriangle className="w-6 h-6 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />
      case 'info':
      default:
        return <Info className="w-6 h-6 text-blue-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return darkMode 
          ? 'from-green-900/30 to-emerald-900/30 border-green-700/50' 
          : 'from-green-50 to-emerald-50 border-green-200'
      case 'error':
        return darkMode 
          ? 'from-red-900/30 to-rose-900/30 border-red-700/50' 
          : 'from-red-50 to-rose-50 border-red-200'
      case 'warning':
        return darkMode 
          ? 'from-yellow-900/30 to-amber-900/30 border-yellow-700/50' 
          : 'from-yellow-50 to-amber-50 border-yellow-200'
      case 'info':
      default:
        return darkMode 
          ? 'from-blue-900/30 to-indigo-900/30 border-blue-700/50' 
          : 'from-blue-50 to-indigo-50 border-blue-200'
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - timestamp.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
    return timestamp.toLocaleDateString()
  }

  const getDetailedContent = () => {
    // Enhanced content based on notification type and title
    if (notification.title.toLowerCase().includes('payment')) {
      return {
        category: 'Payment',
        icon: <CreditCard className="w-5 h-5" />,
        details: [
          'Payment processing has been completed successfully',
          'Your subscription status has been updated',
          'Receipt has been sent to your registered email',
          'Access to premium features is now active'
        ]
      }
    }
    
    if (notification.title.toLowerCase().includes('plan') || notification.title.toLowerCase().includes('subscription')) {
      return {
        category: 'Subscription',
        icon: <UserCheck className="w-5 h-5" />,
        details: [
          'Your plan upgrade is now active',
          'New features are available in your dashboard',
          'Updated usage limits have been applied',
          'You can manage your subscription in account settings'
        ]
      }
    }

    return {
      category: 'General',
      icon: <Info className="w-5 h-5" />,
      details: [
        'This notification contains important information',
        'Please review the details carefully',
        'Contact support if you need assistance',
        'You can manage notification preferences in settings'
      ]
    }
  }

  const detailedContent = getDetailedContent()

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isOpen ? 'backdrop-blur-sm bg-black/50' : 'backdrop-blur-none bg-transparent pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none transition-all duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}>
        <div 
          className={`max-w-lg w-full pointer-events-auto transform transition-all duration-300 ${
            isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`rounded-2xl shadow-2xl border backdrop-blur-xl transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-800/95 border-gray-700/50' 
              : 'bg-white/95 border-slate-200/50'
          }`}>
            {/* Header */}
            <div className={`p-6 border-b transition-colors duration-200 ${
              darkMode ? 'border-gray-700/50' : 'border-slate-200/50'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${getTypeColor(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {detailedContent.icon}
                        <span className="ml-1">{detailedContent.category}</span>
                      </span>
                      <div className={`flex items-center text-xs transition-colors duration-200 ${
                        darkMode ? 'text-gray-400' : 'text-slate-500'
                      }`}>
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimestamp(notification.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    darkMode 
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                      : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Main Message */}
              <div>
                <h4 className={`text-sm font-semibold mb-3 transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-700'
                }`}>
                  Message
                </h4>
                <p className={`text-sm leading-relaxed transition-colors duration-200 ${
                  darkMode ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  {notification.message}
                </p>
              </div>

              {/* Additional Details */}
              <div>
                <h4 className={`text-sm font-semibold mb-3 transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-700'
                }`}>
                  Details
                </h4>
                <ul className="space-y-2">
                  {detailedContent.details.map((detail, index) => (
                    <li key={index} className={`flex items-start space-x-3 text-sm transition-colors duration-200 ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                        darkMode ? 'bg-gray-600' : 'bg-slate-400'
                      }`} />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-3">
                  {notification.action && (
                    <button
                      onClick={() => {
                        notification.action?.onClick()
                        onClose()
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-md"
                    >
                      {notification.action.label}
                    </button>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={onClose}
                    className={`px-4 py-2 font-medium rounded-lg transition-all duration-200 ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}