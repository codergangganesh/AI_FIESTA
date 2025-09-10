'use client'

import { useState } from 'react'
import { AI_MODELS } from '@/config/ai-models'
import { Brain, Search, Filter, ChevronDown, Star, Code, Image, FileText, DollarSign, Clock, Zap } from 'lucide-react'
import Link from 'next/link'
import styles from './page.module.css'

export default function ModelShowcasePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProvider, setSelectedProvider] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'provider' | 'speed' | 'cost'>('name')

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
    <div className={styles.container}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className={styles.headerBadge}>
            <Brain className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">AI Model Showcase</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6">
            All AI Models
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Explore our complete collection of premium AI models from leading providers
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 p-6 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search models or providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className={styles.selectControl}
                >
                  {providers.map(provider => (
                    <option key={provider} value={provider}>
                      {provider === 'all' ? 'All Providers' : provider}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className={styles.selectControl}
                >
                  <option value="name">Sort by Name</option>
                  <option value="provider">Sort by Provider</option>
                  <option value="speed">Sort by Speed</option>
                  <option value="cost">Sort by Cost</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model, index) => (
            <div 
              key={index} 
              className={styles.modelCard}
            >
              {/* Animated background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getProviderColor(model.provider)} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`modelAvatar bg-gradient-to-br ${getProviderColor(model.provider)} text-white`}>
                    {model.displayName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-lg">{model.displayName}</div>
                    <div className="text-sm text-slate-600 mt-1">{model.provider}</div>
                  </div>
                </div>
                
                {/* Status indicator */}
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">Active</span>
                </div>
              </div>
              
              {/* Model description */}
              <div className="relative mt-4">
                <p className="text-slate-600 text-sm line-clamp-2">
                  {model.description || 'No description available'}
                </p>
              </div>
              
              {/* Model capabilities */}
              <div className="relative mt-4 flex flex-wrap gap-2">
                {model.capabilities?.slice(0, 4).map((capability, idx) => (
                  <span 
                    key={idx} 
                    className="flex items-center space-x-1 text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full"
                  >
                    {getCapabilityIcon(capability)}
                    <span>{capability}</span>
                  </span>
                ))}
              </div>
              
              {/* Performance indicators */}
              <div className="relative mt-6 pt-4 border-t border-slate-200/50">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="text-xs text-slate-500">Speed</div>
                      <div className={`text-sm font-bold ${getSpeedColor(model.speed || 'medium')}`}>
                        {model.speed || 'Medium'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="text-xs text-slate-500">Cost</div>
                      <div className={`text-sm font-bold ${getCostColor(model.cost || 'medium')}`}>
                        {model.cost || 'Medium'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="text-xs text-slate-500">Context</div>
                      <div className="text-sm font-bold text-slate-900">
                        {model.contextWindow || '32K tokens'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="text-xs text-slate-500">Capabilities</div>
                      <div className="text-sm font-bold text-slate-900">
                        {model.capabilities?.length || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* CTA Button */}
              <div className="relative mt-6">
                <Link 
                  href="/chat"
                  className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                >
                  <span>Try This Model</span>
                  <Zap className="w-4 h-4" />
                </Link>
              </div>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-2xl transition-all duration-300"></div>
            </div>
          ))}
        </div>
        
        {/* Empty state */}
        {filteredModels.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No models found</h3>
            <p className="text-slate-600 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedProvider('all')
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}