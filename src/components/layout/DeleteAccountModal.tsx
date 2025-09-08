'use client'

import { useState } from 'react'
import { X, AlertTriangle, Trash2, Shield } from 'lucide-react'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  darkMode?: boolean
}

export default function DeleteAccountModal({ isOpen, onClose, onConfirm, darkMode = false }: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)
  const CONFIRM_TEXT = 'DELETE MY ACCOUNT'

  const handleConfirm = async () => {
    if (confirmText !== CONFIRM_TEXT) return
    
    setLoading(true)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      onConfirm()
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className={`w-full max-w-lg rounded-3xl shadow-2xl transform transition-all duration-300 scale-100 ${
        darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-slate-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          darkMode ? 'border-gray-700' : 'border-slate-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              darkMode ? 'bg-red-900/30' : 'bg-red-100'
            }`}>
              <AlertTriangle className={`w-6 h-6 ${
                darkMode ? 'text-red-400' : 'text-red-600'
              }`} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Delete Account
              </h2>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-slate-500'
              }`}>
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className={`p-2 rounded-xl transition-all duration-200 ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Warning Message */}
          <div className={`p-4 rounded-xl border-2 border-dashed ${
            darkMode ? 'border-red-800 bg-red-900/10' : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-start space-x-3">
              <Shield className={`w-5 h-5 mt-0.5 ${
                darkMode ? 'text-red-400' : 'text-red-600'
              }`} />
              <div>
                <h3 className={`font-semibold mb-2 ${
                  darkMode ? 'text-red-400' : 'text-red-700'
                }`}>
                  Account Deletion Warning
                </h3>
                <p className={`text-sm leading-relaxed ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  You are about to permanently delete your AI Fiesta account. This action will immediately and permanently remove:
                </p>
              </div>
            </div>
          </div>

          {/* Consequences List */}
          <div className="space-y-3">
            {[
              'All your conversation history and saved chats',
              'Your profile information and preferences',
              'Access to your account and all associated data',
              'Any premium features or subscriptions',
              'Custom AI model configurations'
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  darkMode ? 'bg-red-500' : 'bg-red-600'
                }`} />
                <span className={`text-sm ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Confirmation Input */}
          <div className="space-y-3">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-slate-700'
              }`}>
                To confirm deletion, type <span className="font-mono text-red-600 font-bold">{CONFIRM_TEXT}</span> below:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                disabled={loading}
                placeholder={CONFIRM_TEXT}
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white focus:border-red-500'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-red-500'
                } focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50`}
              />
            </div>
            
            {/* Visual feedback for confirmation text */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                confirmText === CONFIRM_TEXT 
                  ? 'bg-red-500' 
                  : darkMode ? 'bg-gray-600' : 'bg-slate-300'
              }`} />
              <span className={`text-xs ${
                confirmText === CONFIRM_TEXT 
                  ? darkMode ? 'text-red-400' : 'text-red-600'
                  : darkMode ? 'text-gray-500' : 'text-slate-400'
              }`}>
                {confirmText === CONFIRM_TEXT ? 'Confirmation text matches' : 'Enter confirmation text to proceed'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              disabled={loading}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={confirmText !== CONFIRM_TEXT || loading}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                confirmText === CONFIRM_TEXT && !loading
                  ? 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg'
                  : 'bg-red-400 text-white cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Deleting Account...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Forever</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Security Footer */}
        <div className={`px-6 pb-6 text-center ${
          darkMode ? 'text-gray-400' : 'text-slate-500'
        }`}>
          <p className="text-xs">
            Account deletion is processed securely and cannot be reversed.
          </p>
        </div>
      </div>
    </div>
  )
}