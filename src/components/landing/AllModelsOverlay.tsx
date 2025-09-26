'use client'

import { AI_MODELS } from '@/config/ai-models'
import { X, Brain, Zap, Star } from 'lucide-react'

interface AllModelsOverlayProps {
  show: boolean
  onClose: () => void
  darkMode: boolean
}

export default function AllModelsOverlay({ show, onClose, darkMode }: AllModelsOverlayProps) {
  if (!show) return null

  const getProviderColor = (provider: string) => {
    const colors: Record<string, string> = {
      'Google': 'from-blue-500 to-green-500',
      'Anthropic': 'from-orange-500 to-red-500',
      'OpenAI': 'from-green-500 to-blue-500',
      'Meta': 'from-blue-600 to-purple-600',
      'DeepSeek': 'from-purple-500 to-pink-500',
      'Alibaba': 'from-red-500 to-orange-500',
      'xAI': 'from-gray-700 to-gray-900',
      'Moonshot': 'from-cyan-500 to-blue-500',
      'Augmxnt': 'from-pink-500 to-purple-500'
    }
    return colors[provider] || 'from-slate-500 to-slate-700'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className={`relative rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-white to-gray-100'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 p-6 flex items-center justify-between border-b ${
          darkMode 
            ? 'bg-gray-900/80 border-gray-700/50 backdrop-blur-lg' 
            : 'bg-white/80 border-slate-200/50 backdrop-blur-lg'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center`}>
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h2 className={`text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              All AI Models
            </h2>
          </div>
          
          <button 
            onClick={onClose}
            aria-label="Close"
            title="Close"
            className={`p-2 rounded-full hover:bg-opacity-20 transition-colors ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-200 text-gray-600'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Models Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {AI_MODELS.map((model, index) => (
              <div 
                key={index} 
                className={`group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden ${
                  darkMode 
                    ? 'bg-gray-800/60 hover:bg-gray-800/80' 
                    : 'bg-white/80 hover:bg-white/90'
                }`}
              >
                {/* Gradient border effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getProviderColor(model.provider)} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${getProviderColor(model.provider)} rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                      {model.displayName.charAt(0)}
                    </div>
                    <div>
                      <div className={`font-bold text-lg ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {model.displayName}
                      </div>
                      <div className={`text-sm mt-1 ${
                        darkMode ? 'text-gray-400' : 'text-slate-600'
                      }`}>
                        {model.provider}
                      </div>
                    </div>
                  </div>
                  
                  {/* Status indicator */}
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className={`text-xs font-medium ${
                      darkMode ? 'text-green-400' : 'text-green-600'
                    }`}>
                      Active
                    </span>
                  </div>
                </div>
                
                {/* Model description */}
                <div className={`relative mt-4 text-sm ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  {model.description}
                </div>
                
                {/* Model capabilities */}
                <div className="relative mt-4 flex flex-wrap gap-2">
                  {model.capabilities?.slice(0, 3).map((capability, idx) => (
                    <span 
                      key={idx} 
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {capability}
                    </span>
                  ))}
                </div>
                
                {/* Performance indicators */}
                <div className={`relative mt-4 pt-4 border-t ${
                  darkMode ? 'border-gray-700' : 'border-slate-200'
                }`}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Zap className={`w-4 h-4 ${
                        darkMode ? 'text-gray-400' : 'text-slate-500'
                      }`} />
                      <span className={
                        darkMode ? 'text-gray-300' : 'text-slate-600'
                      }>
                        Speed: {model.speed || 'Medium'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className={`w-4 h-4 ${
                        darkMode ? 'text-gray-400' : 'text-slate-500'
                      }`} />
                      <span className={
                        darkMode ? 'text-gray-300' : 'text-slate-600'
                      }>
                        Cost: {model.cost || 'Medium'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Context window - only show if available */}
                {model.contextWindow && (
                  <div className={`relative mt-3 text-xs ${
                    darkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    Context: {model.contextWindow}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}