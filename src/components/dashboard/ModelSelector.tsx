'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { AI_MODELS } from '@/config/ai-models'
import { ChevronDown, X } from 'lucide-react'

interface ModelSelectorProps {
  selectedModels: string[]
  onModelChange: (models: string[]) => void
}

export default function ModelSelector({ selectedModels, onModelChange }: ModelSelectorProps) {
  const { darkMode } = useDarkMode()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Filter models based on search term
  const filteredModels = AI_MODELS.filter(model => 
    model.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Toggle model selection
  const toggleModel = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      onModelChange(selectedModels.filter(id => id !== modelId))
    } else {
      onModelChange([...selectedModels, modelId])
    }
  }

  // Select all models
  const selectAllModels = () => {
    onModelChange(AI_MODELS.map(model => model.id))
  }

  // Clear all selections
  const clearAllModels = () => {
    onModelChange([])
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.model-selector')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="model-selector w-full">
      <div className="relative">
        <div 
          className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-800/60 border border-gray-700/50 hover:bg-gray-800' 
              : 'bg-white/80 border border-slate-200/50 hover:bg-white'
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex flex-wrap gap-2">
            {selectedModels.length === 0 ? (
              <span className={darkMode ? 'text-gray-400' : 'text-slate-500'}>
                Select models to compare...
              </span>
            ) : (
              selectedModels.slice(0, 3).map(modelId => {
                const model = AI_MODELS.find(m => m.id === modelId)
                return (
                  <span 
                    key={modelId}
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs ${
                      darkMode 
                        ? 'bg-blue-900/30 text-blue-300' 
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {model?.displayName || model?.name || modelId}
                  </span>
                )
              })
            )}
            {selectedModels.length > 3 && (
              <span className={darkMode ? 'text-gray-400' : 'text-slate-500'}>
                +{selectedModels.length - 3} more
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {selectedModels.length > 0 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  clearAllModels()
                }}
                className={`p-1 rounded-full ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-400' 
                    : 'hover:bg-slate-200 text-slate-500'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {isOpen && (
          <div 
            className={`absolute z-10 w-full mt-2 rounded-xl shadow-lg overflow-hidden ${
              darkMode 
                ? 'bg-gray-800/95 border border-gray-700 backdrop-blur-xl' 
                : 'bg-white/95 border border-slate-200 backdrop-blur-xl'
            }`}
          >
            <div className="p-3 border-b border-gray-700/30">
              <input
                type="text"
                placeholder="Search models..."
                className={`w-full px-3 py-2 rounded-lg text-sm ${
                  darkMode 
                    ? 'bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500'
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              <div className="p-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    selectAllModels()
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg ${
                    darkMode 
                      ? 'hover:bg-gray-700/50 text-gray-300' 
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Select All Models
                </button>
              </div>
              
              {filteredModels.map(model => (
                <div 
                  key={model.id}
                  className={`flex items-center px-3 py-2 cursor-pointer ${
                    darkMode 
                      ? 'hover:bg-gray-700/50' 
                      : 'hover:bg-slate-100'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleModel(model.id)
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedModels.includes(model.id)}
                    onChange={() => {}}
                    className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className={`text-sm font-medium ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {model.displayName}
                    </div>
                    <div className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-slate-500'
                    }`}>
                      {model.provider} • {model.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}