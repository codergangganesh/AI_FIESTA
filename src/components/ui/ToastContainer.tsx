'use client'

import { useNotifications, NotificationType } from '@/contexts/NotificationContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-green-500" />
    case 'error':
      return <XCircle className="w-5 h-5 text-red-500" />
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    case 'info':
      return <Info className="w-5 h-5 text-blue-500" />
    default:
      return <Info className="w-5 h-5 text-blue-500" />
  }
}

const getColorClasses = (type: NotificationType, darkMode: boolean) => {
  switch (type) {
    case 'success':
      return darkMode 
        ? 'bg-green-900/20 border-green-700/30 text-green-100'
        : 'bg-green-50 border-green-200 text-green-800'
    case 'error':
      return darkMode
        ? 'bg-red-900/20 border-red-700/30 text-red-100'
        : 'bg-red-50 border-red-200 text-red-800'
    case 'warning':
      return darkMode
        ? 'bg-yellow-900/20 border-yellow-700/30 text-yellow-100'
        : 'bg-yellow-50 border-yellow-200 text-yellow-800'
    case 'info':
      return darkMode
        ? 'bg-blue-900/20 border-blue-700/30 text-blue-100'
        : 'bg-blue-50 border-blue-200 text-blue-800'
    default:
      return darkMode
        ? 'bg-gray-900/20 border-gray-700/30 text-gray-100'
        : 'bg-gray-50 border-gray-200 text-gray-800'
  }
}

export default function ToastContainer() {
  const { notifications, removeNotification } = useNotifications()
  const { darkMode } = useDarkMode()

  const handleClose = (id: string) => {
    removeNotification(id)
  }

  // Show only the latest 3 notifications
  const visibleToasts = notifications.slice(0, 3)

  if (visibleToasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {visibleToasts.map((notification) => (
        <div
          key={notification.id}
          className={`
            min-w-80 max-w-md p-4 rounded-xl border backdrop-blur-sm
            transform transition-all duration-300 ease-in-out
            translate-x-0 opacity-100
            ${getColorClasses(notification.type, darkMode)}
          `}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold">
                {notification.title}
              </h3>
              <p className="text-sm opacity-90 mt-1">
                {notification.message}
              </p>
              
              {notification.action && (
                <button
                  onClick={notification.action.onClick}
                  className="text-sm font-medium underline mt-2 hover:no-underline"
                >
                  {notification.action.label}
                </button>
              )}
            </div>
            
            <button
              onClick={() => handleClose(notification.id)}
              className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}