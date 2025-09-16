'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useRouter } from 'next/navigation'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import { Mail, Send, Phone, MessageSquare, Clock } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import SimplifiedNavigation from '@/components/SimplifiedNavigation'
import SimpleProfileIcon from '@/components/layout/SimpleProfileIcon'

export default function ContactPage() {
  const { user, loading } = useAuth()
  const { darkMode } = useDarkMode()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    subject: '',
    message: '',
    priority: 'medium'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const supabase = createClient()

  // Handle navigation when user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  // Subscribe to contact messages in real-time for the current user
  useEffect(() => {
    if (!user?.id) return

    const channel = supabase
      .channel('contact-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'contact_messages',
          filter: `user_id=eq.${user.id}`
        },
        (payload: any) => {
          // If the updated message is ours and status changed to resolved/closed
          if (payload.new.user_id === user?.id && 
              ['resolved', 'closed'].includes(payload.new.status)) {
            // Show a notification or update UI
            console.log('Message status updated:', payload.new.status)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show nothing while redirecting
  if (!user) {
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
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
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
    setSubmitError('')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }
      
      // Show success modal
      setShowModal(true)
      // Reset form after successful submission
      setFormData({ 
        name: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        subject: '', 
        message: '', 
        priority: 'medium' 
      })
    } catch (error: any) {
      console.error('Error sending message:', error)
      setSubmitError(error.message || 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
              Get in Touch
            </h1>
            <p className={`text-xl max-w-2xl mx-auto transition-colors duration-200 ${
              darkMode ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Have questions about AI Fiesta? We're here to help you get the most out of our AI comparison platform.
            </p>
          </div>

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
            {/* Contact Methods */}
            <div className="lg:col-span-1 space-y-6">
              <div className={`rounded-2xl p-6 transition-colors duration-200 backdrop-blur-sm ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <h3 className={`text-xl font-bold mb-6 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Contact Methods
                </h3>
                
                <div className="space-y-4">
                  {contactMethods.map((method, index) => {
                    const Icon = method.icon
                    return (
                      <div key={index} className={`flex items-start space-x-4 p-4 rounded-xl transition-colors duration-200 ${
                        darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-slate-50/50'
                      }`}>
                        <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold mb-1 transition-colors duration-200 ${
                            darkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            {method.title}
                          </h4>
                          <p className={`text-sm mb-1 transition-colors duration-200 ${
                            darkMode ? 'text-gray-400' : 'text-slate-600'
                          }`}>
                            {method.description}
                          </p>
                          <p className={`text-sm font-medium transition-colors duration-200 ${
                            darkMode ? 'text-blue-400' : 'text-blue-600'
                          }`}>
                            {method.value}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Quick Info */}
              <div className={`rounded-2xl p-6 transition-colors duration-200 backdrop-blur-sm ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Office Hours
                </h3>
                <div className={`flex items-center space-x-3 transition-colors duration-200 ${
                  darkMode ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  <Clock className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Monday - Friday</p>
                    <p className="text-sm">9:00 AM - 6:00 PM PST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className={`rounded-2xl p-8 transition-colors duration-200 backdrop-blur-sm ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <h3 className={`text-2xl font-bold mb-6 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Send us a Message
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
                            ? 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-700/50 text-white placeholder-gray-400' 
                            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white text-slate-900 placeholder-slate-500'
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
                            ? 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-700/50 text-white placeholder-gray-400' 
                            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white text-slate-900 placeholder-slate-500'
                      }`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>

                  {/* Subject */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${
                      darkMode ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="How can we help you?"
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 ${
                        errors.subject 
                          ? darkMode 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-gray-700/50' 
                            : 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-white'
                          : darkMode 
                            ? 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-700/50 text-white placeholder-gray-400' 
                            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white text-slate-900 placeholder-slate-500'
                      }`}
                    />
                    {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
                  </div>

                  {/* Priority */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${
                      darkMode ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 ${
                        darkMode 
                          ? 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-700/50 text-white' 
                          : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white text-slate-900'
                      }`}
                    >
                      <option value="low" className={darkMode ? 'bg-gray-700' : 'bg-white'}>Low Priority</option>
                      <option value="medium" className={darkMode ? 'bg-gray-700' : 'bg-white'}>Medium Priority</option>
                      <option value="high" className={darkMode ? 'bg-gray-700' : 'bg-white'}>High Priority</option>
                      <option value="urgent" className={darkMode ? 'bg-gray-700' : 'bg-white'}>Urgent</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${
                      darkMode ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your question or issue..."
                      rows={6}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 resize-none ${
                        errors.message 
                          ? darkMode 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-gray-700/50' 
                            : 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-white'
                          : darkMode 
                            ? 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-700/50 text-white placeholder-gray-400' 
                            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white text-slate-900 placeholder-slate-500'
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
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>

        {/* Success Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`rounded-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-100 shadow-2xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className={`text-2xl font-bold mb-2 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Message Sent Successfully!
                </h3>
                <p className={`mb-6 transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Thank you for contacting us. Our team will get back to you soon.
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg ${
                    darkMode 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}