'use client'

import { AI_MODELS } from '@/config/ai-models'
import { Brain, Zap, Star } from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'

export default function ModernModelShowcase() {
  const { darkMode } = useDarkMode()
  // Get the first 6 models for showcase
  const featuredModels = AI_MODELS.slice(0, 6)

  // Dispatch custom event to open the overlay in the parent component
  const handleViewAllModels = () => {
    window.dispatchEvent(new CustomEvent('openAllModelsOverlay'))
  }

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
    <div className={`py-24 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-white to-blue-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className={`inline-flex items-center space-x-2 rounded-full px-4 py-2 mb-6 ${
            darkMode 
              ? 'bg-gray-800 border border-gray-700/50' 
              : 'bg-blue-50 border border-blue-200/50'
          }`}>
            <Brain className={`w-4 h-4 ${
              darkMode ? 'text-blue-400' : 'text-blue-500'
            }`} />
            <span className={`text-sm font-medium ${
              darkMode ? 'text-blue-400' : 'text-blue-700'
            }`}>
              Premium AI Models
            </span>
          </div>
          <h2 className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r ${
            darkMode 
              ? 'from-white to-gray-300' 
              : 'from-slate-900 to-slate-700'
          } bg-clip-text text-transparent mb-6`}>
            World-Class AI Models
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-slate-600'
          }`}>
            Access the latest and most powerful AI models from leading companies
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredModels.map((model, index) => (
            <div 
              key={index} 
              className={`group backdrop-blur-sm rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}
            >
              {/* Animated background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getProviderColor(model.provider)} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
              
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
              
              {/* Model capabilities */}
              <div className="relative mt-6 flex flex-wrap gap-2">
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
                darkMode ? 'border-gray-700/50' : 'border-slate-200/50'
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
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-2xl transition-all duration-300"></div>
            </div>
          ))}
        </div>
        
        {/* View all models button */}
        <div className="text-center mt-12">
          <button 
            onClick={handleViewAllModels}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <span>View All {AI_MODELS.length} Models</span>
            <Zap className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}