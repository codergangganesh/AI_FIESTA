'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Upload, Mic, Play, Download, Loader2, Sparkles, FileText } from 'lucide-react'
import { AI_MODELS } from '@/config/ai-models'
import AIResponseCard from './AIResponseCard'
import ModelSelectionBar from './ModelSelectionBar'
import Header from '../layout/Header'
import { useDarkMode } from '@/contexts/DarkModeContext'

interface ChatResponse {
  model: string
  content: string
  error?: string
  success: boolean
  wordCount?: number
  latency?: number
  cost?: number
}

export default function EnhancedChatInterface() {
  const { darkMode } = useDarkMode()
  const [message, setMessage] = useState('')
  const [responses, setResponses] = useState<ChatResponse[]>([])
  const [loading, setLoading] = useState<string[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>(
    AI_MODELS.slice(0, 3).map(model => model.id)
  )
  const [bestResponse, setBestResponse] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [progress, setProgress] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const suggestedPrompts = [
    'Explain quantum computing',
    'Creative story',
    'Benefits of AI',
    'Startup plan',
    'Code optimization',
    'Marketing strategy'
  ]

  const popularPrompts = [
    'How does machine learning work?',
    'Write a business proposal for sustainable energy',
    'Explain blockchain technology simply',
    'Create a workout plan for beginners'
  ]

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [message])

  const handleModelToggle = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || selectedModels.length === 0) return

    setLoading(selectedModels)
    setResponses([])
    setBestResponse(null)
    setProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90))
    }, 200)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim(), models: selectedModels })
      })

      if (!response.ok) throw new Error('Failed to send message')
      
      const data = await response.json()
      const enhancedResponses = data.responses.map((r: any) => ({
        ...r,
        wordCount: r.content?.split(' ').length || 0,
        latency: Math.random() * 2000 + 500,
        cost: Math.random() * 0.05 + 0.01
      }))
      
      setResponses(enhancedResponses)
      clearInterval(progressInterval)
      setProgress(100)
      
      // Save to history
      await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.trim(),
          responses: enhancedResponses,
          bestResponseModel: bestResponse
        })
      })
    } catch (error) {
      console.error('Error:', error)
      clearInterval(progressInterval)
      const errorResponses = selectedModels.map(model => ({
        model, content: '', error: 'Failed to send message', success: false
      }))
      setResponses(errorResponses)
    } finally {
      setLoading([])
      setMessage('')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setMessage(e.target?.result as string)
      reader.readAsText(file)
    }
  }

  const toggleDarkMode = () => setDarkMode(!darkMode)

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <ModelSelectionBar 
        selectedModels={selectedModels} 
        onModelToggle={handleModelToggle}
        darkMode={darkMode}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        {responses.length === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-3 space-y-8">
              <div>
                <h1 className={`text-4xl lg:text-6xl font-bold mb-4 ${
                  darkMode 
                    ? 'text-white' 
                    : 'bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent'
                }`}>
                  Compare AI Models
                  <span className="block text-3xl lg:text-5xl text-blue-500">Instantly</span>
                </h1>
                <p className={`text-xl mb-8 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Send one prompt to multiple AI models and analyze responses side by side.
                </p>
              </div>

              {/* Popular Prompts */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Popular Prompts:
                </h3>
                <div className="space-y-2">
                  {popularPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setMessage(prompt)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all hover:scale-105 ${
                        darkMode 
                          ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700' 
                          : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm'
                      }`}
                    >
                      <FileText className="w-4 h-4 inline mr-2" />
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Suggestions */}
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(prompt)}
                    className={`px-3 py-1 rounded-full text-xs transition-all ${
                      darkMode 
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' 
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                    }`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 flex items-center justify-center">
              <div className={`w-64 h-64 rounded-3xl flex items-center justify-center ${
                darkMode 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
                  : 'bg-gradient-to-br from-blue-100 to-purple-100'
              }`}>
                <div className="text-center">
                  <Sparkles className={`w-16 h-16 mx-auto mb-4 ${
                    darkMode ? 'text-blue-400' : 'text-blue-500'
                  }`} />
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Type prompt → Select models → Compare outputs
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {loading.length > 0 && (
          <div className={`mb-6 p-4 rounded-xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Generating responses... {Math.round(progress)}%
              </span>
              <span className={`text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {loading.length} models active
              </span>
            </div>
            <div className={`w-full bg-gray-200 rounded-full h-2 ${
              darkMode ? 'bg-gray-700' : ''
            }`}>
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Results Section */}
        {responses.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Comparison Results
              </h2>
              <button className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}>
                <Download className="w-4 h-4" />
                <span>Export All</span>
              </button>
            </div>
            
            <div className={`grid gap-6 ${
              selectedModels.length === 1 ? 'grid-cols-1 max-w-4xl mx-auto' :
              selectedModels.length === 2 ? 'grid-cols-1 lg:grid-cols-2' :
              selectedModels.length === 3 ? 'grid-cols-1 lg:grid-cols-3' :
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }`}>
              {selectedModels.map((modelId) => {
                const model = AI_MODELS.find(m => m.id === modelId)
                const response = responses.find(r => r.model === modelId)
                const isLoading = loading.includes(modelId)
                
                if (!model) return null

                return (
                  <AIResponseCard
                    key={modelId}
                    model={model}
                    content={response?.content || ''}
                    loading={isLoading}
                    error={response?.error}
                    isBestResponse={bestResponse === modelId}
                    onMarkBest={() => setBestResponse(bestResponse === modelId ? null : modelId)}
                    darkMode={darkMode}
                    metrics={{
                      wordCount: response?.wordCount || 0,
                      latency: response?.latency || 0,
                      cost: response?.cost || 0
                    }}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* Universal Input */}
        <div className={`sticky bottom-4 mx-auto max-w-4xl p-6 rounded-2xl border shadow-2xl ${
          darkMode 
            ? 'bg-gray-800/95 backdrop-blur-xl border-gray-700' 
            : 'bg-white/95 backdrop-blur-xl border-gray-200'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="🔍 Ask your question or paste your prompt..."
                className={`w-full px-4 py-4 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  darkMode 
                    ? 'bg-gray-900 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                }`}
                rows={1}
                style={{ minHeight: '56px', maxHeight: '120px' }}
              />
              
              <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-2 rounded-lg transition-all ${
                    darkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                </button>
                
                <button
                  type="button"
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-2 rounded-lg transition-all ${
                    isRecording 
                      ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                      : darkMode 
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {selectedModels.length === 0 
                  ? 'Select models above to start comparing' 
                  : `${selectedModels.length} model${selectedModels.length === 1 ? '' : 's'} ready to compare`
                }
              </div>
              
              <button
                type="submit"
                disabled={!message.trim() || selectedModels.length === 0 || loading.length > 0}
                className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {loading.length > 0 ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
                <span>{loading.length > 0 ? 'Comparing...' : 'Compare'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}