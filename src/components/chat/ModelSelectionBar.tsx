'use client'

import { useState, useRef, useEffect } from 'react'
import { AI_MODELS } from '@/config/ai-models'
import { Search, Filter, ChevronLeft, ChevronRight, Plus, Check, X, Info, Star, Code, Image, FileText, DollarSign, Clock } from 'lucide-react'

interface ModelSelectionBarProps {
  selectedModels: string[]
  onModelToggle: (modelId: string) => void
  darkMode: boolean
}

export default function ModelSelectionBar({ selectedModels, onModelToggle, darkMode }: ModelSelectionBarProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProvider, setSelectedProvider] = useState<string>('all')
  const [showModelInfo, setShowModelInfo] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const providers = ['all', ...Array.from(new Set(AI_MODELS.map(m => m.provider)))]

  const filteredModels = AI_MODELS.filter(model => {
    const matchesSearch = model.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.provider.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProvider = selectedProvider === 'all' || model.provider === selectedProvider
    return matchesSearch && matchesProvider
  })

  const getProviderColor = (provider: string) => {
    const colors = {
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
    return colors[provider as keyof typeof colors] || 'from-slate-500 to-slate-700'
  }

  const getCapabilityIcon = (capability: string) => {
    switch (capability) {
      case 'text': return <FileText className="w-3 h-3" />
      case 'image': return <Image className="w-3 h-3" />
      case 'code': return <Code className="w-3 h-3" />
      case 'audio': return <Zap className="w-3 h-3" />
      case 'video': return <Zap className="w-3 h-3" />
      case 'document': return <FileText className="w-3 h-3" />
      case 'math': return <Star className="w-3 h-3" />
      default: return <Brain className="w-3 h-3" />
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const selectAll = () => {
    filteredModels.forEach(model => {
      if (!selectedModels.includes(model.id)) {
        onModelToggle(model.id)
      }
    })
  }

  const deselectAll = () => {
    selectedModels.forEach(modelId => {
      if (filteredModels.find(m => m.id === modelId)) {
        onModelToggle(modelId)
      }
    })
  }

  return (
    <div className={`sticky top-16 z-40 border-b transition-all duration-200 ${
      darkMode 
        ? 'bg-gray-900/95 backdrop-blur-xl border-gray-800' 
        : 'bg-white/95 backdrop-blur-xl border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controls Row */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl border transition-all ${
                darkMode 
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {/* Model Count */}
            <span className={`text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {selectedModels.length} / {filteredModels.length} selected
            </span>

            {/* Quick Actions */}
            <button
              onClick={selectAll}
              disabled={selectedModels.length === filteredModels.length}
              className={`text-sm font-medium px-3 py-1 rounded-lg transition-all ${
                darkMode 
                  ? 'text-blue-400 hover:bg-gray-800 disabled:text-gray-500' 
                  : 'text-blue-600 hover:bg-blue-50 disabled:text-gray-400'
              }`}
            >
              Select All
            </button>

            <button
              onClick={deselectAll}
              disabled={selectedModels.length === 0}
              className={`text-sm font-medium px-3 py-1 rounded-lg transition-all ${
                darkMode 
                  ? 'text-red-400 hover:bg-gray-800 disabled:text-gray-500' 
                  : 'text-red-600 hover:bg-red-50 disabled:text-gray-400'
              }`}
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* Filters Row */}
        {showFilters && (
          <div className={`pb-3 border-t ${
            darkMode ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div className="flex items-center space-x-4 pt-3">
              <span className={`text-sm font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Provider:
              </span>
              <div className="flex flex-wrap gap-2">
                {providers.map((provider) => (
                  <button
                    key={provider}
                    onClick={() => setSelectedProvider(provider)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      selectedProvider === provider
                        ? 'bg-blue-500 text-white'
                        : darkMode 
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {provider === 'all' ? 'All Providers' : provider}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Models Scroll */}
        <div className="relative py-4">
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll('left')}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full shadow-lg transition-all ${
              darkMode 
                ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700' 
                : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => scroll('right')}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full shadow-lg transition-all ${
              darkMode 
                ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700' 
                : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Models Container */}
          <div
            ref={scrollRef}
            className="flex space-x-3 overflow-x-auto scrollbar-hide px-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredModels.map((model) => {
              const isSelected = selectedModels.includes(model.id)
              return (
                <div key={model.id} className="relative flex-shrink-0">
                  <div
                    className={`relative flex items-center space-x-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 min-w-[220px] cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : darkMode 
                          ? 'border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-700' 
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => onModelToggle(model.id)}
                    onMouseEnter={() => setShowModelInfo(model.id)}
                    onMouseLeave={() => setShowModelInfo(null)}
                  >
                    {/* Model Avatar */}
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getProviderColor(model.provider)} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                      {model.displayName.charAt(0)}
                    </div>

                    {/* Model Info */}
                    <div className="flex-1 text-left">
                      <h3 className={`font-semibold text-sm ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {model.displayName}
                      </h3>
                      <p className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {model.provider}
                      </p>
                      {/* Enhanced Model Details */}
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          <Clock className={`w-3 h-3 ${getSpeedColor(model.speed || 'medium')}`} />
                          <span className={`text-xs font-medium ${getSpeedColor(model.speed || 'medium')}`}>
                            {model.speed || 'Medium'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className={`w-3 h-3 ${getCostColor(model.cost || 'medium')}`} />
                          <span className={`text-xs font-medium ${getCostColor(model.cost || 'medium')}`}>
                            {model.cost || 'Medium'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500'
                        : darkMode 
                          ? 'border-gray-600' 
                          : 'border-gray-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>

                    {/* Info Icon */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowModelInfo(showModelInfo === model.id ? null : model.id)
                      }}
                      className={`p-1 rounded-full transition-colors cursor-pointer ${
                        darkMode 
                          ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Info className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Model Info Tooltip */}
                  {showModelInfo === model.id && (
                    <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-4 rounded-lg shadow-xl border z-50 w-72 ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold">{model.displayName}</h4>
                          <p className={`text-xs mt-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {model.description || 'No description available'}
                          </p>
                        </div>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Provider:</span>
                            <span>{model.provider}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Speed:</span>
                            <span className={getSpeedColor(model.speed || 'medium')}>
                              {model.speed || 'Medium'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Cost:</span>
                            <span className={getCostColor(model.cost || 'medium')}>
                              {model.cost || 'Medium'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Context:</span>
                            <span>{model.contextWindow || '32K tokens'}</span>
                          </div>
                          
                          {/* Capabilities */}
                          {model.capabilities && model.capabilities.length > 0 && (
                            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Capabilities:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {model.capabilities.map((cap, idx) => (
                                  <span 
                                    key={idx} 
                                    className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"
                                  >
                                    {getCapabilityIcon(cap)}
                                    <span>{cap}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Add Model Button */}
            <button className={`flex-shrink-0 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl border-2 border-dashed transition-all min-w-[120px] ${
              darkMode 
                ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300' 
                : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600'
            }`}>
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Model</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}