'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { 
  Trash2, 
  Calendar, 
  MessageSquare, 
  Search,
  Filter,
  Copy,
  RefreshCw,
  Brain,
  Plus,
  History,
  BarChart3,
  Activity
} from 'lucide-react'
import Link from 'next/link'
import { comparisonService } from '@/lib/supabase'
import ProfileDropdown from '@/components/layout/ProfileDropdown'
import DeleteAccountDialog from '@/components/auth/DeleteAccountDialog'
import AIResponseCard from '@/components/chat/AIResponseCard'
import { getModelById } from '@/lib/models'

interface ModelResponse {
  modelId: string
  content: string
  success: boolean
  error?: string
  wordCount?: number
  latency?: number
  cost?: number
}

interface ComparisonHistory {
  id: string
  prompt: string
  selectedModels: string[]
  responses: ModelResponse[]
  bestResponseId?: string
  createdAt: string
  updatedAt: string
}

export default function HistoryPage() {
  const { user } = useAuth()
  const { darkMode } = useDarkMode()
  const [comparisons, setComparisons] = useState<ComparisonHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Load comparisons from Supabase
  useEffect(() => {
    const loadComparisons = async () => {
      try {
        const data = await comparisonService.getComparisons(user?.id)
        const formattedData: ComparisonHistory[] = data.map((item: any) => ({
          id: item.id,
          prompt: item.prompt,
          selectedModels: item.selected_models,
          responses: item.responses,
          bestResponseId: item.best_response_id,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }))
        setComparisons(formattedData)
      } catch (error) {
        console.error('Failed to load comparisons:', error)
        setComparisons([])
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadComparisons()
    } else {
      setLoading(false)
    }
  }, [user])

  const filteredComparisons = comparisons.filter(comp =>
    comp.prompt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    try {
      await comparisonService.deleteComparison(id)
      setComparisons(prev => prev.filter(comp => comp.id !== id))
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('Failed to delete comparison:', error)
    }
  }

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getModelDisplayName = (modelId: string) => {
    const modelMap: { [key: string]: string } = {
      'openai/gpt-4o': 'GPT-4o',
      'anthropic/claude-3.5-sonnet': 'Claude 3.5 Sonnet',
      'google/gemini-pro-1.5': 'Gemini Pro 1.5',
      'openai/gpt-4o-mini': 'GPT-4o Mini',
      'anthropic/claude-3-haiku': 'Claude 3 Haiku',
      'meta-llama/llama-3.1-405b-instruct': 'Llama 3.1 405B',
      'deepseek/deepseek-chat': 'DeepSeek Chat'
    }
    return modelMap[modelId] || modelId
  }

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
              <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Loading comparison history...
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
          <Link
            href="/compare"
            className="w-full flex items-center justify-center space-x-3 px-4 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] group"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span>New Comparison</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-2">
          <Link
            href="/compare"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              darkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <MessageSquare className="w-5 h-5 transition-colors group-hover:text-blue-600" />
            <span className="font-medium">Current Chat</span>
          </Link>
          
          <div
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              darkMode 
                ? 'text-white bg-gray-700/50' 
                : 'text-slate-900 bg-slate-100/50'
            }`}
          >
            <History className="w-5 h-5 text-blue-600" />
            <span className="font-medium">History</span>
          </div>
          
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
              onToggleDarkMode={() => {}} // Dark mode toggle is handled in the header
              onDeleteAccount={() => setIsDeleteDialogOpen(true)}
              onNewConversation={() => window.location.href = '/compare'}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`p-6 border-b transition-colors duration-200 ${
          darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-slate-200/30 bg-white/50'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Comparison History
              </h1>
              <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                View and manage your previous AI model comparisons
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">

        {/* Search and Filter */}
        <div className={`p-6 rounded-xl border mb-8 backdrop-blur-md transition-all duration-300 hover:shadow-lg ${
          darkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-white/80 border-gray-200'
        }`}>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search comparisons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                  darkMode
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                }`}
              />
            </div>
            <button
              title="Filter comparisons"
              className={`p-3 rounded-lg border transition-colors ${
                darkMode
                  ? 'border-gray-600 text-gray-400 hover:bg-gray-700/50'
                  : 'border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat-like History Interface */}
        <div className="space-y-6">
          {filteredComparisons.length === 0 ? (
            <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No comparisons found</h3>
              <p>Start comparing AI models to see your history here.</p>
            </div>
          ) : (
            filteredComparisons.map((comparison) => (
              <div
                key={comparison.id}
                className={`rounded-2xl border transition-all duration-300 hover:shadow-lg backdrop-blur-md ${
                  darkMode ? 'bg-gray-800/60 border-gray-700 hover:border-gray-600' : 'bg-white/80 border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* User Message Header */}
                <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        darkMode ? 'bg-blue-600' : 'bg-blue-500'
                      }`}>
                        <span className="text-white font-semibold text-sm">U</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            You
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(comparison.createdAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>{comparison.selectedModels.length} models</span>
                            </div>
                          </div>
                        </div>
                        <div className={`p-4 rounded-xl ${
                          darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'
                        }`}>
                          <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>
                            {comparison.prompt}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleCopyPrompt(comparison.prompt)}
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode
                            ? 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                            : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-700'
                        }`}
                        title="Copy prompt"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(comparison.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode
                            ? 'text-gray-400 hover:bg-red-700/50 hover:text-red-300'
                            : 'text-gray-500 hover:bg-red-100/50 hover:text-red-600'
                        }`}
                        title="Delete comparison"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Responses */}
                <div className="p-6">
                  <div className={`grid gap-6 ${
                    comparison.selectedModels.length === 1 ? 'grid-cols-1 max-w-4xl mx-auto' :
                    comparison.selectedModels.length === 2 ? 'grid-cols-1 lg:grid-cols-2' :
                    comparison.selectedModels.length === 3 ? 'grid-cols-1 lg:grid-cols-3' :
                    comparison.selectedModels.length <= 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
                    comparison.selectedModels.length <= 6 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                    'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  }`}>
                    {comparison.selectedModels.map((modelId) => {
                      const model = getModelById(modelId)
                      const response = comparison.responses.find(r => r.modelId === modelId)
                      
                      if (!model) return null

                      return (
                        <AIResponseCard
                          key={`${comparison.id}-${modelId}`}
                          model={model}
                          content={response?.content || ''}
                          loading={false}
                          error={response?.error}
                          isBestResponse={comparison.bestResponseId === modelId}
                          onMarkBest={() => {
                            // Handle marking as best response
                            const newBestResponse = comparison.bestResponseId === modelId ? null : modelId
                            // You could implement this to update in Supabase
                          }}
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
              </div>
            ))
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`p-6 rounded-xl max-w-md w-full mx-4 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Delete Comparison
              </h3>
              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Are you sure you want to delete this comparison? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                    darkMode
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}


        </div>

        {/* Delete Account Dialog */}
        <DeleteAccountDialog 
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
        />
      </div>
    </div>
  )
}
