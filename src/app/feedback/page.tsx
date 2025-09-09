'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import { Star, Send } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import Navigation from '@/components/Navigation'

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
    id: string
    name: string
    rating: number
    message: string
    created_at: string
  }>>([])
  const [submitError, setSubmitError] = useState('')

  const supabase = createClient();

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
          if (payload.new.user_id === user?.id) {
            setShowModal(true);
            // Reset form after successful submission
            setFormData({
              name: user?.user_metadata?.full_name || '',
              email: user?.email || '',
              message: '',
              rating: 0
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth');
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
      
      // The real-time subscription will handle adding the new feedback to the list
      // Show success modal
      setShowModal(true);
    } catch (error: Error) {
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
            ? 'text-yellow-400'
            : 'text-gray-300'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AdvancedSidebar />
      <div className="ml-16 lg:ml-72">
        <Navigation />
        
        <main className="max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Your Feedback Matters</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Help us improve AI Fiesta by sharing your experience and suggestions.
            </p>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="max-w-6xl mx-auto mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl">
              <p className="font-medium">{submitError}</p>
            </div>
          )}

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
                          : 'border-slate-200 focus:border-purple-400 focus:shadow-[0_0_15px_rgba(168,85,247,0.5)]'
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
                          : 'border-slate-200 focus:border-purple-400 focus:shadow-[0_0_15px_rgba(168,85,247,0.5)]'
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
                          : 'border-slate-200 focus:border-purple-400 focus:shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                      }`}
                    />
                    {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 border-2 border-purple-400 hover:border-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.5)] ${isSubmitting ? 'animate-pulse' : ''}`}
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
                    className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-slate-900">{feedback.name}</h4>
                        <p className="text-sm text-slate-500">{new Date(feedback.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
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
      </div>
    </div>
  )
}