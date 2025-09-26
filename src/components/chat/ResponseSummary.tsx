'use client'

import { useState } from 'react'
import { FileText, ChevronRight, Clock } from 'lucide-react'

interface ResponseSummaryProps {
  content: string
  isVisible: boolean
  onToggle: () => void
}

export default function ResponseSummary({ content, isVisible, onToggle }: ResponseSummaryProps) {
  const [summary, setSummary] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

  const generateSummary = (text: string): string => {
    // Simple extractive summary - get first and key sentences
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20)
    
    if (sentences.length <= 3) return text
    
    // Take first sentence and a few key sentences
    const firstSentence = sentences[0]?.trim()
    const keyPhrases = sentences.slice(1, 4).filter(s => 
      s.includes('important') || 
      s.includes('key') || 
      s.includes('main') ||
      s.includes('result') ||
      s.includes('conclusion') ||
      s.length > 50
    )
    
    const summaryText = [firstSentence, ...keyPhrases.slice(0, 2)]
      .filter(Boolean)
      .join('. ') + '.'
    
    return summaryText.length > 200 ? summaryText.substring(0, 200) + '...' : summaryText
  }

  const handleToggleSummary = async () => {
    if (!isVisible && !summary) {
      setIsGenerating(true)
      // Simulate processing time for better UX
      setTimeout(() => {
        setSummary(generateSummary(content))
        setIsGenerating(false)
      }, 800)
    }
    onToggle()
  }

  const getKeyPoints = (text: string): string[] => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 30)
    const keyPoints = []
    
    // Look for numbered points or bullet points
    for (const sentence of sentences.slice(0, 10)) {
      if (sentence.match(/^\s*\d+[\.\)\:]/) || 
          sentence.match(/^\s*[-•*]/) ||
          sentence.includes('first') ||
          sentence.includes('second') ||
          sentence.includes('finally') ||
          sentence.includes('important')) {
        keyPoints.push(sentence.trim())
        if (keyPoints.length >= 3) break
      }
    }
    
    return keyPoints.length > 0 ? keyPoints : sentences.slice(0, 3).map(s => s.trim())
  }

  const keyPoints = content ? getKeyPoints(content) : []

  return (
    <div className="border-t border-slate-200/50 pt-3 mt-3">
      <button
        onClick={handleToggleSummary}
        className="flex items-center justify-between w-full p-3 bg-blue-50/50 hover:bg-blue-100/50 border border-blue-200/30 rounded-xl transition-all duration-200 text-left group"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              {isVisible ? 'Hide Summary' : 'Show Summary'}
            </h4>
            <p className="text-xs text-slate-600">
              Quick overview of key points
            </p>
          </div>
        </div>
        <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
          isVisible ? 'rotate-90' : ''
        }`} />
      </button>

      {isVisible && (
        <div className="mt-3 p-4 bg-white/60 border border-slate-200/30 rounded-xl">
          {isGenerating ? (
            <div className="flex items-center justify-center py-6">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="text-sm text-slate-600">Generating summary...</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Quick Summary */}
              <div>
                <h5 className="text-xs font-semibold text-slate-700 mb-2 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Quick Summary
                </h5>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {summary || generateSummary(content)}
                </p>
              </div>

              {/* Key Points */}
              {keyPoints.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-slate-700 mb-2">
                    Key Points
                  </h5>
                  <ul className="space-y-1">
                    {keyPoints.map((point, index) => (
                      <li key={index} className="text-sm text-slate-600 flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        <span className="line-clamp-2">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}