'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { Star, Send } from 'lucide-react'

export default function FeedbackPage() {
  const { user, loading } = useAuth()
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
    id: number
    name: string
    rating: number
    message: string
    date: string
  }>>([])

  // Simulate loading existing feedback
  useEffect(() => {
    // In a real app, this would fetch from an API
    const existingFeedback = [
      {
        id: 1,
        name: "Alex Johnson",
        rating: 5,
        message: "The AI comparison feature is amazing! Saved me hours of testing different models.",
        date: "2023-06-15"
      },
      {
        id: 2,
        name: "Sarah Williams",
        rating: 4,
        message: "Great interface and responsive support team. Would recommend to anyone!",
        date: "2023-06-10"
      }
    ]
    setFeedbackList(existingFeedback)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth')
    return null
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    
    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message should be at least 10 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Add to feedback list (simulating real-time update)
    const newFeedback = {
      id: Date.now(),
      name: formData.name,
      rating: formData.rating,
      message: formData.message,
      date: new Date().toLocaleDateString()
    }
    
    setFeedbackList(prev => [newFeedback, ...prev])
    
    // Show success modal
    setShowModal(true)
    
    // Reset form
    setFormData({
      name: user?.user_metadata?.full_name || '',
      email: user?.email || '',
      message: '',
      rating: 0
    })
    
    setIsSubmitting(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
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
        className={`p-1 focus:outline-none ${
          star <= (hoverRating || formData.rating)
            ? 'text-yellow-400'
            : 'text-gray-300'
        }`}
      >
        <Star
          className={`w-8 h-8 ${
            star <= (hoverRating || formData.rating)
              ? 'fill-current'
              : 'fill-none'
          } transition-all duration-200`}
        />
      </button>
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Your Feedback Matters</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Help us improve AI Fiesta by sharing your experience and suggestions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feedback Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Share Your Thoughts</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 ${
                      errors.name 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-slate-200 focus:border-purple-400'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 ${
                      errors.email 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-slate-200 focus:border-purple-400'
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Rating
                  </label>
                  <div className="flex space-x-1">
                    {renderStars()}
                  </div>
                  {errors.rating && <p className="mt-1 text-sm text-red-500">{errors.rating}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Share your thoughts, suggestions, or report issues..."
                    rows={6}
                    className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 resize-none ${
                      errors.message 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-slate-200 focus:border-purple-400'
                    }`}
                  />
                  {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 border-2 border-purple-400 hover:border-purple-300"
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
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Feedback Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Average Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-bold text-slate-900">4.8</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Total Feedback</span>
                  <span className="font-bold text-slate-900">{feedbackList.length + 127}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Positive Feedback</span>
                  <span className="font-bold text-slate-900">92%</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Recent Feedback</h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">Alex Johnson</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    "The AI comparison feature is amazing! Saved me hours of testing different models."
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">Sarah Williams</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    "Great interface and responsive support team. Would recommend to anyone!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submitted Feedback */}
        {feedbackList.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Recent Feedback</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {feedbackList.map((feedback) => (
                <div 
                  key={feedback.id} 
                  className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 animate-fadeIn"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900">{feedback.name}</h4>
                      <p className="text-sm text-slate-500">{feedback.date}</p>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-700">{feedback.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h3>
              <p className="text-slate-600 mb-6">
                Thank you for your feedback! We appreciate your input.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}