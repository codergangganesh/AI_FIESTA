'use client'

import { useDarkMode } from '@/contexts/DarkModeContext'
import { Sparkles } from 'lucide-react'

interface BlankComparisonPageProps {
  onStartNew?: () => void
}

export default function BlankComparisonPage({ onStartNew }: BlankComparisonPageProps) {
  const { darkMode } = useDarkMode()

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <div className={`w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl transition-transform duration-300 ${
          darkMode ? 'shadow-blue-500/20' : 'shadow-blue-500/30'
        }`}>
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h2 className={`text-3xl font-bold mb-4 transition-colors duration-200 ${
          darkMode ? 'text-white' : 'text-slate-900'
        }`}>
          New Comparison
        </h2>
        <p className={`text-lg mb-8 leading-relaxed transition-colors duration-200 ${
          darkMode ? 'text-gray-300' : 'text-slate-600'
        }`}>
          Click below to start a new AI model comparison
        </p>
        <button
          onClick={onStartNew}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Start New Comparison
        </button>
      </div>
    </div>
  )
}