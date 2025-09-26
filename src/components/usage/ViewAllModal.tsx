'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { X } from 'lucide-react'

interface ViewAllModalProps {
  data: any[]
  unit: string
  onClose: () => void
}

export default function ViewAllModal({ data, unit, onClose }: ViewAllModalProps) {
  const { darkMode } = useDarkMode()
  const modalRef = useRef<HTMLDivElement>(null)

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  // Order data chronologically (most recent first)
  const orderedData = [...data].sort((a, b) => {
    // If data has timestamps, sort by those
    if (a.timestamp && b.timestamp) {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    }
    
    // Otherwise, sort by period name if it contains numbers
    const aNum = a.period?.match(/\d+/)?.[0] || 0
    const bNum = b.period?.match(/\d+/)?.[0] || 0
    return parseInt(bNum as string) - parseInt(aNum as string)
  })

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>
      <div 
        ref={modalRef}
        className={`relative rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 ease-out border ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-slate-200'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          darkMode 
            ? 'border-gray-700' 
            : 'border-slate-200'
        }`}>
          <h2 className={`text-xl font-semibold ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            API Call History - All Data
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-md transition-colors duration-200 ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'
            }`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {orderedData.length > 0 ? (
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-slate-50 text-slate-500'
                      }`}>
                        Period
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-slate-50 text-slate-500'
                      }`}>
                        Value
                      </th>
                      {orderedData.some(item => item.timestamp) && (
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-slate-50 text-slate-500'
                        }`}>
                          Timestamp
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className={`${
                    darkMode 
                      ? 'bg-gray-800' 
                      : 'bg-white'
                  }`}>
                    {orderedData.map((item, index) => (
                      <tr 
                        key={index}
                        className={`${index % 2 === 0 ? (darkMode ? 'bg-gray-800' : 'bg-white') : (darkMode ? 'bg-gray-700/30' : 'bg-slate-50')} ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-slate-100'}`}
                      >
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {item.period || item.name || item.label || `Period ${index + 1}`}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          darkMode ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          {item.value || item.count || item.amount || 0}{unit}
                        </td>
                        {item.timestamp && (
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                            darkMode ? 'text-gray-300' : 'text-slate-700'
                          }`}>
                            {new Date(item.timestamp).toLocaleString()}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                darkMode ? 'bg-gray-700' : 'bg-slate-100'
              }`}>
                <svg 
                  className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-slate-400'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className={`text-lg font-medium mb-1 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                No Data Available
              </h3>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-slate-500'
              }`}>
                There is no API call history to display.
              </p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className={`p-6 border-t ${
          darkMode 
            ? 'border-gray-700' 
            : 'border-slate-200'
        }`}>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Use portal to render modal at the root level to avoid z-index issues
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body)
  }
  
  return null
}