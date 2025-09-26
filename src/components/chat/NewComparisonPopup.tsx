'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface NewComparisonPopupProps {
  isOpen: boolean
  onClose: () => void
  onSave: (title: string) => void
  darkMode?: boolean
}

export default function NewComparisonPopup({ 
  isOpen, 
  onClose, 
  onSave,
  darkMode = false
}: NewComparisonPopupProps) {
  const [title, setTitle] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSave(title.trim())
      setTitle('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className={`backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full transition-all duration-300 transform ${
        darkMode ? 'bg-gray-800/90' : 'bg-white/90'
      }`}>
        <div className={`p-6 border-b transition-colors duration-200 ${
          darkMode 
            ? 'border-gray-600/50' 
            : 'border-slate-200/50'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-xl font-bold transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>New Comparison</h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg hover:bg-white/50 transition-colors duration-200 ${
                darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={`p-6 transition-colors duration-200 ${
            darkMode ? 'text-gray-300' : 'text-slate-600'
          }`}>
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                darkMode ? 'text-gray-300' : 'text-slate-700'
              }`}>
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter comparison title"
                className={`w-full px-4 py-3 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600/50 focus:ring-blue-500/20 focus:border-blue-400 text-white placeholder-gray-400' 
                    : 'bg-white/80 border-slate-200/50 focus:ring-blue-500/20 focus:border-blue-400 text-slate-900 placeholder-slate-400'
                }`}
                required
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  title.trim()
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                Create
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}