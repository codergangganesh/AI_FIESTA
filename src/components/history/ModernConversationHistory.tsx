'use client'

import { useState, useEffect } from 'react'
import { Conversation } from '@/types/app'
import { AI_MODELS } from '@/config/ai-models'
import { formatDistanceToNow } from 'date-fns'
import { MessageSquare, Trash2, Star, Clock, Copy, Check, Search, Grid, List, ChevronDown, SortDesc, Plus, History, Brain, Sparkles, X } from 'lucide-react'
import Link from 'next/link'
import { useDarkMode } from '@/contexts/DarkModeContext'
import ProfileDropdown from '@/components/layout/ProfileDropdown'

// Add CSS for the fade-in animation
const fadeInKeyframes = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
`

export default function ModernConversationHistory() {
  const { darkMode, toggleDarkMode } = useDarkMode()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [copiedResponse, setCopiedResponse] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'responses'>('recent')
  // Add state for delete confirmation message
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false)
  // Add state for delete confirmation popup
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteConversation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return

    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setConversations(prev => prev.filter(conv => conv.id !== id))
        if (selectedConversation?.id === id) {
          setSelectedConversation(null)
        }
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
  }

  // Add function to delete all conversations
  const deleteAllConversations = async () => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setConversations([])
        setSelectedConversation(null)
        // Close confirmation popup
        setShowDeleteConfirm(false)
        // Show success message
        setShowDeleteSuccess(true)
        // Hide success message after 3 seconds
        setTimeout(() => setShowDeleteSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Error deleting all conversations:', error)
    }
  }

  const copyResponse = async (text: string, responseId: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedResponse(responseId)
    setTimeout(() => setCopiedResponse(null), 2000)
  }

  const getModelDisplayName = (modelId: string) => {
    const model = AI_MODELS.find(m => m.id === modelId)
    return model?.displayName || modelId
  }

  const filteredConversations = conversations
    .filter(conv => 
      conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.message.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'responses':
          return (b.responses?.length || 0) - (a.responses?.length || 0)
        default: // recent
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
      }`}>
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className={`w-20 h-20 border-4 rounded-full animate-spin transition-colors duration-200 ${
              darkMode 
                ? 'border-blue-800 border-t-blue-400' 
                : 'border-blue-200 border-t-blue-600'
            }`}></div>
            <div className={`absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-spin transition-colors duration-200 ${
              darkMode 
                ? 'border-r-purple-400' 
                : 'border-r-purple-400'
            }`} style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
          </div>
          <div className="text-center">
            <h3 className={`text-xl font-bold mb-2 transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>Loading Your Conversations</h3>
            <p className={`font-medium transition-colors duration-200 ${
              darkMode ? 'text-gray-300' : 'text-slate-600'
            }`}>Gathering your chat history...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      {/* Add CSS for fade-in animation */}
      <style>{fadeInKeyframes}</style>
      
      {/* Left Sidebar - Same as Chat */}
      <div className={`w-80 backdrop-blur-xl border-r transition-colors duration-200 relative ${
        darkMode 
          ? 'bg-gray-800/80 border-gray-700/50' 
          : 'bg-white/80 border-slate-200/50'
      }`}>
        {/* Sidebar Content Container */}
        <div className="flex flex-col h-full pb-20"> {/* Added bottom padding for dropdown */}
        {/* Header with Logo */}
        <div className={`p-6 border-b transition-colors duration-200 ${
          darkMode ? 'border-gray-700/30' : 'border-slate-200/30'
        }`}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent'
              }`}>
                AI Fiesta
              </h1>
              <p className={`text-xs transition-colors duration-200 ${
                darkMode ? 'text-gray-400' : 'text-slate-500'
              }`}>Compare AI Models</p>
            </div>
          </div>

          {/* New Chat Button */}
          <Link
            href="/chat"
            className="w-full flex items-center justify-center space-x-3 px-4 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] group"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span>New Comparison</span>
          </Link>
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
          
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl border transition-colors duration-200 ${
            darkMode 
              ? 'text-white bg-blue-900/50 border-blue-700/30' 
              : 'text-slate-900 bg-blue-100/50 border-blue-200/30'
          }`}>
            <History className="w-5 h-5 text-blue-600" />
            <span className="font-medium">History</span>
          </div>
        </div>

        {/* Stats */}
        <div className={`p-4 border-t transition-colors duration-200 ${
          darkMode ? 'border-gray-700/30' : 'border-slate-200/30'
        }`}>
          <div className={`rounded-xl p-4 border transition-colors duration-200 ${
            darkMode 
              ? 'bg-blue-900/20 border-blue-700/30' 
              : 'bg-blue-50/50 border-blue-200/30'
          }`}>
            <h3 className={`text-sm font-semibold mb-3 flex items-center transition-colors duration-200 ${
              darkMode ? 'text-gray-300' : 'text-slate-700'
            }`}>
              <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
              Your Status
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className={`transition-colors duration-200 ${
                  darkMode ? 'text-gray-400' : 'text-slate-600'
                }`}>Total Conversations</span>
                <span className={`font-semibold transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>{conversations.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className={`transition-colors duration-200 ${
                  darkMode ? 'text-gray-400' : 'text-slate-600'
                }`}>AI Responses</span>
                <span className={`font-semibold transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>{conversations.reduce((acc, conv) => acc + (conv.responses?.length || 0), 0)}</span>
              </div>
            </div>
          </div>
        </div>
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className={`backdrop-blur-sm border-b p-6 transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-800/60 border-gray-700/30' 
            : 'bg-white/60 border-slate-200/30'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-2xl font-bold mb-2 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Conversation History
              </h2>
              <p className={`transition-colors duration-200 ${
                darkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>Explore your AI conversations and insights</p>
            </div>
            {/* Add Delete All button on the right side */}
            {conversations.length > 0 && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete All</span>
              </button>
            )}
          </div>
          
          {/* Search and Filters */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                  darkMode ? 'text-gray-400' : 'text-s late-400'
                }`} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-800/80 border-gray-600/50 focus:ring-blue-500/20 focus:border-blue-400 text-white placeholder-gray-400' 
                      : 'bg-white/80 border-slate-200/50 focus:ring-blue-500/20 focus:border-blue-400 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
              
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'recent' | 'oldest' | 'responses')}
                  className={`appearance-none backdrop-blur-sm border rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer ${
                    darkMode 
                      ? 'bg-gray-800/80 border-gray-600/50 focus:ring-blue-500/20 focus:border-blue-400 text-white' 
                      : 'bg-white/80 border-slate-200/50 focus:ring-blue-500/20 focus:border-blue-400 text-slate-900'
                  }`}
                >
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                  <option value="responses">Most Responses</option>
                </select>
                <SortDesc className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-200 ${
                  darkMode ? 'text-gray-400' : 'text-slate-400'
                }`} />
              </div>
            </div>
            
            <div className={`flex items-center backdrop-blur-sm border rounded-xl p-1 transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-800/80 border-gray-600/50' 
                : 'bg-white/80 border-slate-200/50'
            }`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : darkMode 
                      ? 'text-gray-400 hover:bg-gray-700/50' 
                      : 'text-slate-600 hover:bg-white/50'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : darkMode 
                      ? 'text-gray-400 hover:bg-gray-700/50' 
                      : 'text-slate-600 hover:bg-white/50'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <MessageSquare className="w-16 h-16 text-blue-500" />
              </div>
              <h3 className={`text-2xl font-bold mb-4 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {searchTerm ? 'No matches found' : 'No conversations yet'}
              </h3>
              <p className={`text-lg max-w-md mx-auto mb-6 transition-colors duration-200 ${
                darkMode ? 'text-gray-400' : 'text-slate-500'
              }`}>
                {searchTerm ? 'Try adjusting your search terms' : 'Start chatting with AI models to see your history here'}
              </p>
              {!searchTerm && (
                <Link
                  href="/chat"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                  <span>Start Your First Comparison</span>
                </Link>
              )}
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group relative cursor-pointer transition-all duration-300 ${
                    viewMode === 'grid'
                      ? darkMode 
                        ? 'bg-gray-800/60 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-6 hover:shadow-xl hover:scale-105'
                        : 'bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 hover:shadow-xl hover:scale-105'
                      : darkMode 
                        ? 'bg-gray-800/60 backdrop-blur-sm border border-gray-600/50 rounded-xl p-4 flex items-center space-x-4 hover:shadow-lg'
                        : 'bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-xl p-4 flex items-center space-x-4 hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteConversation(conversation.id); }}
                          className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <h3 className={`font-bold mb-2 text-lg truncate transition-colors duration-200 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>{conversation.title}</h3>
                      <p className={`text-sm line-clamp-3 mb-4 leading-relaxed transition-colors duration-200 ${
                        darkMode ? 'text-gray-300' : 'text-slate-600'
                      }`}>{conversation.message}</p>
                      <div className="flex items-center justify-between">
                        <div className={`flex items-center text-xs transition-colors duration-200 ${
                          darkMode ? 'text-gray-400' : 'text-slate-500'
                        }`}>
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDistanceToNow(new Date(conversation.createdAt), { addSuffix: true })}
                        </div>
                        {conversation.responses && (
                          <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full">
                            {conversation.responses.length}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold mb-1 truncate transition-colors duration-200 ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>{conversation.title}</h3>
                        <p className={`text-sm truncate mb-2 transition-colors duration-200 ${
                          darkMode ? 'text-gray-300' : 'text-slate-600'
                        }`}>{conversation.message}</p>
                        <div className={`flex items-center space-x-4 text-xs transition-colors duration-200 ${
                          darkMode ? 'text-gray-400' : 'text-slate-500'
                        }`}>
                          <span>{formatDistanceToNow(new Date(conversation.createdAt), { addSuffix: true })}</span>
                          {conversation.responses && <span>{conversation.responses.length} responses</span>}
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteConversation(conversation.id); }}
                        className={`opacity-0 group-hover:opacity-100 p-2 hover:text-red-500 transition-all duration-200 ${
                          darkMode ? 'text-gray-400' : 'text-slate-400'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Conversation Detail Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transition-colors duration-200 ${
            darkMode ? 'bg-gray-800/90' : 'bg-white/90'
          }`}>
            <div className={`p-6 border-b transition-colors duration-200 ${
              darkMode 
                ? 'border-gray-600/50 bg-gradient-to-r from-blue-900/20 to-purple-900/20' 
                : 'border-slate-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-2xl font-bold mb-2 transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>{selectedConversation.title}</h2>
                  <div className={`flex items-center space-x-4 text-sm transition-colors duration-200 ${
                    darkMode ? 'text-gray-300' : 'text-slate-600'
                  }`}>
                    <span>{formatDistanceToNow(new Date(selectedConversation.createdAt), { addSuffix: true })}</span>
                    {selectedConversation.responses && <span>{selectedConversation.responses.length} responses</span>}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedConversation(null)}
                  className={`p-3 hover:bg-white/50 rounded-xl transition-all duration-200 ${
                    darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
              <div className={`p-6 transition-colors duration-200 ${
                darkMode ? 'bg-gray-700/50' : 'bg-slate-50/50'
              }`}>
                <h4 className={`text-sm font-semibold mb-3 flex items-center transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-700'
                }`}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Original Message
                </h4>
                <div className={`backdrop-blur-sm rounded-xl p-4 transition-colors duration-200 ${
                  darkMode ? 'bg-gray-800/80' : 'bg-white/80'
                }`}>
                  <p className={`whitespace-pre-wrap transition-colors duration-200 ${
                    darkMode ? 'text-gray-200' : 'text-slate-900'
                  }`}>{selectedConversation.message}</p>
                </div>
              </div>
              
              <div className="p-6">
                {selectedConversation.responses && selectedConversation.responses.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className={`text-lg font-semibold transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>AI Responses</h4>
                    {selectedConversation.responses.map((response) => (
                      <div key={response.id} className={`rounded-2xl p-6 transition-colors duration-200 ${
                        response.isBestResponse 
                          ? darkMode 
                            ? 'bg-gradient-to-br from-amber-900/50 to-yellow-900/50 border-2 border-amber-700/50' 
                            : 'bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200'
                          : darkMode 
                            ? 'bg-gray-800/60 border border-gray-600/50' 
                            : 'bg-white/60 border border-slate-200/50'
                      }`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${response.isBestResponse ? 'bg-gradient-to-br from-amber-400 to-yellow-500' : 'bg-gradient-to-br from-blue-500 to-purple-500'}`}>
                              {getModelDisplayName(response.modelName).charAt(0)}
                            </div>
                            <div>
                              <h5 className={`font-bold transition-colors duration-200 ${
                                darkMode ? 'text-white' : 'text-slate-900'
                              }`}>{getModelDisplayName(response.modelName)}</h5>
                              {response.isBestResponse && <span className={`text-xs font-semibold ${
                                darkMode ? 'text-amber-400' : 'text-amber-600'
                              }`}>⭐ Best Response</span>}
                            </div>
                          </div>
                          <button onClick={() => copyResponse(response.response, response.id)} className={`p-2 hover:bg-white/50 rounded-xl transition-colors duration-200 ${
                            darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-slate-400 hover:text-slate-600'
                          }`}>
                            {copiedResponse === response.id ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                          </button>
                        </div>
                        {/* Scrollable Response Content */}
                        <div className={`max-h-64 overflow-y-auto rounded-xl p-4 border transition-colors duration-200 ${
                          darkMode 
                            ? 'bg-gray-900/50 border-gray-600/30' 
                            : 'bg-white/50 border-slate-200/30'
                        }`}>
                          <div className="prose prose-slate max-w-none">
                            <div className={`whitespace-pre-wrap transition-colors duration-200 ${
                              darkMode ? 'text-gray-200' : 'text-slate-700'
                            }`}>{response.response}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`text-center py-8 transition-colors duration-200 ${
                    darkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>No responses found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup - Moved to center of page */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full transition-all duration-300 transform animate-fade-in ${
            darkMode ? 'bg-gray-800/90' : 'bg-white/90'
          }`}>
            <div className={`p-6 border-b transition-colors duration-200 ${
              darkMode 
                ? 'border-gray-600/50' 
                : 'border-slate-200/50'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>Confirm Delete All</h3>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className={`p-2 rounded-lg hover:bg-white/50 transition-colors duration-200 ${
                    darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className={`p-6 transition-colors duration-200 ${
              darkMode ? 'text-gray-300' : 'text-slate-600'
            }`}>
              <p className="mb-6">Are you sure you want to delete all conversations? This action cannot be undone.</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={deleteAllConversations}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Delete All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Message */}
      {showDeleteSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm border transition-all duration-300 transform animate-fade-in ${
            darkMode 
              ? 'bg-green-900/80 border-green-700/50 text-green-100' 
              : 'bg-green-100/80 border-green-200/50 text-green-800'
          }`}>
            <div className="flex items-center">
              <Check className="w-5 h-5 mr-2" />
              <span className="font-medium">History deleted successfully</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
