'use client'

import { useState, useEffect } from 'react'
import { Conversation } from '@/types/app'
import { AI_MODELS } from '@/config/ai-models'
import { formatDistanceToNow } from 'date-fns'
import { MessageSquare, Trash2, Star, Clock, Copy, Check, Search, Grid, List, ChevronDown, SortDesc, Plus, History, Brain, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function ModernConversationHistory() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [copiedResponse, setCopiedResponse] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'responses'>('recent')

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-purple-400 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Loading Your Conversations</h3>
            <p className="text-slate-600 font-medium">Gathering your chat history...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Left Sidebar - Same as Chat */}
      <div className="w-80 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 flex flex-col">
        {/* Header with Logo */}
        <div className="p-6 border-b border-slate-200/30">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                AI Fiesta
              </h1>
              <p className="text-xs text-slate-500">Compare AI Models</p>
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
            className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-100/50 rounded-xl transition-all duration-200 group"
          >
            <MessageSquare className="w-5 h-5 transition-colors group-hover:text-blue-600" />
            <span className="font-medium">Current Chat</span>
          </Link>
          
          <div className="flex items-center space-x-3 px-4 py-3 text-slate-900 bg-blue-100/50 rounded-xl border border-blue-200/30">
            <History className="w-5 h-5 text-blue-600" />
            <span className="font-medium">History</span>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 mt-auto border-t border-slate-200/30">
          <div className="bg-blue-50/50 border border-blue-200/30 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
              Your Stats
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Total Conversations</span>
                <span className="font-semibold text-slate-900">{conversations.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">AI Responses</span>
                <span className="font-semibold text-slate-900">{conversations.reduce((acc, conv) => acc + (conv.responses?.length || 0), 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200/30 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Conversation History
              </h2>
              <p className="text-slate-600">Explore your AI conversations and insights</p>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
                />
              </div>
              
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'recent' | 'oldest' | 'responses')}
                  className="appearance-none bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 cursor-pointer"
                >
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                  <option value="responses">Most Responses</option>
                </select>
                <SortDesc className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
            
            <div className="flex items-center bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-600 hover:bg-white/50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-600 hover:bg-white/50'}`}
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
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {searchTerm ? 'No matches found' : 'No conversations yet'}
              </h3>
              <p className="text-slate-500 text-lg max-w-md mx-auto mb-6">
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
                      ? 'bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 hover:shadow-xl hover:scale-105'
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
                      <h3 className="font-bold text-slate-900 mb-2 text-lg truncate">{conversation.title}</h3>
                      <p className="text-slate-600 text-sm line-clamp-3 mb-4 leading-relaxed">{conversation.message}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-slate-500">
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
                        <h3 className="font-bold text-slate-900 mb-1 truncate">{conversation.title}</h3>
                        <p className="text-slate-600 text-sm truncate mb-2">{conversation.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span>{formatDistanceToNow(new Date(conversation.createdAt), { addSuffix: true })}</span>
                          {conversation.responses && <span>{conversation.responses.length} responses</span>}
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteConversation(conversation.id); }}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all duration-200"
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
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedConversation.title}</h2>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span>{formatDistanceToNow(new Date(selectedConversation.createdAt), { addSuffix: true })}</span>
                    {selectedConversation.responses && <span>{selectedConversation.responses.length} responses</span>}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="p-3 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-xl transition-all duration-200"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
              <div className="p-6 bg-slate-50/50">
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Original Message
                </h4>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-slate-900 whitespace-pre-wrap">{selectedConversation.message}</p>
                </div>
              </div>
              
              <div className="p-6">
                {selectedConversation.responses && selectedConversation.responses.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-900">AI Responses</h4>
                    {selectedConversation.responses.map((response) => (
                      <div key={response.id} className={`rounded-2xl p-6 ${response.isBestResponse ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200' : 'bg-white/60 border border-slate-200/50'}`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${response.isBestResponse ? 'bg-gradient-to-br from-amber-400 to-yellow-500' : 'bg-gradient-to-br from-blue-500 to-purple-500'}`}>
                              {getModelDisplayName(response.modelName).charAt(0)}
                            </div>
                            <div>
                              <h5 className="font-bold text-slate-900">{getModelDisplayName(response.modelName)}</h5>
                              {response.isBestResponse && <span className="text-xs text-amber-600 font-semibold">⭐ Best Response</span>}
                            </div>
                          </div>
                          <button onClick={() => copyResponse(response.response, response.id)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-xl">
                            {copiedResponse === response.id ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                          </button>
                        </div>
                        {/* Scrollable Response Content */}
                        <div className="max-h-64 overflow-y-auto bg-white/50 rounded-xl p-4 border border-slate-200/30">
                          <div className="prose prose-slate max-w-none">
                            <div className="whitespace-pre-wrap text-slate-700">{response.response}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">No responses found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}