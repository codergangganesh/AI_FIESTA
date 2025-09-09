'use client'

import { useState, useRef, useEffect } from 'react'
import { useNotifications } from '@/contexts/NotificationContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { Bell, CheckCircle, XCircle, AlertTriangle, Info, Trash2 } from 'lucide-react'
import NotificationDetailsModal from './NotificationDetailsModal'
import { Notification } from '@/contexts/NotificationContext'

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-4 h-4 text-green-500" />
    case 'error':
      return <XCircle className="w-4 h-4 text-red-500" />
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    case 'info':
      return <Info className="w-4 h-4 text-blue-500" />
    default:
      return <Info className="w-4 h-4 text-blue-500" />
  }
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return date.toLocaleDateString()
}

export default function NotificationBell() {
  const { darkMode } = useDarkMode()
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification,
    clearAll 
  } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    setSelectedNotification(notification)
    setShowDetailsModal(true)
    setIsOpen(false)
  }

  const recentNotifications = notifications.slice(0, 10)

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all duration-200 ${
          darkMode 
            ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
            : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
        }`}
      >
        <Bell className="w-5 h-5" />
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={`absolute right-0 top-full mt-2 w-80 max-h-96 rounded-2xl shadow-2xl border backdrop-blur-xl z-50 overflow-hidden ${
          darkMode 
            ? 'bg-gray-800/90 border-gray-700' 
            : 'bg-white/90 border-slate-200/50'
        }`}>
          {/* Header */}
          <div className={`p-4 border-b ${
            darkMode ? 'border-gray-700' : 'border-slate-200/50'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Notifications
                {unreadCount > 0 && (
                  <span className={`ml-2 text-sm ${
                    darkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    ({unreadCount} unread)
                  </span>
                )}
              </h3>
              
              {notifications.length > 0 && (
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className={`text-xs font-medium ${
                        darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                      }`}
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={clearAll}
                    className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      darkMode ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'
                    }`}
                    title="Clear all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className={`w-8 h-8 mx-auto mb-2 ${
                  darkMode ? 'text-gray-600' : 'text-slate-400'
                }`} />
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-slate-500'
                }`}>
                  No notifications yet
                </p>
              </div>
            ) : (
              <div className="p-2">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`relative p-3 rounded-xl mb-2 cursor-pointer transition-all duration-200 ${
                      !notification.read 
                        ? darkMode 
                          ? 'bg-blue-900/20 hover:bg-blue-900/30' 
                          : 'bg-blue-50 hover:bg-blue-100'
                        : darkMode
                          ? 'hover:bg-gray-700/50'
                          : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Unread Indicator */}
                    {!notification.read && (
                      <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium mb-1 ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {notification.title}
                        </h4>
                        <p className={`text-xs mb-2 ${
                          darkMode ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          {notification.message}
                        </p>
                        <p className={`text-xs ${
                          darkMode ? 'text-gray-500' : 'text-slate-500'
                        }`}>
                          {formatTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    {notification.action && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          notification.action?.onClick()
                        }}
                        className={`mt-2 text-xs font-medium underline ${
                          darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                        }`}
                      >
                        {notification.action.label}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 10 && (
            <div className={`p-3 border-t text-center ${
              darkMode ? 'border-gray-700' : 'border-slate-200/50'
            }`}>
              <button className={`text-sm font-medium ${
                darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
              }`}>
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Notification Details Modal */}
      <NotificationDetailsModal
        notification={selectedNotification}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedNotification(null)
        }}
      />
    </div>
  )
}