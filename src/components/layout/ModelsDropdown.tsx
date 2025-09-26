'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronUp, Settings } from 'lucide-react'
import { AI_MODELS } from '@/config/ai-models'

interface ModelsDropdownProps {
  darkMode?: boolean
  selectedModels: string[]
  onModelToggle: (modelId: string) => void
}

export default function ModelsDropdown({ darkMode = false, selectedModels, onModelToggle }: ModelsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect()
      const height = 360
      const below = window.innerHeight - rect.bottom
      const above = rect.top
      setPosition(below < height && above > below ? 'top' : 'bottom')
    }
  }, [isOpen])

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    setIsOpen(true)
  }
  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    closeTimeoutRef.current = setTimeout(() => setIsOpen(false), 2000)
  }
  const handleDropdownMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    setIsOpen(true)
  }
  const handleDropdownMouseLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    closeTimeoutRef.current = setTimeout(() => setIsOpen(false), 2000)
  }

  const isSelected = (id: string) => selectedModels.includes(id)

  const renderLogo = (provider: string) => {
    const providerKey = provider.toLowerCase()
    const colorMap: Record<string, string> = {
      openai: 'from-emerald-400 to-teal-500',
      anthropic: 'from-rose-400 to-pink-500',
      google: 'from-amber-400 to-orange-500',
      meta: 'from-blue-500 to-indigo-500',
      deepseek: 'from-purple-500 to-fuchsia-500',
      mistral: 'from-cyan-400 to-sky-500',
      cohere: 'from-violet-400 to-purple-500',
      alibaba: 'from-red-400 to-rose-500'
    }
    const gradient = colorMap[providerKey] || 'from-slate-400 to-slate-600'
    const initials = provider.trim().slice(0, 2).toUpperCase()
    return (
      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xs font-bold text-white shadow-lg ring-1 ring-white/20`}>
        {initials}
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => {
          if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
          setIsOpen(!isOpen)
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 hover:shadow-lg group backdrop-blur-md ${
          darkMode
            ? 'bg-gradient-to-r from-gray-800/80 to-gray-700/80 hover:from-gray-700/90 hover:to-gray-600/90 border border-gray-600/50 text-gray-200'
            : 'bg-gradient-to-r from-white/90 to-slate-50/90 hover:from-white hover:to-slate-100 border border-slate-200/60 text-slate-800'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 ${
            darkMode ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'
          }`}>
            <Settings className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>AI Models</p>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
              {selectedModels.length === 0 ? 'Select models to compare' : 
               selectedModels.length === 1 ? '1 model selected' : 
               `${selectedModels.length} models selected`}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {selectedModels.length > 0 && (
            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
              darkMode ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'bg-blue-100 text-blue-700 border border-blue-200'
            }`}>
              {selectedModels.length}
            </div>
          )}
          <ChevronUp className={`w-4 h-4 transition-all duration-300 ${isOpen ? 'rotate-180' : ''} ${darkMode ? 'text-gray-300' : 'text-slate-500'}`} />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`absolute ${position === 'top' ? 'bottom-full mb-3' : 'top-full mt-3'} left-0 w-80 rounded-3xl shadow-2xl border backdrop-blur-xl z-50 overflow-hidden transition-all duration-300 ${
            darkMode
              ? 'bg-gray-800/95 border-gray-600/50 text-gray-100 shadow-gray-900/30'
              : 'bg-white/95 border-slate-200/60 text-slate-900 shadow-black/15'
          }`}
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
        >
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700/50' : 'border-slate-200/50'}`}>
            <div className="flex items-center justify-between">
              <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Select AI Models</p>
              <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-slate-100 text-slate-600'
              }`}>
                {selectedModels.length}/8
              </div>
            </div>
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
              Choose up to 8 models to compare responses
            </p>
          </div>
          <div className="max-h-80 overflow-y-auto p-3 space-y-2">
            {AI_MODELS.map(model => (
              <button
                key={model.id}
                onClick={() => onModelToggle(model.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                  isSelected(model.id)
                    ? darkMode
                      ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-2 border-blue-500/50 text-blue-200 shadow-lg'
                      : 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 text-blue-800 shadow-lg'
                    : darkMode
                      ? 'hover:bg-gray-700/50 text-gray-300 border border-gray-600/30 hover:border-gray-500/50'
                      : 'hover:bg-slate-100/70 text-slate-700 border border-slate-200/50 hover:border-slate-300/70'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 ${
                    isSelected(model.id) ? 'ring-2 ring-blue-400/50' : ''
                  }`}>
                    {renderLogo(model.provider)}
                  </div>
                  <div className="flex flex-col min-w-0 text-left">
                    <span className="font-bold text-sm leading-4 truncate">{model.displayName}</span>
                    <span className={`text-xs leading-3 truncate ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      {model.provider}
                    </span>
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  isSelected(model.id)
                    ? darkMode 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-blue-600 text-white shadow-md'
                    : darkMode 
                      ? 'bg-gray-600/50 text-gray-300 border border-gray-500/30' 
                      : 'bg-slate-200 text-slate-600 border border-slate-300'
                }`}>
                  {isSelected(model.id) ? '✓ Selected' : 'Select'}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


