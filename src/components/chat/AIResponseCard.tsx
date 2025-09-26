'use client'

import { useState, useRef, useEffect } from 'react'
import { Copy, Check, Star, Zap, AlertCircle, Sparkles, ChevronDown, Maximize2, Minimize2, MoreHorizontal } from 'lucide-react'
import { AIModel } from '@/types/app'
import { useDarkMode } from '@/contexts/DarkModeContext'
import ResponseSummary from './ResponseSummary'
import TextToSpeech from './TextToSpeech'
import Link from 'next/link'

interface AIResponseCardProps {
  model: AIModel
  content: string
  loading: boolean
  error?: string
  isBestResponse?: boolean
  onMarkBest?: () => void
  darkMode?: boolean
  metrics?: {
    wordCount: number
    latency: number
    cost: number
  }
  responseTime?: number // Add response time prop
}

export default function AIResponseCard({
  model,
  content,
  loading,
  error,
  isBestResponse = false,
  onMarkBest,
  responseTime // Destructure responseTime
}: AIResponseCardProps) {
  // Debug logging
  console.log('AIResponseCard props:', { model, content: content?.substring(0, 100) + '...', loading, error, isBestResponse, responseTime });
  const { darkMode } = useDarkMode()
  const [copied, setCopied] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [showSummary, setShowSummary] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Character limits for preview
  const PREVIEW_CHAR_LIMIT = 300
  const LONG_CONTENT_THRESHOLD = 500
  const VERY_LONG_CONTENT_THRESHOLD = 1500

  useEffect(() => {
    const checkScrollNeeded = () => {
      if (scrollRef.current) {
        const { scrollHeight, clientHeight, scrollTop } = scrollRef.current
        setShowScrollIndicator(scrollHeight > clientHeight)
        
        // Calculate reading progress
        if (scrollHeight > clientHeight) {
          const progress = (scrollTop / (scrollHeight - clientHeight)) * 100
          setReadingProgress(Math.min(progress, 100))
        } else {
          setReadingProgress(100)
        }
      }
    }

    const scrollContainer = scrollRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollNeeded)
    }

    checkScrollNeeded()
    // Re-check when content changes
    const timeoutId = setTimeout(checkScrollNeeded, 100)
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScrollNeeded)
      }
      clearTimeout(timeoutId)
    }
  }, [content, isExpanded])

  const handleExpand = () => {
    setIsExpanded(!isExpanded)
    setShowPreview(false)
  }

  const isLongContent = content && content.length > LONG_CONTENT_THRESHOLD
  const isVeryLongContent = content && content.length > VERY_LONG_CONTENT_THRESHOLD
  const shouldShowPreview = showPreview && isLongContent && !isExpanded
  const displayContent = shouldShowPreview 
    ? content.substring(0, PREVIEW_CHAR_LIMIT) + '...' 
    : content

  const getReadingTime = (text: string) => {
    const wordsPerMinute = 200
    const words = text.split(' ').length
    const minutes = Math.ceil(words / wordsPerMinute)
    return minutes === 1 ? '1 min read' : `${minutes} min read`
  }

  const handleCopy = async () => {
    if (content) {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getProviderColor = (provider: string) => {
    const colors = {
      'Google': 'from-blue-500 to-green-500',
      'Anthropic': 'from-orange-500 to-red-500',
      'OpenAI': 'from-green-500 to-blue-500',
      'Meta': 'from-blue-600 to-purple-600',
      'DeepSeek': 'from-purple-500 to-pink-500',
      'Qwen': 'from-red-500 to-orange-500',
      'Grok': 'from-gray-700 to-gray-900',
      'Kimi': 'from-cyan-500 to-blue-500',
      'Shisa': 'from-pink-500 to-purple-500'
    }
    return colors[provider as keyof typeof colors] || 'from-slate-500 to-slate-700'
  }

  return (
    <div className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-102 ${
      isBestResponse 
        ? darkMode
          ? 'bg-gradient-to-br from-amber-900/30 to-yellow-900/30 border-2 border-amber-600/50 shadow-lg shadow-amber-500/20' 
          : 'bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 shadow-lg shadow-amber-200/50'
        : darkMode
          ? 'bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 hover:shadow-lg hover:border-gray-600/50'
          : 'bg-white/80 backdrop-blur-sm border border-slate-200/50 hover:shadow-lg hover:border-slate-300/50'
    }`}>
      {/* Best Response Indicator */}
      {isBestResponse && (
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div className="absolute top-2 right-2 w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center transform rotate-12">
            <Star className="w-6 h-6 text-white fill-current" />
          </div>
        </div>
      )}

      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Model Avatar */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getProviderColor(model.provider)} flex items-center justify-center text-white font-bold shadow-lg`}>
              {model.displayName.charAt(0)}
            </div>
            <div>
              <Link href="/compare" className="hover:text-blue-600 transition-colors duration-200">
                <h3 className={`font-bold text-lg hover:text-blue-600 cursor-pointer transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>{model.displayName}</h3>
              </Link>
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  isBestResponse 
                    ? darkMode
                      ? 'bg-amber-900/40 text-amber-300' 
                      : 'bg-amber-100 text-amber-700'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {model.provider}
                </span>
                {isBestResponse && (
                  <div className={`flex items-center space-x-1 ${
                    darkMode ? 'text-amber-400' : 'text-amber-600'
                  }`}>
                    <Sparkles className="w-3 h-3" />
                    <span className="text-xs font-semibold">Best</span>
                  </div>
                )}
                {/* Display response time if available */}
                {responseTime !== undefined && responseTime > 0 && (
                  <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                    darkMode
                      ? 'bg-blue-900/40 text-blue-300' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {responseTime.toFixed(2)}s
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {content && !loading && (
              <>
                <button
                  onClick={onMarkBest}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    isBestResponse 
                      ? darkMode
                        ? 'bg-amber-900/40 text-amber-400 shadow-md' 
                        : 'bg-amber-100 text-amber-600 shadow-md'
                      : darkMode
                        ? 'bg-gray-700 text-gray-400 hover:text-amber-400 hover:bg-amber-900/20 hover:scale-110'
                        : 'bg-slate-100 text-slate-400 hover:text-amber-500 hover:bg-amber-50 hover:scale-110'
                  }`}
                  title={isBestResponse ? 'Best response' : 'Mark as best'}
                >
                  <Star className={`w-4 h-4 ${isBestResponse ? 'fill-current' : ''}`} />
                </button>
                
                <button
                  onClick={handleCopy}
                  className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-400 hover:text-gray-200 hover:bg-gray-600' 
                      : 'bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Copy response"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="relative mb-4">
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                  <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-400 rounded-full animate-spin animate-reverse mx-auto"></div>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-slate-600">
                  <Zap className="w-4 h-4" />
                  <span className="font-medium">Thinking...</span>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-red-600 text-sm font-medium mb-2">Something went wrong</p>
                <p className={`text-xs ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-500'} px-3 py-2 rounded-lg`}>{error}</p>
              </div>
            </div>
          ) : content ? (
            <div className="flex-1 flex flex-col">
              {/* Content Length Indicator */}
              {isLongContent && (
                <div className="mb-3 flex items-center justify-between px-2 py-1 bg-blue-50/50 rounded-lg border border-blue-200/30">
                  <div className="flex items-center space-x-2 text-xs text-blue-700">
                    <MoreHorizontal className="w-3 h-3" />
                    <span>Long response • {getReadingTime(content)}</span>
                    {isVeryLongContent && (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                        Very Long
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleExpand}
                    className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <Minimize2 className="w-3 h-3" />
                        <span>Collapse</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-3 h-3" />
                        <span>Expand</span>
                      </>
                    )}
                  </button>
                </div>
              )}
              
              {/* Reading Progress Bar for Long Content */}
              {isVeryLongContent && !shouldShowPreview && (
                <div className="mb-3">
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div 
                      className={`reading-indicator rounded-full h-1.5 transition-all duration-200 ${
                        darkMode ? 'bg-blue-400' : 'bg-blue-500'
                      }`}
                      style={{ width: `${readingProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Reading progress</span>
                    <span className={`text-xs ${darkMode ? 'text-slate-300' : 'text-slate-600'} font-medium`}>{Math.round(readingProgress)}%</span>
                  </div>
                </div>
              )}
              
              {/* Response Content with Adaptive Container */}
              <div className="relative">
                <div 
                  ref={scrollRef}
                  className={`overflow-y-auto response-scroll ${
                    darkMode ? 'bg-gray-700/30' : 'bg-slate-50/30'
                  } rounded-xl p-4 border ${
                    darkMode ? 'border-gray-600/30' : 'border-slate-200/30'
                  } transition-all duration-300 hover:${
                    darkMode ? 'border-gray-500/50' : 'border-slate-300/50'
                  } ${
                    isExpanded ? 'max-h-96' : isLongContent ? 'max-h-48' : 'max-h-80'
                  }`}
                >
                  <div className={`prose max-w-none leading-relaxed ${
                    darkMode ? 'prose-invert text-slate-100' : 'prose-slate text-slate-700'
                  } ${isBestResponse ? 'prose-amber' : ''}`}>
                    <div className={`whitespace-pre-wrap text-sm ${darkMode ? 'text-slate-100' : 'text-slate-700'}`}>{displayContent}</div>
                    
                    {/* Show More Button for Preview Mode */}
                    {shouldShowPreview && (
                      <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-600/50' : 'border-slate-200/50'}`}>
                        <button
                          onClick={() => setShowPreview(false)}
                          className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                            darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                          <span>Show full response</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Enhanced Scroll Indicator */}
                {showScrollIndicator && !shouldShowPreview && (
                  <div className={`absolute bottom-0 left-0 right-0 h-8 scroll-indicator rounded-b-xl flex items-end justify-center pb-2 ${
                    darkMode ? 'bg-gradient-to-t from-gray-700/80 to-transparent' : 'bg-gradient-to-t from-white/80 to-transparent'
                  }`}>
                    <div className={`flex items-center space-x-1 text-xs ${
                      darkMode ? 'text-slate-400 bg-gray-800/80' : 'text-slate-500 bg-white/80'
                    } px-2 py-1 rounded-full shadow-sm`}>
                      <ChevronDown className="w-3 h-3" />
                      <span>Scroll for more</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Summary Component for Very Long Content */}
              {isVeryLongContent && (
                <ResponseSummary 
                  content={content}
                  isVisible={showSummary}
                  onToggle={() => setShowSummary(!showSummary)}
                />
              )}
              
              {/* Enhanced Response Stats */}
              <div className="mt-3 space-y-2">
                {/* Text-to-Speech for Very Long Content */}
                {isVeryLongContent && (
                  <TextToSpeech text={content} />
                )}
                
                <div className={`flex items-center justify-between text-xs px-2 ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                <div className="flex items-center space-x-3">
                  <span>{content.split(' ').length} words</span>
                  <span>•</span>
                  <span>{content.length} characters</span>
                  {isLongContent && (
                    <>
                      <span>•</span>
                      <span className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} font-medium`}>{getReadingTime(content)}</span>
                    </>
                  )}
                </div>
                {isLongContent && (
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      content.length > 1000 ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="font-medium">
                      {content.length > 1000 ? 'Very Long' : 'Long'}
                    </span>
                  </div>
                )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
                  isBestResponse 
                    ? 'bg-gradient-to-br from-amber-100 to-yellow-100' 
                    : darkMode
                      ? 'bg-gray-700' 
                      : 'bg-gradient-to-br from-slate-100 to-slate-200'
                }`}>
                  <Sparkles className={`w-8 h-8 ${
                    isBestResponse ? 'text-amber-500' : darkMode ? 'text-slate-400' : 'text-slate-400'
                  }`} />
                </div>
                <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>Ready to respond</p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Send a message to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}