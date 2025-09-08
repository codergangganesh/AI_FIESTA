'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Pin, 
  Clock, 
  ChevronLeft,
  ChevronRight,
  Trash2,
  Star,
  Eye
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Conversation {
  id: string
  title: string
  message: string
  createdAt: string
  isPinned?: boolean
  responses?: any[]
  bestResponseModel?: string
}

interface ChatHistorySidebarProps {
  darkMode: boolean
  isCollapsed: boolean
  onToggleCollapse: () => void
  onConversationSelect: (conversation: Conversation) => void
  onNewChat: () => void
  selectedConversationId?: string
}

export default function ChatHistorySidebar({
  darkMode,
  isCollapsed,
  onToggleCollapse,
  onConversationSelect,
  onNewChat,
  selectedConversationId
}: ChatHistorySidebarProps) {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchConversations()
    }
  }, [user])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Delete this conversation?')) return

    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setConversations(prev => prev.filter(conv => conv.id !== id))
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={`flex flex-col h-full border-r transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    } ${
      darkMode 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className={`font-bold text-lg ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Chat History
            </h2>
          )}
          
          <button
            onClick={onToggleCollapse}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
        
        {!isCollapsed && (
          <>
            {/* New Chat Button */}
            <button
              onClick={onNewChat}
              className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>New Comparison</span>
            </button>
            
            {/* Search */}
            <div className="relative mt-4">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </>
        )}
      </div>
      
      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-16 rounded-xl mb-2 animate-pulse ${
                darkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`} />
            ))}
          </div>
        ) : filteredConversations.length > 0 ? (
          <div className="mt-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group relative p-3 m-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedConversationId === conversation.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'
                    : darkMode
                      ? 'hover:bg-gray-800 border border-transparent hover:border-gray-700'
                      : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
                }`}
                onClick={() => onConversationSelect(conversation)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium text-sm truncate ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {conversation.title}
                    </h3>
                    
                    {!isCollapsed && (
                      <>
                        <p className={`text-xs line-clamp-2 mb-2 leading-relaxed ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {conversation.message}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className={`flex items-center space-x-2 ${
                            darkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            <Clock className="w-3 h-3" />
                            <span>{formatDistanceToNow(new Date(conversation.createdAt), { addSuffix: true })}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className={`flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isCollapsed ? 'hidden' : ''
                  }`}>
                    <button
                      onClick={(e) => deleteConversation(conversation.id, e)}
                      className={`p-1 rounded transition-colors ${
                        darkMode
                          ? 'text-gray-400 hover:text-red-400'
                          : 'text-gray-500 hover:text-red-500'
                      }`}
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !isCollapsed && (
            <div className="p-8 text-center">
              <MessageSquare className={`w-12 h-12 mx-auto mb-4 ${
                darkMode ? 'text-gray-600' : 'text-gray-300'
              }`} />
              <h3 className={`font-medium mb-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No conversations yet
              </h3>
              <p className={`text-sm ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Start your first AI model comparison
              </p>
            </div>
          )
        )}
      </div>
    </div>
  )
}