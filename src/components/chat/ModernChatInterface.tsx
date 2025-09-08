'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Settings, Plus, MessageSquare, History, Sparkles, Brain } from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { AI_MODELS } from '@/config/ai-models'
import AIResponseCard from './AIResponseCard'
import ModelSelector from './ModelSelector'
import ProfileDropdown from '../layout/ProfileDropdown'
import Link from 'next/link'

interface ChatResponse {
  model: string
  content: string
  error?: string
  success: boolean
}

interface ChatSession {
  id: string
  message: string
  responses: ChatResponse[]
  timestamp: Date
  bestResponse?: string
}

export default function ModernChatInterface() {
  const { darkMode, toggleDarkMode } = useDarkMode()
  const [message, setMessage] = useState('')
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [loading, setLoading] = useState<string[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>(
    AI_MODELS.slice(0, 3).map(model => model.id)
  )
  const [showModelSelector, setShowModelSelector] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [message])

  const handleNewChat = () => {
    setCurrentSession(null)
    setMessage('')
    setLoading([])
  }

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

    const currentMsg = message.trim()
    setLoading(selectedModels)
    
    // Create new session
    const newSession: ChatSession = {
      id: Date.now().toString(),
      message: currentMsg,
      responses: [],
      timestamp: new Date()
    }
    
    setCurrentSession(newSession)
    setMessage('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMsg,
          models: selectedModels
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      
      // Update session with responses
      setCurrentSession(prev => prev ? {
        ...prev,
        responses: data.responses
      } : null)
      
      // Save conversation to history
      try {
        const saveResponse = await fetch('/api/conversations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: currentMsg,
            responses: data.responses,
            bestResponseModel: null
          })
        })
        
        if (saveResponse.ok) {
          const saveData = await saveResponse.json()
          console.log('Conversation saved successfully:', saveData.conversationId)
        }
      } catch (error) {
        console.error('Error saving conversation:', error)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorResponses = selectedModels.map(model => ({
        model,
        content: '',
        error: 'Failed to send message',
        success: false
      }))
      
      setCurrentSession(prev => prev ? {
        ...prev,
        responses: errorResponses
      } : null)
    } finally {
      setLoading([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const handleMarkBest = (modelId: string) => {
    setCurrentSession(prev => {
      if (!prev) return null
      const newBestResponse = prev.bestResponse === modelId ? undefined : modelId
      return {
        ...prev,
        bestResponse: newBestResponse
      }
    })
  }

  const getModelById = (modelId: string) => {
    return AI_MODELS.find(model => model.id === modelId)
  }

  const getResponseForModel = (modelId: string) => {
    return currentSession?.responses.find(response => response.model === modelId)
  }

  const suggestedPrompts = [
    "Explain quantum computing in simple terms",
    "Write a creative story about time travel", 
    "Compare the benefits of renewable energy",
    "Create a business plan for a tech startup"
  ]

  return (
    <div className={`flex h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      {/* Left Sidebar */}
      <div className={`w-80 backdrop-blur-xl border-r transition-colors duration-200 relative ${
        darkMode 
          ? 'bg-gray-800/80 border-gray-700' 
          : 'bg-white/80 border-slate-200/50'
      }`}>
        {/* Sidebar Content Container */}
        <div className="flex flex-col h-full pb-20"> {/* Added bottom padding for dropdown */}
        {/* Header with Logo */}
        <div className={`p-6 border-b transition-colors duration-200 ${
          darkMode ? 'border-gray-700' : 'border-slate-200/30'
        }`}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-colors duration-200 ${
                darkMode 
                  ? 'from-white to-gray-200' 
                  : 'from-slate-900 to-slate-700'
              }`}>
                AI Fiesta
              </h1>
              <p className={`text-xs transition-colors duration-200 ${
                darkMode ? 'text-gray-400' : 'text-slate-500'
              }`}>
                Compare AI Models
              </p>
            </div>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center space-x-3 px-4 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] group"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span>New Comparison</span>
          </button>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-2">
          <Link
            href="/chat"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              darkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <MessageSquare className="w-5 h-5 transition-colors group-hover:text-blue-600" />
            <span className="font-medium">Current Chat</span>
          </Link>
          
          <Link
            href="/history"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              darkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <History className="w-5 h-5 transition-colors group-hover:text-blue-600" />
            <span className="font-medium">History</span>
          </Link>
        </div>

        {/* Current Session Preview */}
        {currentSession && (
          <div className={`p-4 border-t transition-colors duration-200 ${
            darkMode ? 'border-gray-700' : 'border-slate-200/30'
          }`}>
            <div className={`rounded-xl p-4 border transition-colors duration-200 ${
              darkMode 
                ? 'bg-blue-900/20 border-blue-700/30' 
                : 'bg-blue-50/50 border-blue-200/30'
            }`}>
              <h3 className={`text-sm font-semibold mb-2 flex items-center transition-colors duration-200 ${
                darkMode ? 'text-gray-300' : 'text-slate-700'
              }`}>
                <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
                Current Session
              </h3>
              <p className={`text-xs line-clamp-2 mb-3 transition-colors duration-200 ${
                darkMode ? 'text-gray-400' : 'text-slate-600'
              }`}>
                {currentSession.message}
              </p>
              <div className={`flex items-center justify-between text-xs transition-colors duration-200 ${
                darkMode ? 'text-gray-500' : 'text-slate-500'
              }`}>
                <span>{currentSession.responses.length} responses</span>
                <span>{currentSession.timestamp.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        )}
        </div>
        
        {/* Profile Dropdown at Bottom - Fixed Position */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-800/95 border-gray-700 backdrop-blur-xl' 
            : 'bg-white/95 border-slate-200/30 backdrop-blur-xl'
        }`}>
          <ProfileDropdown 
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar with Model Selection */}
        <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium">
                {selectedModels.length} models selected
              </div>
              <button
                onClick={() => setShowModelSelector(!showModelSelector)}
                className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all duration-200 hover:shadow-md"
              >
                <Settings className="w-4 h-4 text-slate-600" />
                <span className="text-slate-700 font-medium">Configure Models</span>
              </button>
            </div>
          </div>

          {/* Model Selector Dropdown */}
          {showModelSelector && (
            <div className="mt-4 p-4 bg-white rounded-2xl border border-slate-200/50 shadow-lg">
              <ModelSelector 
                selectedModels={selectedModels}
                onModelToggle={handleModelToggle}
              />
            </div>
          )}
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-hidden">
          {currentSession ? (
            <div className="h-full flex flex-col">
              {/* User Message */}
              <div className="border-b border-slate-200/30 bg-white/30 p-6">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">You</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900 font-medium">{currentSession.message}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentSession.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Responses */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className={`grid gap-6 max-w-7xl mx-auto ${
                  selectedModels.length === 1 ? 'grid-cols-1 max-w-4xl' :
                  selectedModels.length === 2 ? 'grid-cols-1 lg:grid-cols-2' :
                  selectedModels.length === 3 ? 'grid-cols-1 lg:grid-cols-3' :
                  selectedModels.length <= 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
                  selectedModels.length <= 6 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                  'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}>
                  {selectedModels.map((modelId) => {
                    const model = getModelById(modelId)
                    const response = getResponseForModel(modelId)
                    const isLoading = loading.includes(modelId)
                    
                    if (!model) return null

                    return (
                      <AIResponseCard
                        key={modelId}
                        model={model}
                        content={response?.content || ''}
                        loading={isLoading}
                        error={response?.error}
                        isBestResponse={currentSession?.bestResponse === modelId}
                        onMarkBest={() => handleMarkBest(modelId)}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            // Welcome State
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center max-w-2xl">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Start Your AI Comparison
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Send one message to multiple AI models and compare their responses side by side. 
                  Click "New Comparison" to begin or try one of the suggested prompts below.
                </p>
                
                {/* Suggested Prompts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setMessage(prompt)}
                      className="p-4 text-left bg-white/60 hover:bg-white/80 border border-slate-200/50 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-200">
                          <Sparkles className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-slate-700 text-sm font-medium">{prompt}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-slate-200/30 bg-white/60 backdrop-blur-sm p-6">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything to compare AI models... (Enter to send, Shift+Enter for new line)"
                  className="w-full px-6 py-4 bg-white border border-slate-200/50 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-900 placeholder:text-slate-500"
                  rows={1}
                  style={{ minHeight: '56px', maxHeight: '120px' }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-slate-600">
                    {selectedModels.length === 0 
                      ? 'Select models to start comparing' 
                      : `${selectedModels.length} model${selectedModels.length === 1 ? '' : 's'} ready`
                    }
                  </div>
                  {loading.length > 0 && (
                    <div className="flex items-center space-x-2 text-sm text-blue-600">
                      <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={!message.trim() || selectedModels.length === 0 || loading.length > 0}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}