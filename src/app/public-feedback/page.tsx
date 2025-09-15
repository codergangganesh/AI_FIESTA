'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { Star } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function PublicFeedbackPage() {
  const { darkMode } = useDarkMode()
  const [feedbackList, setFeedbackList] = useState<Array<{
    id: string
    name: string
    rating: number
    message: string
    created_at: string
  }>>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  // Fetch all feedback
  useEffect(() => {
    const fetchFeedback = async () => {
      const { data, error } = await supabase
        .from('feedback_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setFeedbackList(data)
      }
      setLoading(false)
    }

    fetchFeedback()

    // Subscribe to new feedback in real-time
    const channel = supabase
      .channel('public-feedback-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'feedback_messages'
        },
        (payload: any) => {
          setFeedbackList(prev => [payload.new as any, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Filter positive feedback (4-5 star ratings)
  const positiveFeedback = feedbackList.filter(feedback => feedback.rating >= 4)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 transition-colors duration-200 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Community Feedback
          </h1>
          <p className={`text-xl max-w-2xl mx-auto transition-colors duration-200 ${
            darkMode ? 'text-gray-300' : 'text-slate-600'
          }`}>
            See what our users are saying about AI Fiesta. Join our community and share your experience!
          </p>
        </div>

        {/* Stats Section */}
        {feedbackList.length > 0 && (
          <div className="mb-12">
            <div className={`rounded-2xl p-6 transition-colors duration-200 backdrop-blur-sm ${
              darkMode 
                ? 'bg-gray-800/60 border border-gray-700/50' 
                : 'bg-white/80 border border-slate-200/50'
            }`}>
              <h2 className={`text-2xl font-bold mb-4 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Feedback Insights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl text-center ${
                  darkMode ? 'bg-gray-700/50' : 'bg-slate-100'
                }`}>
                  <div className="text-3xl font-bold text-purple-500">{feedbackList.length}</div>
                  <div className={`mt-1 transition-colors duration-200 ${
                    darkMode ? 'text-gray-300' : 'text-slate-600'
                  }`}>
                    Total Reviews
                  </div>
                </div>
                <div className={`p-4 rounded-xl text-center ${
                  darkMode ? 'bg-gray-700/50' : 'bg-slate-100'
                }`}>
                  <div className="text-3xl font-bold text-yellow-500">
                    {feedbackList.length > 0 
                      ? (feedbackList.reduce((sum, f) => sum + f.rating, 0) / feedbackList.length).toFixed(1)
                      : '0.0'}
                  </div>
                  <div className={`mt-1 transition-colors duration-200 ${
                    darkMode ? 'text-gray-300' : 'text-slate-600'
                  }`}>
                    Average Rating
                  </div>
                </div>
                <div className={`p-4 rounded-xl text-center ${
                  darkMode ? 'bg-gray-700/50' : 'bg-slate-100'
                }`}>
                  <div className="text-3xl font-bold text-green-500">
                    {feedbackList.length > 0 
                      ? Math.round((positiveFeedback.length / feedbackList.length) * 100)
                      : 0}%
                  </div>
                  <div className={`mt-1 transition-colors duration-200 ${
                    darkMode ? 'text-gray-300' : 'text-slate-600'
                  }`}>
                    Positive Feedback
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Positive Feedback Highlight */}
        {positiveFeedback.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-3xl font-bold transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                What Users Love
              </h2>
              <div className="flex items-center space-x-2">
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
                <span className={`font-semibold transition-colors duration-200 ${
                  darkMode ? 'text-yellow-400' : 'text-yellow-600'
                }`}>
                  {positiveFeedback.length} Positive Reviews
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {positiveFeedback.slice(0, 6).map((feedback) => (
                <div 
                  key={`positive-${feedback.id}`}
                  className={`rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm border-2 ${
                    darkMode 
                      ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/20' 
                      : 'bg-gradient-to-br from-white/80 to-slate-50/80 border-yellow-300 hover:shadow-lg hover:shadow-yellow-300/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className={`font-bold transition-colors duration-200 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {feedback.name}
                      </h3>
                      <p className={`text-sm transition-colors duration-200 ${
                        darkMode ? 'text-gray-400' : 'text-slate-500'
                      }`}>
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={`star-positive-${feedback.id}-${i}`}
                          className={`w-5 h-5 ${
                            i < feedback.rating 
                              ? 'text-yellow-500 fill-current'
                              : darkMode ? 'text-gray-600' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className={`transition-colors duration-200 ${
                    darkMode ? 'text-gray-300' : 'text-slate-700'
                  }`}>
                    {feedback.message}
                  </p>
                  <div className="mt-4 flex items-center">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      darkMode 
                        ? 'bg-yellow-500/20 text-yellow-400' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      Positive Review
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Feedback */}
        {feedbackList.length > 0 && (
          <div>
            <h2 className={`text-3xl font-bold mb-6 transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Community Reviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedbackList.map((feedback) => (
                <div 
                  key={`all-${feedback.id}`}
                  className={`rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm ${
                    darkMode 
                      ? 'bg-gray-800/60 border border-gray-700/50 hover:shadow-lg' 
                      : 'bg-white/80 border border-slate-200/50 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className={`font-bold transition-colors duration-200 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {feedback.name}
                      </h3>
                      <p className={`text-sm transition-colors duration-200 ${
                        darkMode ? 'text-gray-400' : 'text-slate-500'
                      }`}>
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={`star-all-${feedback.id}-${i}`}
                          className={`w-5 h-5 ${
                            i < feedback.rating 
                              ? darkMode ? 'text-yellow-400 fill-current' : 'text-yellow-500 fill-current'
                              : darkMode ? 'text-gray-600' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className={`transition-colors duration-200 ${
                    darkMode ? 'text-gray-300' : 'text-slate-700'
                  }`}>
                    {feedback.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {feedbackList.length === 0 && !loading && (
          <div className={`rounded-2xl p-12 text-center ${
            darkMode 
              ? 'bg-gray-800/60 border border-gray-700/50' 
              : 'bg-white/80 border border-slate-200/50'
          }`}>
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-12 h-12 text-white" />
              </div>
              <h3 className={`text-2xl font-bold mb-4 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                No Feedback Yet
              </h3>
              <p className={`mb-6 transition-colors duration-200 ${
                darkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                Be the first to share your experience with AI Fiesta!
              </p>
              <a 
                href="/feedback" 
                className={`inline-block px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700' 
                    : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600'
                }`}
              >
                Share Your Feedback
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}