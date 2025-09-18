'use client'

import { useState, useEffect } from 'react'
import { Star, Send, DollarSign, Crown, Zap, Check } from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { createClient } from '@/utils/supabase/client'
import type { Database } from '@/types/database'

type FeedbackMessage = Database['public']['Tables']['feedback_messages']['Row']

export default function ModernFeedbackAndPricing() {
  const { darkMode } = useDarkMode()
  const [activeTab, setActiveTab] = useState<'feedback' | 'pricing'>('feedback')
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    rating: 0
  })
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [feedbackList, setFeedbackList] = useState<FeedbackMessage[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  // Fetch feedback from database
  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('feedback_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3) // Show only the latest 3 feedbacks on the landing page

      if (!error && data) {
        setFeedbackList(data)
      }
      setLoading(false)
    }

    fetchFeedback()

    // Subscribe to new feedback in real-time
    const channel = supabase
      .channel('landing-feedback-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'feedback_messages'
        },
        (payload: any) => {
          // Add the new feedback to the top of the list and keep only 3 items
          setFeedbackList(prev => [payload.new, ...prev.slice(0, 2)])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Pricing data
  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: '₹0',
      period: 'Forever',
      description: 'Perfect for getting started',
      features: [
        'Access to 2 AI models',
        '10 comparisons per month',
        'Basic metrics & analytics',
        'Export results (CSV)',
        'Community support'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: '₹699',
      period: 'per year',
      description: 'For serious AI researchers',
      features: [
        'Access to 4 premium models',
        '500 comparisons per month',
        'Advanced comparison metrics',
        'Hyperparameter tuning tools',
        'Dataset analysis & EDA',
        'Priority customer support',
        'Advanced visualizations'
      ],
      popular: true
    },
    {
      id: 'pro-plus',
      name: 'Pro Plus Plan',
      price: '₹1,299',
      period: 'per year',
      description: 'Complete AI platform',
      features: [
        'Access to ALL AI models (6+)',
        'Unlimited comparisons & analytics',
        'Advanced AutoML capabilities',
        'SHAP/LIME explainability',
        'Custom model integration',
        'Priority support (24/7)',
        'Dedicated account manager',
        'Team collaboration'
      ],
      popular: false
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      const newData = { ...prev, [name]: value }
      return newData
    })
  }

  const handleRatingChange = (rating: number) => {
    setFormData(prev => {
      const newData = { ...prev, rating }
      return newData
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simple validation
    if (!formData.name.trim()) {
      alert('Please enter your name')
      return
    }
    
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      alert('Please enter a valid email')
      return
    }
    
    if (formData.rating === 0) {
      alert('Please select a rating')
      return
    }
    
    if (!formData.message.trim()) {
      alert('Please enter your feedback message')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }
      
      const result = await response.json()
      
      // Add the new feedback to the list immediately
      setFeedbackList(prev => [result.data, ...prev.slice(0, 2)])
      
      setIsSubmitting(false)
      setShowSuccess(true)
      setFormData({
        name: '',
        email: '',
        message: '',
        rating: 0
      })
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Error submitting feedback. Please try again.')
      setIsSubmitting(false)
      // You might want to show an error message to the user here
    }
  }

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => handleRatingChange(star)}
        onMouseEnter={() => setHoverRating(star)}
        onMouseLeave={() => setHoverRating(0)}
        className={`p-1 focus:outline-none transition-all duration-200 transform hover:scale-110 ${
          star <= (hoverRating || formData.rating)
            ? 'text-yellow-400'
            : darkMode ? 'text-gray-600' : 'text-gray-300'
        }`}
      >
        <Star
          className={`w-6 h-6 transition-all duration-200 ${
            star <= (hoverRating || formData.rating)
              ? 'fill-current'
              : 'fill-none'
          }`}
        />
      </button>
    ))
  }

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6 dark:from-white dark:to-gray-300">
            Experience the Best of AI Fiesta
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto dark:text-gray-300">
            Join thousands of users who trust our platform for AI model comparison
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className={`inline-flex p-1 rounded-xl backdrop-blur-sm ${
            darkMode 
              ? 'bg-gray-800/60 border border-gray-700/50' 
              : 'bg-white/80 border border-slate-200/50'
          }`}>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden ${
                activeTab === 'feedback'
                  ? 'text-white'
                  : darkMode 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeTab === 'feedback' && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl animate-pulse"></div>
              )}
              <span className="relative z-10">User Voices</span>
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden ${
                activeTab === 'pricing'
                  ? 'text-white'
                  : darkMode 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeTab === 'pricing' && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl animate-pulse"></div>
              )}
              <span className="relative z-10">Pricing</span>
            </button>
          </div>
        </div>
        
        {/* Content Container */}
        <div className={`rounded-3xl p-8 backdrop-blur-sm transition-all duration-500 relative overflow-hidden ${
          darkMode 
            ? 'bg-gray-800/40 border border-gray-700/50' 
            : 'bg-white/60 border border-slate-200/50'
        }`}>
          {/* Glowing Border Effect */}
          <div className="absolute inset-0 rounded-3xl">
            <div className="absolute inset-0 rounded-3xl border-2 border-transparent animate-border-glow"></div>
          </div>
          
          {/* Feedback Tab Content */}
          {activeTab === 'feedback' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Feedback Form */}
              <div>
                <h3 className={`text-2xl font-bold mb-6 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Share Your Experience
                </h3>
                
                {showSuccess ? (
                  <div className={`p-6 rounded-2xl mb-6 text-center ${
                    darkMode 
                      ? 'bg-green-900/30 border border-green-700/50' 
                      : 'bg-green-50 border border-green-200'
                  }`}>
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <h4 className={`font-bold mb-2 ${
                      darkMode ? 'text-green-400' : 'text-green-700'
                    }`}>
                      Feedback Submitted!
                    </h4>
                    <p className={`text-sm ${
                      darkMode ? 'text-green-300' : 'text-green-600'
                    }`}>
                      Thank you for your valuable feedback.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 ${
                          darkMode 
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                            : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-purple-500 focus:ring-purple-500/20'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Your email"
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 ${
                          darkMode 
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                            : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-purple-500 focus:ring-purple-500/20'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <div className="flex space-x-1 mb-2">
                        {renderStars()}
                      </div>
                    </div>
                    
                    <div>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Share your thoughts..."
                        rows={4}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 resize-none ${
                          darkMode 
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                            : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-purple-500 focus:ring-purple-500/20'
                        }`}
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group ${
                        isSubmitting 
                          ? 'opacity-75 cursor-not-allowed' 
                          : 'hover:shadow-lg'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-100 group-hover:opacity-0 transition-opacity duration-300"></div>
                      
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                          <span className="relative z-10 text-white">Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 relative z-10 text-white" />
                          <span className="relative z-10 text-white">Send Feedback</span>
                        </>
                      )}
                    </button>
                    
                    <div className="text-center mt-4">
                      <a 
                        href="/feedback" 
                        className={`text-sm font-medium transition-colors duration-200 ${
                          darkMode 
                            ? 'text-blue-400 hover:text-blue-300' 
                            : 'text-blue-600 hover:text-blue-700'
                        }`}
                      >
                        View All Feedback
                      </a>
                    </div>
                  </form>
                )}
              </div>
              
              {/* Feedback List */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-2xl font-bold transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    What Users Say
                  </h3>
                  <a 
                    href="/feedback" 
                    className={`text-sm font-medium transition-colors duration-200 ${
                      darkMode 
                        ? 'text-blue-400 hover:text-blue-300' 
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    View All
                  </a>
                </div>
                
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {feedbackList.map((feedback) => (
                      <div 
                        key={feedback.id}
                        className={`p-6 rounded-2xl transition-all duration-300 relative overflow-hidden group ${
                          darkMode 
                            ? 'bg-gray-700/30 border border-gray-600/50 hover:border-blue-500/30' 
                            : 'bg-white border border-slate-200/50 hover:border-blue-300/50'
                        }`}
                      >
                        {/* Glowing effect on hover */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className={`font-bold ${
                                darkMode ? 'text-white' : 'text-slate-900'
                              }`}>
                                {feedback.name}
                              </h4>
                              <p className={`text-sm ${
                                darkMode ? 'text-gray-400' : 'text-slate-500'
                              }`}>
                                {new Date(feedback.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < (feedback.rating || 0) 
                                      ? 'text-yellow-400 fill-current' 
                                      : darkMode ? 'text-gray-600' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className={`${
                            darkMode ? 'text-gray-300' : 'text-slate-700'
                          }`}>
                            {feedback.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Pricing Tab Content */}
          {activeTab === 'pricing' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onMouseEnter={() => setHoveredPlan(plan.id)}
                    onMouseLeave={() => setHoveredPlan(null)}
                    className={`relative rounded-2xl p-8 transition-all duration-300 ${
                      plan.popular
                        ? darkMode
                          ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-2 border-blue-500'
                          : 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-500'
                        : darkMode
                          ? 'bg-gray-700/30 border border-gray-600/50'
                          : 'bg-white border border-slate-200/50'
                    } ${
                      hoveredPlan === plan.id ? 'scale-105 shadow-2xl' : ''
                    }`}
                  >
                    {/* Glowing Border Effect */}
                    {hoveredPlan === plan.id && (
                      <div className="absolute inset-0 rounded-2xl">
                        <div className="absolute inset-0 rounded-2xl border-2 border-transparent animate-border-glow"></div>
                      </div>
                    )}
                    
                    {/* Popular Badge */}
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                          Most Popular
                        </div>
                      </div>
                    )}
                    
                    <div className="text-center mb-8">
                      <h3 className={`text-2xl font-bold mb-2 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {plan.name}
                      </h3>
                      <p className={`text-sm mb-6 ${
                        darkMode ? 'text-gray-400' : 'text-slate-600'
                      }`}>
                        {plan.description}
                      </p>
                      
                      <div className="mb-6">
                        <span className={`text-4xl font-bold ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {plan.price}
                        </span>
                        <span className={`text-sm block mt-1 ${
                          darkMode ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          {plan.period}
                        </span>
                      </div>
                    </div>
                    
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className={`text-sm ${
                            darkMode ? 'text-gray-300' : 'text-slate-600'
                          }`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <button className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
                        : darkMode
                          ? 'bg-gray-600 text-white hover:bg-gray-500'
                          : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                    }`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10">
                        {plan.id === 'free' ? 'Get Started' : 'Choose Plan'}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Pricing Footer */}
              <div className={`mt-12 pt-8 border-t text-center ${
                darkMode ? 'border-gray-700/50' : 'border-slate-200/50'
              }`}>
                <p className={`mb-4 ${
                  darkMode ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  Need a custom plan for your team?
                </p>
                <button className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group ${
                  darkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Contact Sales</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes border-glow {
          0% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(139, 92, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(139, 92, 246, 0.8);
          }
          100% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(139, 92, 246, 0.5);
          }
        }
        .animate-border-glow {
          animation: border-glow 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}