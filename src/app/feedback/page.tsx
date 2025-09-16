'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useRouter } from 'next/navigation'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import { Star, Send } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import SimplifiedNavigation from '@/components/SimplifiedNavigation'
import SimpleProfileIcon from '@/components/layout/SimpleProfileIcon'

export default function FeedbackPage() {
  const { user, loading } = useAuth()
  const { darkMode } = useDarkMode()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    message: '',
    rating: 0
  })
  const [hoverRating, setHoverRating] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [feedbackList, setFeedbackList] = useState<Array<{
    id: string
    name: string
    rating: number
    message: string
    created_at: string
  }>>([])
  const [submitError, setSubmitError] = useState('')

  const supabase = createClient();

  // Handle navigation when user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  // Fetch existing feedback
  useEffect(() => {
    const fetchFeedback = async () => {
      const { data, error } = await supabase
        .from('feedback_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setFeedbackList(data);
      }
    };

    fetchFeedback();

    // Subscribe to new feedback in real-time
    const channel = supabase
      .channel('feedback-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'feedback_messages'
        },
        (payload: any) => {
          setFeedbackList(prev => [payload.new as any, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!user) {
    return null;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message should be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit feedback');
      }
      
      const result = await response.json();
      
      // Add the newly submitted feedback to the list immediately
      setFeedbackList(prev => [result.data, ...prev]);
      
      // Show success modal
      setShowModal(true);
      // Reset form after successful submission
      setFormData({
        name: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        message: '',
        rating: 0
      });
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      setSubmitError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
        onMouseEnter={() => setHoverRating(star)}
        onMouseLeave={() => setHoverRating(0)}
        className={`p-1 focus:outline-none transition-all duration-200 transform hover:scale-110 ${
          star <= (hoverRating || formData.rating)
            ? darkMode ? 'text-yellow-400' : 'text-yellow-500'
            : darkMode ? 'text-gray-600' : 'text-gray-300'
        }`}
      >
        <Star
          className={`w-8 h-8 transition-all duration-200 ${
            star <= (hoverRating || formData.rating)
              ? 'fill-current'
              : 'fill-none'
          }`}
        />
      </button>
    ))
  }

  // Calculate feedback statistics dynamically
  const calculateFeedbackStats = () => {
    if (feedbackList.length === 0) {
      return {
        averageRating: 0,
        totalFeedback: 0,
        positiveFeedback: 0
      };
    }

    // Calculate average rating
    const totalRating = feedbackList.reduce((sum, feedback) => sum + (feedback.rating || 0), 0);
    const averageRating = totalRating / feedbackList.length;

    // Calculate positive feedback (ratings 4 or higher)
    const positiveCount = feedbackList.filter(feedback => (feedback.rating || 0) >= 4).length;
    const positivePercentage = (positiveCount / feedbackList.length) * 100;

    return {
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalFeedback: feedbackList.length,
      positiveFeedback: Math.round(positivePercentage)
    };
  };

  const feedbackStats = calculateFeedbackStats();

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <AdvancedSidebar />
      <div className="ml-16 lg:ml-72">
        {/* Add simple profile icon at the top */}
        <div className={`sticky top-0 z-50 backdrop-blur-sm border-b transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-800/60 border-gray-700/30' 
            : 'bg-white/60 border-slate-200/30'
        }`}>
          <div className="px-6 py-4 flex justify-end">
            <SimpleProfileIcon darkMode={darkMode} />
          </div>
        </div>
        
        <SimplifiedNavigation />
        
        <main className="max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className={`text-4xl font-bold mb-4 transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Your Feedback Matters
            </h1>
            <p className={`text-xl max-w-2xl mx-auto transition-colors duration-200 ${
              darkMode ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Help us improve AI Fiesta by sharing your experience and suggestions.
            </p>
          </div>

          {/* Success Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className={`rounded-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-100 ${
                darkMode 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-slate-200'
              }`}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Feedback Submitted!
                  </h3>
                  <p className={`mb-6 transition-colors duration-200 ${
                    darkMode ? 'text-gray-300' : 'text-slate-600'
                  }`}>
                    Thank you for your valuable feedback. We appreciate your input.
                  </p>
                  <button
                    onClick={() => setShowModal(false)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      darkMode 
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700' 
                        : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600'
                    }`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div className={`max-w-6xl mx-auto mb-6 p-4 rounded-xl border-l-4 transition-colors duration-200 ${
              darkMode 
                ? 'bg-red-900/30 border-red-700/50 text-red-400' 
                : 'bg-red-50 border-red-500 text-red-700'
            }`}>
              <p className="font-medium">{submitError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Feedback Form */}
            <div className="lg:col-span-2">
              <div className={`rounded-2xl p-8 transition-colors duration-200 backdrop-blur-sm ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <h3 className={`text-2xl font-bold mb-6 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Share Your Thoughts
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${
                      darkMode ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 ${
                        errors.name 
                          ? darkMode 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-gray-700/50' 
                            : 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-white'
                          : darkMode 
                            ? 'border-gray-600 focus:border-purple-500 focus:ring-purple-500/20 bg-gray-700/50 text-white placeholder-gray-400' 
                            : 'border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 bg-white text-slate-900 placeholder-slate-500'
                      }`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${
                      darkMode ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 ${
                        errors.email 
                          ? darkMode 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-gray-700/50' 
                            : 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-white'
                          : darkMode 
                            ? 'border-gray-600 focus:border-purple-500 focus:ring-purple-500/20 bg-gray-700/50 text-white placeholder-gray-400' 
                            : 'border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 bg-white text-slate-900 placeholder-slate-500'
                      }`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>

                  {/* Rating */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${
                      darkMode ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      Rating
                    </label>
                    <div className="flex space-x-1">
                      {renderStars()}
                    </div>
                    {errors.rating && <p className="mt-1 text-sm text-red-500">{errors.rating}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${
                      darkMode ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      Your Feedback
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Share your thoughts, suggestions, or report issues..."
                      rows={6}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 resize-none ${
                        errors.message 
                          ? darkMode 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-gray-700/50' 
                            : 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-white'
                          : darkMode 
                            ? 'border-gray-600 focus:border-purple-500 focus:ring-purple-500/20 bg-gray-700/50 text-white placeholder-gray-400' 
                            : 'border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 bg-white text-slate-900 placeholder-slate-500'
                      }`}
                    />
                    {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                      isSubmitting 
                        ? 'animate-pulse' 
                        : ''
                    } ${
                      darkMode 
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700' 
                        : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Feedback Stats */}
            <div className="space-y-6">
              <div className={`rounded-2xl p-6 transition-colors duration-200 backdrop-blur-sm ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <h3 className={`text-xl font-bold mb-4 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Feedback Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`transition-colors duration-200 ${
                      darkMode ? 'text-gray-300' : 'text-slate-600'
                    }`}>
                      Average Rating
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className={`font-bold transition-colors duration-200 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {feedbackStats.averageRating}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`transition-colors duration-200 ${
                      darkMode ? 'text-gray-300' : 'text-slate-600'
                    }`}>
                      Total Feedback
                    </span>
                    <span className={`font-bold transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {feedbackStats.totalFeedback}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`transition-colors duration-200 ${
                      darkMode ? 'text-gray-300' : 'text-slate-600'
                    }`}>
                      Positive Feedback
                    </span>
                    <span className={`font-bold transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {feedbackStats.positiveFeedback}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submitted Feedback */}
          {feedbackList.length > 0 && (
            <div className="mt-12">
              <h3 className={`text-2xl font-bold mb-6 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Your Feedback
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedbackList.map((feedback) => (
                  <div 
                    key={feedback.id}
                    className={`rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm ${
                      darkMode 
                        ? 'bg-gray-800/60 border border-gray-700/50 hover:shadow-lg' 
                        : 'bg-white/80 border border-slate-200/50 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className={`font-bold transition-colors duration-200 ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {feedback.name}
                        </h4>
                        <p className={`text-sm transition-colors duration-200 ${
                          darkMode ? 'text-gray-400' : 'text-slate-500'
                        }`}>
                          {new Date(feedback.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={`star-${feedback.id}-${i}`}
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
        </main>
      </div>
    </div>
  )
}