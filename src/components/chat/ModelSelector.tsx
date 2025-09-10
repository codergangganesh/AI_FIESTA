'use client'

import { useState } from 'react'
import { AIModel } from '@/types/app'
import { AI_MODELS } from '@/config/ai-models'
import { Settings, Check, Brain, Zap, X, Star, Code, Image, FileText, DollarSign, Clock } from 'lucide-react'

interface ModelSelectorProps {
  selectedModels: string[]
  onModelToggle: (modelId: string) => void
}

export default function ModelSelector({ selectedModels, onModelToggle }: ModelSelectorProps) {
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

  const getProviderBadgeColor = (provider: string) => {
    const colors = {
      'Google': 'bg-blue-100 text-blue-700',
      'Anthropic': 'bg-orange-100 text-orange-700',
      'OpenAI': 'bg-green-100 text-green-700',
      'Meta': 'bg-purple-100 text-purple-700',
      'DeepSeek': 'bg-pink-100 text-pink-700',
      'Qwen': 'bg-red-100 text-red-700',
      'Grok': 'bg-gray-100 text-gray-700',
      'Kimi': 'bg-cyan-100 text-cyan-700',
      'Shisa': 'bg-pink-100 text-pink-700'
    }
    return colors[provider as keyof typeof colors] || 'bg-slate-100 text-slate-700'
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">AI Models</h3>
            <p className="text-sm text-slate-600">Select models to compare</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
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
            className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
          >
            {selectedModels.length === AI_MODELS.length ? 'Deselect All' : 'Select All'}
          </button>
          
          <div className="px-3 py-1 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 text-xs font-bold rounded-lg">
            {selectedModels.length} / {AI_MODELS.length}
          </div>
        </div>
      </div>

      {/* Model Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {AI_MODELS.map((model) => {
          const isSelected = selectedModels.includes(model.id)
          
          return (
            <div
              key={model.id}
              onClick={() => onModelToggle(model.id)}
              className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 shadow-lg scale-105'
                  : 'bg-white/60 hover:bg-white/80 border border-slate-200/50 hover:shadow-md hover:scale-102'
              }`}
            >
              {/* Selection Indicator */}
              <div className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-br from-blue-500 to-purple-500 border-blue-500'
                  : 'border-slate-300 group-hover:border-slate-400'
              }`}>
                {isSelected && (
                  <Check className="w-4 h-4 text-white absolute top-0.5 left-0.5" />
                )}
              </div>

              {/* Model Avatar */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getProviderColor(model.provider)} flex items-center justify-center text-white font-bold text-lg mb-3 shadow-lg`}>
                {model.displayName.charAt(0)}
              </div>

              {/* Model Info */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm leading-tight">
                  {model.displayName}
                </h4>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    getProviderBadgeColor(model.provider)
                  }`}>
                    {model.provider}
                  </span>
                  
                  {isSelected && (
                    <div className="flex items-center space-x-1 text-blue-600">
                      <Zap className="w-3 h-3" />
                      <span className="text-xs font-semibold">Active</span>
                    </div>
                  )}
                </div>
                
                {/* Enhanced Model Details */}
                {model.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 mt-2">
                    {model.description}
                  </p>
                )}
                
                {/* Model Stats */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
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
                  
                  {/* Capabilities */}
                  <div className="flex space-x-1">
                    {model.capabilities?.slice(0, 3).map((cap, idx) => (
                      <div key={idx} className="text-slate-500" title={cap}>
                        {getCapabilityIcon(cap)}
                      </div>
                    ))}
                    {model.capabilities && model.capabilities.length > 3 && (
                      <div className="text-xs text-slate-500">+{model.capabilities.length - 3}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'
                  : 'group-hover:bg-gradient-to-br group-hover:from-blue-500/5 group-hover:to-purple-500/5'
              }`} />
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200/50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {selectedModels.length === 0 
                ? 'No models selected'
                : `${selectedModels.length} model${selectedModels.length === 1 ? '' : 's'} ready to compare`
              }
            </p>
            <p className="text-xs text-slate-600">
              {selectedModels.length === 0 
                ? 'Select at least one model to start'
                : 'Ready to receive your message'
              }
            </p>
          </div>
        </div>
        
        {selectedModels.length > 0 && (
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-600">Ready</span>
          </div>
        )}
      </div>
    </div>
  )
}