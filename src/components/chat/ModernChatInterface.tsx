'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Settings, Plus, MessageSquare, Sparkles, Brain, BarChart3, History, Activity } from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useAuth } from '@/contexts/AuthContext'
import { AI_MODELS } from '@/config/ai-models'
import AIResponseCard from './AIResponseCard'
import ModelSelector from './ModelSelector'
import ModelsDropdown from '@/components/layout/ModelsDropdown'
// ProfileDropdown is not present; hide its usage for now
import DeleteAccountDialog from '../auth/DeleteAccountDialog'
import ProfileDropdown from '@/components/layout/ProfileDropdown'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import BlankComparisonPage from './BlankComparisonPage'
import { comparisonService } from '@/lib/supabase'

interface ChatResponse {
  model: string
  content: string
  error?: string
  success: boolean
  responseTime?: number // Add response time to the interface
}

interface ChatSession {
  id: string
  message: string
  responses: ChatResponse[]
  timestamp: Date
  selectedModels: string[]  // Store selected models per session
  bestResponse?: string
  responseTime?: number // Add response time to session
}

// Add interface for component props
interface ModernChatInterfaceProps {}

export default function ModernChatInterface({}: ModernChatInterfaceProps) {
  const { darkMode, toggleDarkMode } = useDarkMode()
  const { user } = useAuth()
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [loading, setLoading] = useState<string[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>(
    AI_MODELS.slice(0, 3).map(model => model.id)
  )
  const [showModelSelector, setShowModelSelector] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [showBlankPage, setShowBlankPage] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  // Create a ref to store the user ID
  const userIdRef = useRef<string | null>(null)
  
  // Effect to handle user ID changes
  useEffect(() => {
    if (user && user.id !== userIdRef.current) {
      // User ID changed, clear chat sessions
      setChatSessions([])
      userIdRef.current = user.id
    }
  }, [user]) // This is safe now as we only care about the user object

  // Load chat sessions from localStorage on component mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('aiFiestaChatSessions')
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions)
        // Convert timestamp strings back to Date objects
        const sessionsWithDates: ChatSession[] = parsedSessions.map((session: any) => ({
          ...session,
          timestamp: new Date(session.timestamp),
          selectedModels: session.selectedModels || [] // Ensure selectedModels exists
        }))
        setChatSessions(sessionsWithDates)
        
        // Set the most recent session as the current session
        if (sessionsWithDates.length > 0 && !currentSessionId) {
          const mostRecentSession = sessionsWithDates.reduce((latest: ChatSession, session: ChatSession) => 
            session.timestamp > latest.timestamp ? session : latest,
            sessionsWithDates[0]
          )
          setCurrentSessionId(mostRecentSession.id)
        }
      } catch (e) {
        console.error('Failed to parse saved sessions:', e)
      }
    }
  }, []) // Empty dependency array since we only want this to run once

  // initial conversation handling removed for simplified UI

  // Save chat sessions to localStorage whenever they change
  useEffect(() => {
    if (chatSessions.length > 0) {
      // When saving, convert Date objects to strings
      const sessionsToSave = chatSessions.map(session => ({
        ...session,
        timestamp: session.timestamp.toISOString(),
        selectedModels: session.selectedModels
      }))
      localStorage.setItem('aiFiestaChatSessions', JSON.stringify(sessionsToSave))
    }
  }, [chatSessions])

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [message])

  const handleNewChat = async () => {
    // Instead of clearing everything, just show the blank page
    setShowBlankPage(true)
    // Clear the message input
    setMessage('')
  }

  // Function to start a new comparison from the blank page
  const startNewComparison = () => {
    // Clear chat sessions from state and localStorage
    setChatSessions([])
    setCurrentSessionId(null)
    localStorage.removeItem('aiFiestaChatSessions')
    setShowBlankPage(false)
  }

  // edit conversation functionality removed in this version

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
    
    // Create new session with current selected models
    const newSessionId = Date.now().toString()
    const newSession: ChatSession = {
      id: newSessionId,
      message: currentMsg,
      responses: [],
      timestamp: new Date(),
      selectedModels: [...selectedModels]  // Store the models selected for this session
    }
    
    // Add to sessions list
    setChatSessions(prev => [...prev, newSession])
    setCurrentSessionId(newSessionId)
    setMessage('')

    try {
      // Update API usage counter before making the API call
      if (user) {
        const supabase = createClient()
        const { error: usageError } = await supabase.rpc('update_user_usage', {
          p_user_id: user.id,
          p_type: 'apiCalls',
          p_amount: 1
        })
        
        if (usageError) {
          console.error('Error updating API usage:', usageError)
        }
      }

      const startTime = Date.now() // Track start time

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

      const endTime = Date.now() // Track end time
      const responseTime = (endTime - startTime) / 1000 // Calculate response time in seconds

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      
      // Update session with responses and response time
      setChatSessions(prev => prev.map(session => 
        session.id === newSessionId 
          ? { 
              ...session, 
              responses: data.responses,
              responseTime: data.responseTime || responseTime // Use API response time or calculated time
            } 
          : session
      ))
      
      // Save comparison to Supabase
      if (user && data.responses && data.responses.length > 0) {
        try {
          await comparisonService.saveComparison({
            prompt: currentMsg,
            selectedModels: selectedModels,
            responses: data.responses.map((response: any) => ({
              modelId: response.model,
              content: response.content,
              success: response.success,
              error: response.error,
              wordCount: response.content?.split(' ').length,
              latency: response.responseTime || responseTime * 1000,
              cost: 0.01 // Mock cost - replace with actual calculation
            }))
          })
        } catch (error) {
          console.error('Failed to save comparison to database:', error)
          // Don't throw error here as the comparison still worked
        }
      }
      
      // Conversation saving is handled in the API route, so we don't need to save it here again
      // This prevents duplicate conversations from being saved to the database
    } catch (error) {
      console.error('Error sending message:', error)
      const errorResponses = selectedModels.map(model => ({
        model,
        content: '',
        error: 'Failed to send message',
        success: false
      }))
      
      setChatSessions(prev => prev.map(session => 
        session.id === newSessionId 
          ? { ...session, responses: errorResponses } 
          : session
      ))
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
    if (!currentSessionId) return
    
    setChatSessions(prev => prev.map(session => {
      if (session.id === currentSessionId) {
        const newBestResponse = session.bestResponse === modelId ? undefined : modelId
        return {
          ...session,
          bestResponse: newBestResponse
        }
      }
      return session
    }))
  }

  const getModelById = (modelId: string) => {
    return AI_MODELS.find(model => model.id === modelId)
  }

  // Get current session
  const currentSession = chatSessions.find(session => session.id === currentSessionId) || null

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
          <div
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              darkMode 
                ? 'text-white bg-gray-700/50' 
                : 'text-slate-900 bg-slate-100/50'
            }`}
          >
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Current Chat</span>
          </div>
          
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
          
          <Link
            href="/dashboard"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              darkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <BarChart3 className="w-5 h-5 transition-colors group-hover:text-blue-600" />
            <span className="font-medium">Dashboard</span>
          </Link>
          
          <Link
            href="/usage"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              darkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <Activity className="w-5 h-5 transition-colors group-hover:text-blue-600" />
            <span className="font-medium">Usage</span>
          </Link>
        </div>

        {/* Current Session Preview Removed */}
        </div>
        
        {/* Profile Dropdown at Bottom - Fixed Position */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-800/95 border-gray-700 backdrop-blur-xl' 
            : 'bg-white/95 border-slate-200/30 backdrop-blur-xl'
        }`}>
          <div className="flex items-center justify-end">
            <ProfileDropdown 
              darkMode={darkMode}
              onToggleDarkMode={toggleDarkMode}
              onDeleteAccount={() => setIsDeleteDialogOpen(true)}
              onNewConversation={handleNewChat}
            />
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className={`backdrop-blur-sm border-b p-4 transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-800/60 border-gray-700/30' 
            : 'bg-white/60 border-slate-200/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 min-w-0">
              <ModelsDropdown 
                darkMode={darkMode}
                selectedModels={selectedModels}
                onModelToggle={handleModelToggle}
              />
              {currentSession && (
                <div className={`px-3 py-1.5 truncate max-w-[50vw] sm:max-w-md bg-gradient-to-r rounded-full text-sm font-medium transition-colors duration-200 ${
                  darkMode 
                    ? 'from-blue-900/50 to-purple-900/50 text-blue-300 border border-blue-700/30' 
                    : 'from-blue-100 to-purple-100 text-blue-700'
                }`}>
                  Comparing: {currentSession.message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-hidden">
          {showBlankPage ? (
            <BlankComparisonPage onStartNew={startNewComparison} />
          ) : chatSessions.length > 0 ? (
            <div className="h-full flex flex-col">
              {/* All Chat Sessions */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-7xl mx-auto space-y-8">
                  {chatSessions.map((session) => (
                    <div key={session.id} className={`rounded-2xl border transition-colors duration-200 ${
                      darkMode 
                        ? 'bg-gray-800/30 border-gray-700/30' 
                        : 'bg-white/30 border-slate-200/30'
                    }`}>
                      {/* User Message */}
                      <div className={`border-b p-6 transition-colors duration-200 ${
                        darkMode 
                          ? 'border-gray-700/30' 
                          : 'border-slate-200/30'
                      }`}>
                        <div className="max-w-4xl mx-auto">
                          <div className="flex items-start space-x-4">
                            <div className={`w-8 h-8 bg-gradient-to-br rounded-lg flex items-center justify-center transition-colors duration-200 ${
                              darkMode 
                                ? 'from-blue-600 to-purple-600' 
                                : 'from-slate-600 to-slate-700'
                            }`}>
                              <span className="text-white text-sm font-bold">
                                {user?.user_metadata?.full_name 
                                  ? user.user_metadata.full_name.charAt(0).toUpperCase() 
                                  : user?.email?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <p className={`font-medium transition-colors duration-200 ${
                                  darkMode ? 'text-white' : 'text-slate-900'
                                }`}>
                                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                                </p>
                              </div>
                              <p className={`mt-2 transition-colors duration-200 ${
                                darkMode ? 'text-gray-200' : 'text-slate-800'
                              }`}>{session.message}</p>
                              <p className={`text-xs mt-1 transition-colors duration-200 ${
                                darkMode ? 'text-gray-400' : 'text-slate-500'
                              }`}>
                                {session.timestamp.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI Responses */}
                      <div className="p-6">
                        <div className={`grid gap-6 ${
                          session.selectedModels.length === 1 ? 'grid-cols-1 max-w-4xl' :
                          session.selectedModels.length === 2 ? 'grid-cols-1 lg:grid-cols-2' :
                          session.selectedModels.length === 3 ? 'grid-cols-1 lg:grid-cols-3' :
                          session.selectedModels.length <= 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
                          session.selectedModels.length <= 6 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        }`}>
                          {session.selectedModels.map((modelId) => {
                            const model = getModelById(modelId)
                            const response = session.responses.find(r => r.model === modelId)
                            const isLoading = loading.includes(modelId) && session.id === currentSessionId
                            
                            if (!model) return null

                            return (
                              <AIResponseCard
                                key={`${session.id}-${modelId}`}
                                model={model}
                                content={response?.content || ''}
                                loading={isLoading}
                                error={response?.error}
                                isBestResponse={session.bestResponse === modelId}
                                onMarkBest={() => handleMarkBest(modelId)}
                                responseTime={response?.responseTime} // Pass response time to the card
                              />
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Welcome State (only shown when not in blank page mode and no sessions)
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center max-w-2xl">
                <div className={`w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl transition-transform duration-300 hover:scale-105 ${
                  darkMode ? 'shadow-blue-500/20' : 'shadow-blue-500/30'
                }`}>
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className={`text-3xl font-bold mb-4 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Start Your AI Comparison
                </h2>
                <p className={`text-lg mb-8 leading-relaxed transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Send one message to multiple AI models and compare their responses side by side. 
                  Click "New Comparison" to begin.
                </p>
                
                {/* Add a button to start a new comparison from this state too */}
                <button
                  onClick={startNewComparison}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start New Comparison
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Message Input - Only show when not on blank page */}
        {!showBlankPage && (
          <div className={`border-t backdrop-blur-sm p-6 transition-colors duration-200 ${
            darkMode 
              ? 'border-gray-700/30 bg-gray-800/60' 
              : 'border-slate-200/30 bg-white/60'
          }`}>
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything to compare AI models... (Enter to send, Shift+Enter for new line)"
                    className={`w-full px-6 py-4 border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-sm placeholder:text-slate-500 ${
                      darkMode 
                        ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 hover:bg-gray-700/70' 
                        : 'bg-white border-slate-200/50 text-slate-900 hover:border-slate-300/50'
                    }`}
                    rows={1}
                    style={{ minHeight: '56px', maxHeight: '120px' }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Only show model status when models are selected */}
                    {selectedModels.length > 0 && (
                      <div className={`text-sm transition-colors duration-200 ${
                        darkMode ? 'text-gray-300' : 'text-slate-600'
                      }`}>
                        {selectedModels.length === 1 
                          ? '1 model ready' 
                          : `${selectedModels.length} models ready`
                        }
                      </div>
                    )}
                    {loading.length > 0 && (
                      <div className={`flex items-center space-x-2 text-sm transition-colors duration-200 ${
                        darkMode ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        <div className={`w-4 h-4 border-2 rounded-full animate-spin transition-colors duration-200 ${
                          darkMode 
                            ? 'border-blue-800 border-t-blue-400' 
                            : 'border-blue-200 border-t-blue-600'
                        }`}></div>
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
        )}

        {/* Delete Account Dialog - Now rendered at the app level to overlay the entire chat interface */}
        <DeleteAccountDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
        />
      

      
        {/* Edit Conversation removed */}
      </div>
    </div>
  )
}