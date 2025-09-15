'use client'

import { useState } from 'react'
import { AIModel } from '@/types/app'
import { AI_MODELS } from '@/config/ai-models'
import { 
  Brain, 
  Zap, 
  Check, 
  Search, 
  Filter, 
  ChevronDown, 
  Star, 
  Code, 
  Image, 
  FileText,
  DollarSign,
  Clock
} from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'

interface ModernModelSelectorProps {
  selectedModels: string[]
  onModelToggle: (modelId: string) => void
}

export default function ModernModelSelector({ selectedModels, onModelToggle }: ModernModelSelectorProps) {
  const { darkMode } = useDarkMode()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProvider, setSelectedProvider] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'provider' | 'speed' | 'cost'>('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const providers = ['all', ...Array.from(new Set(AI_MODELS.map(m => m.provider)))]

  const filteredModels = AI_MODELS.filter(model => {
    const matchesSearch = model.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.provider.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProvider = selectedProvider === 'all' || model.provider === selectedProvider
    return matchesSearch && matchesProvider
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.displayName.localeCompare(b.displayName)
      case 'provider':
        return a.provider.localeCompare(b.provider)
      case 'speed':
        const speedOrder = { 'very-fast': 0, 'fast': 1, 'medium': 2, 'slow': 3 }
        return speedOrder[a.speed || 'medium'] - speedOrder[b.speed || 'medium']
      case 'cost':
        const costOrder = { 'very-low': 0, 'low': 1, 'medium': 2, 'high': 3 }
        return costOrder[a.cost || 'medium'] - costOrder[b.cost || 'medium']
      default:
        return 0
    }
  })

  const getProviderColor = (provider: string) => {
    const colors: Record<string, string> = {
      'Google': 'from-blue-500 to-green-500',
      'Anthropic': 'from-orange-500 to-red-500',
      'OpenAI': 'from-green-500 to-blue-500',
      'Meta': 'from-blue-600 to-purple-600',
      'DeepSeek': 'from-purple-500 to-pink-500',
      'Qwen': 'from-red-500 to-orange-500',
      'Grok': 'from-gray-700 to-gray-900',
      'Kimi': 'from-cyan-500 to-blue-500',
      'Shisa': 'from-pink-500 to-purple-500'
    }
    return colors[provider] || 'from-slate-500 to-slate-700'
  }

  const getCapabilityIcon = (capability: string) => {
    switch (capability) {
      case 'text': return <FileText className="w-4 h-4" />
      case 'image': return <Image className="w-4 h-4" />
      case 'code': return <Code className="w-4 h-4" />
      case 'audio': return <Zap className="w-4 h-4" />
      case 'video': return <Zap className="w-4 h-4" />
      case 'document': return <FileText className="w-4 h-4" />
      case 'math': return <Star className="w-4 h-4" />
      default: return <Brain className="w-4 h-4" />
    }
  }

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'very-fast': return 'text-green-500'
      case 'fast': return 'text-green-400'
      case 'medium': return 'text-yellow-500'
      case 'slow': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'very-low': return 'text-green-500'
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-500'
      case 'high': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className={`rounded-2xl border p-6 shadow-lg transition-colors duration-200 ${
        darkMode 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white/80 backdrop-blur-xl border-slate-200/50'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className={`text-2xl font-bold transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              AI Model Selection
            </h2>
            <p className={`mt-1 transition-colors duration-200 ${
              darkMode ? 'text-gray-400' : 'text-slate-600'
            }`}>
              Choose models to compare responses
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors duration-200 ${
              darkMode 
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
            }`}>
              {selectedModels.length} / {AI_MODELS.length} Selected
            </div>
            <button
              onClick={() => {
                if (selectedModels.length === AI_MODELS.length) {
                  // Deselect all
                  AI_MODELS.forEach(model => {
                    if (selectedModels.includes(model.id)) {
                      onModelToggle(model.id)
                    }
                  })
                } else {
                  // Select all
                  AI_MODELS.forEach(model => {
                    if (!selectedModels.includes(model.id)) {
                      onModelToggle(model.id)
                    }
                  })
                }
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
                darkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {selectedModels.length === AI_MODELS.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
              darkMode ? 'text-gray-400' : 'text-slate-400'
            }`} />
            <input
              type="text"
              placeholder="Search models or providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-colors duration-200 ${
                darkMode
                  ? 'bg-gray-800 border border-gray-700 text-white focus:ring-violet-500 focus:border-transparent placeholder-gray-500'
                  : 'bg-slate-50 border border-slate-200 text-slate-900 focus:ring-blue-500 focus:border-transparent'
              }`}
            />
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className={`appearance-none pl-4 pr-10 py-3 rounded-xl focus:outline-none focus:ring-2 transition-colors duration-200 ${
                  darkMode
                    ? 'bg-gray-800 border border-gray-700 text-white focus:ring-violet-500 focus:border-transparent'
                    : 'bg-slate-50 border border-slate-200 text-slate-900 focus:ring-blue-500 focus:border-transparent'
                }`}
              >
                {providers.map(provider => (
                  <option 
                    key={provider} 
                    value={provider}
                    className={darkMode ? 'bg-gray-800 text-white' : 'bg-white text-slate-900'}
                  >
                    {provider === 'all' ? 'All Providers' : provider}
                  </option>
                ))}
              </select>
              <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors duration-200 ${
                darkMode ? 'text-gray-400' : 'text-slate-400'
              }`} />
            </div>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={`appearance-none pl-4 pr-10 py-3 rounded-xl focus:outline-none focus:ring-2 transition-colors duration-200 ${
                  darkMode
                    ? 'bg-gray-800 border border-gray-700 text-white focus:ring-violet-500 focus:border-transparent'
                    : 'bg-slate-50 border border-slate-200 text-slate-900 focus:ring-blue-500 focus:border-transparent'
                }`}
              >
                <option 
                  value="name"
                  className={darkMode ? 'bg-gray-800 text-white' : 'bg-white text-slate-900'}
                >
                  Sort by Name
                </option>
                <option 
                  value="provider"
                  className={darkMode ? 'bg-gray-800 text-white' : 'bg-white text-slate-900'}
                >
                  Sort by Provider
                </option>
                <option 
                  value="speed"
                  className={darkMode ? 'bg-gray-800 text-white' : 'bg-white text-slate-900'}
                >
                  Sort by Speed
                </option>
                <option 
                  value="cost"
                  className={darkMode ? 'bg-gray-800 text-white' : 'bg-white text-slate-900'}
                >
                  Sort by Cost
                </option>
              </select>
              <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors duration-200 ${
                darkMode ? 'text-gray-400' : 'text-slate-400'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Models Grid/List */}
      <div className={`grid gap-5 transition-colors duration-200 ${
        viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
      }`}>
        {filteredModels.map((model) => {
          const isSelected = selectedModels.includes(model.id)
          
          return (
            <div
              key={model.id}
              onClick={() => onModelToggle(model.id)}
              className={`group relative rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                isSelected
                  ? darkMode
                    ? 'border-violet-500 shadow-lg shadow-violet-500/20'
                    : 'border-blue-500 shadow-lg shadow-blue-500/20'
                  : darkMode
                    ? 'border-gray-700 hover:border-gray-600 hover:shadow-md'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              } ${darkMode ? 'bg-gray-900' : 'bg-white'}`}
            >
              {/* Selection Indicator */}
              <div className={`absolute top-4 right-4 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                isSelected
                  ? darkMode
                    ? 'bg-gradient-to-br from-violet-600 to-purple-600 border-violet-500'
                    : 'bg-gradient-to-br from-blue-500 to-purple-500 border-blue-500'
                  : darkMode
                    ? 'border-gray-600 group-hover:border-gray-500'
                    : 'border-slate-300 group-hover:border-slate-400'
              }`}>
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </div>

              {/* Model Header */}
              <div className="p-5 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getProviderColor(model.provider)} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                      {model.displayName.charAt(0)}
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg transition-colors duration-200 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {model.displayName}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          darkMode ? 'bg-gray-800 text-gray-300' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {model.provider}
                        </span>
                        {isSelected && (
                          <div className={`flex items-center space-x-1 ${
                            darkMode ? 'text-violet-400' : 'text-blue-600'
                          }`}>
                            <Zap className="w-3 h-3" />
                            <span className="text-xs font-semibold">Active</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Model Description */}
                <p className={`text-sm mt-4 line-clamp-2 transition-colors duration-200 ${
                  darkMode ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  {model.description || 'No description available'}
                </p>
              </div>

              {/* Model Details */}
              <div className="px-5 pb-5">
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className={`rounded-xl p-3 transition-colors duration-200 ${
                    darkMode ? 'bg-gray-800' : 'bg-slate-50'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <Clock className={`w-4 h-4 transition-colors duration-200 ${
                        darkMode ? 'text-gray-500' : 'text-slate-500'
                      }`} />
                      <span className={`text-xs font-medium transition-colors duration-200 ${
                        darkMode ? 'text-gray-400' : 'text-slate-500'
                      }`}>
                        Speed
                      </span>
                    </div>
                    <div className={`text-sm font-bold mt-1 ${getSpeedColor(model.speed || 'medium')}`}>
                      {model.speed || 'Medium'}
                    </div>
                  </div>
                  
                  <div className={`rounded-xl p-3 transition-colors duration-200 ${
                    darkMode ? 'bg-gray-800' : 'bg-slate-50'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <DollarSign className={`w-4 h-4 transition-colors duration-200 ${
                        darkMode ? 'text-gray-500' : 'text-slate-500'
                      }`} />
                      <span className={`text-xs font-medium transition-colors duration-200 ${
                        darkMode ? 'text-gray-400' : 'text-slate-500'
                      }`}>
                        Cost
                      </span>
                    </div>
                    <div className={`text-sm font-bold mt-1 ${getCostColor(model.cost || 'medium')}`}>
                      {model.cost || 'Medium'}
                    </div>
                  </div>
                  
                  <div className={`rounded-xl p-3 transition-colors duration-200 ${
                    darkMode ? 'bg-gray-800' : 'bg-slate-50'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <Brain className={`w-4 h-4 transition-colors duration-200 ${
                        darkMode ? 'text-gray-500' : 'text-slate-500'
                      }`} />
                      <span className={`text-xs font-medium transition-colors duration-200 ${
                        darkMode ? 'text-gray-400' : 'text-slate-500'
                      }`}>
                        Context
                      </span>
                    </div>
                    <div className={`text-sm font-bold mt-1 transition-colors duration-200 ${
                      darkMode ? 'text-gray-300' : 'text-slate-900'
                    }`}>
                      {model.contextWindow || '32K tokens'}
                    </div>
                  </div>
                  
                  <div className={`rounded-xl p-3 transition-colors duration-200 ${
                    darkMode ? 'bg-gray-800' : 'bg-slate-50'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <Star className={`w-4 h-4 transition-colors duration-200 ${
                        darkMode ? 'text-gray-500' : 'text-slate-500'
                      }`} />
                      <span className={`text-xs font-medium transition-colors duration-200 ${
                        darkMode ? 'text-gray-400' : 'text-slate-500'
                      }`}>
                        Capabilities
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {model.capabilities?.slice(0, 2).map((cap, idx) => (
                        <div key={idx} className={darkMode ? 'text-gray-400' : 'text-slate-700'} title={cap}>
                          {getCapabilityIcon(cap)}
                        </div>
                      ))}
                      {model.capabilities && model.capabilities.length > 2 && (
                        <div className={`text-xs transition-colors duration-200 ${
                          darkMode ? 'text-gray-500' : 'text-slate-500'
                        }`}>
                          +{model.capabilities.length - 2}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hover Overlay */}
              <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity ${
                darkMode
                  ? 'bg-gradient-to-br from-violet-500/5 to-purple-500/5'
                  : 'bg-gradient-to-br from-blue-500/5 to-purple-500/5'
              } ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className={`rounded-2xl border p-6 transition-colors duration-200 ${
        darkMode 
          ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700' 
          : 'bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200/50'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-200 ${
              selectedModels.length > 0 
                ? darkMode
                  ? 'bg-gradient-to-br from-violet-600 to-purple-600'
                  : 'bg-gradient-to-br from-green-500 to-blue-500'
                : darkMode
                  ? 'bg-gray-800'
                  : 'bg-slate-200'
            }`}>
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className={`font-bold transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {selectedModels.length === 0 
                  ? 'No models selected' 
                  : `${selectedModels.length} model${selectedModels.length === 1 ? '' : 's'} ready for comparison`
                }
              </h3>
              <p className={`text-sm mt-1 transition-colors duration-200 ${
                darkMode ? 'text-gray-400' : 'text-slate-600'
              }`}>
                {selectedModels.length === 0 
                  ? 'Select at least one model to start comparing' 
                  : 'Send a message to see responses from all selected models'
                }
              </p>
            </div>
          </div>
          
          {selectedModels.length > 0 && (
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
              darkMode 
                ? 'bg-violet-900/30 text-violet-400' 
                : 'bg-green-100 text-green-800'
            }`}>
              <Zap className="w-4 h-4" />
              <span className="font-medium text-sm">Ready for Comparison</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}