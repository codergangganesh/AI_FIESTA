'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Settings, Zap } from 'lucide-react'
import { AI_MODELS } from '@/config/ai-models'
import AIResponseCard from './AIResponseCard'
import ModelSelector from './ModelSelector'

interface ChatResponse {
  model: string
  content: string
  error?: string
  success: boolean
}


export default function ChatInterface() {
  const [message, setMessage] = useState('')
  const [responses, setResponses] = useState<ChatResponse[]>([])
  const [loading, setLoading] = useState<string[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>(
    AI_MODELS.slice(0, 3).map(model => model.id) // Default to first 3 models
  )
  const [bestResponse, setBestResponse] = useState<string | null>(null)
  const [showModelSelector, setShowModelSelector] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [messageCount, setMessageCount] = useState(0)
  const [currentMessage, setCurrentMessage] = useState('') // Store the current message being processed
  const [conversationId, setConversationId] = useState<string | null>(null) // Store current conversation ID

  useEffect(() => {
    // Auto-resize textarea
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

    const currentMsg = message.trim()
    setCurrentMessage(currentMsg) // Store the message before clearing it
    setLoading(selectedModels)
    setResponses([])
    setBestResponse(null)
    setConversationId(null)
    setMessageCount(prev => prev + 1)
    setMessage('') // Clear the input immediately for better UX

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
      setResponses(data.responses)
      
      // Save conversation to history after getting responses
      try {
        const saveResponse = await fetch('/api/conversations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: currentMsg,
            responses: data.responses,
            bestResponseModel: null // No best response selected yet
          })
        })
        
        if (saveResponse.ok) {
          const saveData = await saveResponse.json()
          setConversationId(saveData.conversationId)
          console.log('Conversation saved successfully:', saveData.conversationId)
        } else {
          console.error('Failed to save conversation:', await saveResponse.text())
        }
      } catch (error) {
        console.error('Error saving conversation:', error)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Set error for all models
      const errorResponses = selectedModels.map(model => ({
        model,
        content: '',
        error: 'Failed to send message',
        success: false
      }))
      setResponses(errorResponses)
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

  const handleMarkBest = async (modelId: string) => {
    const newBestResponse = bestResponse === modelId ? null : modelId
    setBestResponse(newBestResponse)
    
    // If we have a conversation ID and responses, update the best response in the database
    if (conversationId && responses.length > 0) {
      const currentResponse = responses.find(r => r.model === modelId)
      if (currentResponse && currentResponse.success) {
        try {
          // Save updated conversation with new best response
          await fetch('/api/conversations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: currentMessage,
              responses: responses,
              bestResponseModel: newBestResponse
            })
          })
          console.log('Best response updated successfully')
        } catch (error) {
          console.error('Error updating best response:', error)
        }
      }
    }
  }

  const getModelById = (modelId: string) => {
    return AI_MODELS.find(model => model.id === modelId)
  }

  const getResponseForModel = (modelId: string) => {
    return responses.find(response => response.model === modelId)
  }

  const suggestedPrompts = [
    "Explain quantum computing in simple terms",
    "Write a creative story about time travel",
    "Compare the benefits of renewable energy",
    "Create a business plan for a tech startup"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex flex-col h-screen">
        {/* Model Selection Header */}
        <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200/30">
          <div className="max-w-7xl mx-auto px-6 py-4">
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
                  <span className="text-slate-700 font-medium">Models</span>
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
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-6">
          {/* Welcome State or Results */}
          {responses.length === 0 && messageCount === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-2xl">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Compare AI Models Instantly
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Send one message to multiple AI models and compare their responses side by side. 
                  Discover which model works best for your needs.
                </p>
                
                {/* Suggested Prompts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setMessage(prompt)}
                      className="p-4 text-left bg-white/60 hover:bg-white/80 border border-slate-200/50 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-200">
                          <Zap className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-slate-700 text-sm font-medium">{prompt}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden py-6">
              {selectedModels.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Settings className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Select AI Models</h3>
                    <p className="text-slate-500 mb-4">Choose which AI models you want to compare</p>
                    <button
                      onClick={() => setShowModelSelector(true)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                    >
                      Choose Models
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`grid gap-6 h-full ${
                  selectedModels.length === 1 ? 'grid-cols-1 max-w-4xl mx-auto' :
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
                        isBestResponse={bestResponse === modelId}
                        onMarkBest={() => handleMarkBest(modelId)}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Universal Message Input */}
          <div className="py-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything to compare AI models... (Enter to send, Shift+Enter for new line)"
                    className="w-full px-4 py-4 bg-slate-50/50 border border-slate-200/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-900 placeholder:text-slate-500"
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
                    className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Send className="w-5 h-5" />
                    <span>{loading.length > 0 ? 'Sending...' : 'Compare'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}