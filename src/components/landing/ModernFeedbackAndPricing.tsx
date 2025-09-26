'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Star, Send, DollarSign, Crown, Zap, Check, Mail, MessageSquare, Phone, Clock } from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/NotificationContext'
import { usePopup } from '@/contexts/PopupContext'
import { createStripeCheckout, redirectToCheckout } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/client'
import type { Database } from '@/types/database'

type FeedbackMessage = Database['public']['Tables']['feedback_messages']['Row']

export default function ModernFeedbackAndPricing() {
  const router = useRouter()
  const { darkMode } = useDarkMode()
  const { user } = useAuth()
  const { success, error } = useToast()
  const { openPaymentPopup } = usePopup()
  const [activeTab, setActiveTab] = useState<'pricing'>('pricing')
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    rating: 0
  })
  const [contactFormData, setContactFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    subject: '',
    message: ''
  })
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [feedbackList, setFeedbackList] = useState<FeedbackMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({})

  const supabase = createClient()

  // Fetch feedback from database
  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('feedback_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)

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

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email',
      value: 'support@aifiesta.com',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our team',
      value: 'Available 24/7',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us directly',
      value: '+1 (555) 123-4567',
      color: 'from-purple-500 to-purple-600'
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      const newData = { ...prev, [name]: value }
      return newData
    })
  }

  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (contactErrors[name]) {
      setContactErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateContactForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!contactFormData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!contactFormData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactFormData.email)) {
      newErrors.email = 'Invalid email format'
    }
    
    if (!contactFormData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }
    
    if (!contactFormData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (contactFormData.message.length < 10) {
      newErrors.message = 'Message should be at least 10 characters'
    }
    
    setContactErrors(newErrors)
    return Object.keys(newErrors).length === 0
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
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateContactForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactFormData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }
      
      // Reset form after successful submission
      setContactFormData({ 
        name: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        subject: '', 
        message: '' 
      })
      
      // Show success message
      alert('Message sent successfully! Our team will get back to you soon.')
    } catch (error: any) {
      console.error('Error sending message:', error)
      alert(error.message || 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChoosePlan = async (planId: string) => {
    // If it's the free plan, no need to redirect to Stripe
    if (planId === 'free') {
      success('Free Plan Selected', 'You can get started with the free plan right away!')
      return
    }

    // Instead of processing payment directly, open the payment popup
    openPaymentPopup()
  }

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => handleRatingChange(star)}
        className={`p-1 focus:outline-none ${
          star <= (hoverRating || formData.rating)
            ? 'text-yellow-400'
            : 'text-gray-300'
        }`}
        aria-label={`Rate ${star} stars`}
      >
        <Star
          className={`w-5 h-5 sm:w-6 sm:h-6 ${
            star <= (hoverRating || formData.rating)
              ? 'fill-current'
              : 'fill-none'
          }`}
        />
      </button>
    ))
  }

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4 sm:mb-6 dark:from-white dark:to-gray-300">
            Experience the Best of AI Fiesta
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto dark:text-gray-300">
            Join thousands of users who trust our platform for AI model comparison
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className={`inline-flex p-1 rounded-xl backdrop-blur-sm ${
            darkMode 
              ? 'bg-gray-800/60 border border-gray-700/50' 
              : 'bg-white/80 border border-slate-200/50'
          }`}>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 relative overflow-hidden ${
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
        <div className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-sm transition-all duration-500 relative overflow-hidden ${
          darkMode 
            ? 'bg-gray-800/40 border border-gray-700/50' 
            : 'bg-white/60 border border-slate-200/50'
        }`}>
          {/* Glowing Border Effect */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl">
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent animate-border-glow"></div>
          </div>
          
          {/* Pricing Tab Content */}
          {activeTab === 'pricing' && (
            <div>
              <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onMouseEnter={() => setHoveredPlan(plan.id)}
                    onMouseLeave={() => setHoveredPlan(null)}
                    className={`relative rounded-2xl p-6 sm:p-8 transition-all duration-300 ${
                      plan.popular
                        ? darkMode
                          ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-2 border-blue-500'
                          : 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-500'
                        : darkMode
                          ? 'bg-gray-700/30 border border-gray-600/50'
                          : 'bg-white border border-slate-200/50'
                    } ${
                      hoveredPlan === plan.id ? 'scale-[1.02] shadow-xl' : ''
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
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                          Most Popular
                        </div>
                      </div>
                    )}
                    
                    <div className="text-center mb-6 sm:mb-8">
                      <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {plan.name}
                      </h3>
                      <p className={`text-xs sm:text-sm mb-4 sm:mb-6 ${
                        darkMode ? 'text-gray-400' : 'text-slate-600'
                      }`}>
                        {plan.description}
                      </p>
                      
                      <div className="mb-4 sm:mb-6">
                        <span className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {plan.price}
                        </span>
                        <span className={`text-xs sm:text-sm block mt-1 ${
                          darkMode ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          {plan.period}
                        </span>
                      </div>
                    </div>
                    
                    <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2 sm:space-x-3">
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className={`text-xs sm:text-sm ${
                            darkMode ? 'text-gray-300' : 'text-slate-600'
                          }`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <button 
                      onClick={() => handleChoosePlan(plan.id)}
                      disabled={isProcessing === plan.id}
                      className={`w-full py-2 px-4 sm:py-3 sm:px-6 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group text-sm sm:text-base ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
                          : darkMode
                            ? 'bg-gray-600 text-white hover:bg-gray-500'
                            : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                      }`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10">
                        {isProcessing === plan.id ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : plan.id === 'free' ? (
                          'Get Started'
                        ) : (
                          'Choose Plan'
                        )}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Pricing Footer */}
              <div className={`mt-8 sm:mt-12 pt-6 sm:pt-8 border-t text-center ${
                darkMode ? 'border-gray-700/50' : 'border-slate-200/50'
              }`}>
                <p className={`mb-3 sm:mb-4 text-sm sm:text-base ${
                  darkMode ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  Need a custom plan for your team?
                </p>
                
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
        
        @media (max-width: 768px) {
          .scale-[1.02] {
            transform: scale(1.01);
          }
        }
      `}</style>
    </section>
  )
}