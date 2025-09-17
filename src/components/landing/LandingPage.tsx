'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, MessageSquare, Zap, BarChart3, Shield, Clock, Users, Brain, Sparkles, Star, ChevronRight, Play, Globe, TrendingUp, Award, Infinity, Cpu, Layers, GitBranch, Settings as SettingsIcon, LogOut, Moon, Sun, DollarSign, MessageCircle } from 'lucide-react'
import ModernModelShowcase from './ModernModelShowcase'
import { useEffect, useState } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'

export default function LandingPage() {
  const { user, signOut } = useAuth()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const searchParams = useSearchParams()
  
  // Check for success message in URL parameters
  useEffect(() => {
    const deleted = searchParams.get('deleted')
    const message = searchParams.get('message')
    
    if (deleted && message) {
      setPopupMessage(decodeURIComponent(message))
      setShowSuccessPopup(true)
      
      // Auto-hide the popup after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessPopup(false)
        // Remove the parameters from the URL
        window.history.replaceState({}, document.title, '/')
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  const getUserInitials = () => {
    if (!user?.email) return 'U'
    return user.email.charAt(0).toUpperCase()
  }

  const getUserDisplayName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  }

  const getProfilePicture = () => {
    // Check if avatar_url exists in user_metadata
    if (user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }
    // If not, return null (the avatar_url does not exist directly on the user object)
    return null;
  };
  
  const features = [
    {
      icon: MessageSquare,
      title: 'Universal Input',
      description: 'One message box sends to all selected AI models simultaneously. No need to repeat yourself.',
      gradient: 'from-blue-500 to-cyan-500',
      stats: '1 Input → 9+ Models'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get instant responses from multiple AI models in real-time with optimized parallel processing.',
      gradient: 'from-yellow-500 to-orange-500',
      stats: '<0.5s Response Time'
    },
    {
      icon: BarChart3,
      title: 'Smart Comparison',
      description: 'Side-by-side cards make it easy to compare quality, style, and accuracy of responses.',
      gradient: 'from-green-500 to-emerald-500',
      stats: 'Visual Side-by-Side'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with encrypted storage and user authentication.',
      gradient: 'from-purple-500 to-violet-500',
      stats: 'End-to-End Encrypted'
    },
    {
      icon: Clock,
      title: 'Rich History',
      description: 'Access complete conversation history with searchable responses and best response tracking.',
      gradient: 'from-pink-500 to-rose-500',
      stats: 'Unlimited Storage'
    },
    {      
      icon: Users,
      title: 'Premium Models',
      description: 'Access to cutting-edge AI models including GPT-5, Claude 4, and emerging models.',
      gradient: 'from-indigo-500 to-blue-500',
      stats: '9+ AI Providers'
    }
  ]

  const steps = [
    {
      number: '01',
      title: 'Choose Your Models',
      description: 'Select from 9+ premium AI models using our intuitive model selector.',
      icon: Brain
    },
    {
      number: '02', 
      title: 'Send One Message',
      description: 'Type your question once and watch it reach all selected models instantly.',
      icon: MessageSquare
    },
    {
      number: '03',
      title: 'Compare & Choose',
      description: 'Review responses side-by-side and mark the best one for future reference.',
      icon: Star
    }
  ]

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error during sign out:', error);
      // Even if there's an error, redirect to auth page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
    }
  };

  const profilePicture = getProfilePicture();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Success Message Popup */}
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 z-[100] animate-fade-in">
          <div className="bg-white border border-green-200 text-green-700 px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-fade-in transform transition-all duration-300 hover:scale-105">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-green-800">Success!</div>
              <div className="text-sm font-medium">{popupMessage}</div>
            </div>
            <button 
              onClick={() => setShowSuccessPopup(false)}
              className="text-green-500 hover:text-green-700 ml-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo that redirects to Chat section */}
            <div className="flex items-center space-x-3">
              <Link href={user ? "/chat" : "/"} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  AI Fiesta
                </h1>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {/* Pricing link with modern design - icon only */}
                  <Link
                    href="/payment"
                    className="relative flex items-center justify-center p-2 rounded-full font-bold transition-all duration-300 group overflow-hidden"
                    title="Pricing"
                  >
                    {/* Animated gold border - always visible with hover effect */}
                    <div className="absolute inset-0 rounded-full">
                      <div className="absolute inset-0 rounded-full border-2 border-yellow-400/50 group-hover:border-yellow-400 transition-all duration-300"></div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 opacity-100 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                      
                    {/* Transparent background with gold icon - always visible */}
                    <div className="relative flex items-center justify-center p-2 rounded-full">
                      <DollarSign className="w-5 h-5 text-yellow-400" />
                    </div>
                  </Link>
                  
                  {/* Feedback link with modern design - icon only */}
                  <Link
                    href="/public-feedback"
                    className="relative flex items-center justify-center p-2 rounded-full font-bold transition-all duration-300 group overflow-hidden"
                    title="Feedback"
                  >
                    {/* Animated gold border - always visible with hover effect */}
                    <div className="absolute inset-0 rounded-full">
                      <div className="absolute inset-0 rounded-full border-2 border-yellow-400/50 group-hover:border-yellow-400 transition-all duration-300"></div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 opacity-100 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                      
                    {/* Transparent background with gold icon - always visible */}
                    <div className="relative flex items-center justify-center p-2 rounded-full">
                      <MessageCircle className="w-5 h-5 text-yellow-400" />
                    </div>
                  </Link>
                  
                  {/* Profile icon for logged-in users */}
                  <div className="flex items-center space-x-2">
                    {/* Dark mode toggle button */}
                    <button
                      onClick={toggleDarkMode}
                      className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors duration-200`}
                      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                      {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    
                    <div className="relative group">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${darkMode ? 'from-blue-500 to-purple-600 ring-2 ring-white/30' : 'from-blue-500 to-purple-600'} flex items-center justify-center text-white font-bold cursor-pointer transition-all duration-200 hover:scale-105`}
                      >
                        {profilePicture ? (
                          <img src={profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className={`${darkMode ? 'text-white' : 'text-white'}`}>
                            {getUserInitials()}
                          </span>
                        )}
                      </div>
                      {/* Dropdown menu */}
                      <div className={`absolute right-0 mt-2 w-48 rounded-xl ${darkMode ? 'bg-gray-800/90 border-gray-700/50 backdrop-blur-lg' : 'bg-white/90 border-slate-200/50'} shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50`}>
                        <Link
                          href="/chat"
                          className={`flex items-center space-x-2 px-4 py-2 ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-slate-700 hover:bg-slate-100'} rounded-lg transition-colors`}
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Chat</span>
                        </Link>
                        <Link
                          href="/history"
                          className={`flex items-center space-x-2 px-4 py-2 ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-slate-700 hover:bg-slate-100'} rounded-lg transition-colors`}
                        >
                          <Clock className="w-4 h-4" />
                          <span>History</span>
                        </Link>
                        <Link
                          href="/account-settings"
                          className={`flex items-center space-x-2 px-4 py-2 ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-slate-700 hover:bg-slate-100'} rounded-lg transition-colors`}
                        >
                          <SettingsIcon className="w-4 h-4" />
                          <span>Account Settings</span>
                        </Link>
                        <div className={`border-t ${darkMode ? 'border-gray-700/50' : 'border-slate-200/50'} my-2`}></div>
                        <Link
                          href="/public-feedback"
                          className={`flex items-center space-x-2 px-4 py-2 ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-slate-700 hover:bg-slate-100'} rounded-lg transition-colors`}
                        >
                          <Star className="w-4 h-4" />
                          <span>User Voices</span>
                        </Link>
                        <div className={`border-t ${darkMode ? 'border-gray-700/50' : 'border-slate-200/50'} my-2`}></div>
                        <button
                          onClick={handleSignOut}
                          className={`flex items-center space-x-2 px-4 py-2 ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-slate-700 hover:bg-slate-100'} rounded-lg transition-colors w-full text-left`}
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  {/* Dark mode toggle button for non-logged-in users */}
                  <button
                    onClick={toggleDarkMode}
                    className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors duration-200`}
                    aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  
                  {/* Sign in button for non-logged-in users */}
                  <Link
                    href="/auth"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-400/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
          
          {/* Floating geometric shapes */}
          <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg rotate-45 animate-bounce" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-1/3 left-1/5 w-6 h-6 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-1/2 left-3/4 w-4 h-12 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.8s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge with glowing gold effect */}
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-full px-4 py-2 mb-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-slate-700 relative z-10">Compare 9+ Premium AI Models</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8">
              <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                AI Model
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Comparison
              </span>
              <br />
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Send one message to multiple AI models and compare their responses instantly. 
              <span className="text-blue-600 font-semibold"> Find the perfect AI</span> for every task.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                href={user ? "/chat" : "/auth"}
                className="group bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center space-x-3 relative overflow-hidden"
              >
                {/* Glowing gold effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <Play className="w-6 h-6 relative z-10" />
                <span className="relative z-10">Start Comparing</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              </Link>
              
              <div className="flex items-center space-x-4 text-slate-600">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white`}></div>
                  ))}
                </div>
                <span className="text-sm font-medium">9+ AI Models Available</span>
              </div>
            </div>

            {/* Enhanced Stats with glowing gold effect */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="group text-center p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/60 transition-all duration-300 hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 relative z-10">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2 relative z-10">9+</div>
                <div className="text-slate-600 font-medium relative z-10">AI Models</div>
              </div>
              <div className="group text-center p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/60 transition-all duration-300 hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3 relative z-10">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2 relative z-10">1</div>
                <div className="text-slate-600 font-medium relative z-10">Universal Input</div>
              </div>
              <div className="group text-center p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/60 transition-all duration-300 hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-3 relative z-10">
                  <Infinity className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2 relative z-10">∞</div>
                <div className="text-slate-600 font-medium relative z-10">Comparisons</div>
              </div>
              <div className="group text-center p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/60 transition-all duration-300 hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3 relative z-10">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2 relative z-10">0.5s</div>
                <div className="text-slate-600 font-medium relative z-10">Avg Response</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-full px-4 py-2 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              <Zap className="w-4 h-4 text-blue-500 relative z-10" />
              <span className="text-sm font-medium text-slate-700 relative z-10">Powerful Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Built for researchers, developers, and AI enthusiasts who demand the best
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="group relative bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  {/* Glowing gold effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg relative z-10`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <h3 className="text-xl font-bold text-slate-900">
                      {feature.title}
                    </h3>
                    <div className={`px-3 py-1 bg-gradient-to-r ${feature.gradient} text-white text-xs font-bold rounded-full opacity-80`}>
                      {feature.stats}
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed relative z-10">
                    {feature.description}
                  </p>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Floating indicator */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Modern AI Models Section */}
      <ModernModelShowcase />

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-300/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-300/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-full px-4 py-2 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              <Star className="w-4 h-4 text-blue-500 relative z-10" />
              <span className="text-sm font-medium text-slate-700 relative z-10">Trusted by Thousands</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Join researchers, developers, and AI enthusiasts who love AI Fiesta
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Chen",
                role: "AI Researcher",
                company: "Stanford University",
                avatar: "SC",
                rating: 5,
                text: "AI Fiesta has revolutionized how I compare model outputs for my research. The side-by-side comparison saves me hours every day.",
                gradient: "from-blue-500 to-purple-500"
              },
              {
                name: "Marcus Rodriguez",
                role: "Senior Developer",
                company: "TechCorp",
                avatar: "MR",
                rating: 5,
                text: "The universal input feature is a game-changer. I can test prompts across multiple models instantly and find the best responses.",
                gradient: "from-green-500 to-blue-500"
              },
              {
                name: "Emily Zhang",
                role: "Product Manager",
                company: "StartupAI",
                avatar: "EZ",
                rating: 5,
                text: "Perfect tool for evaluating AI models for our product. The history feature helps us track which models work best for different use cases.",
                gradient: "from-pink-500 to-purple-500"
              }
            ].map((testimonial, index) => (
              <div key={index} className="group bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
                {/* Glowing gold effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                
                {/* Decorative gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl relative z-10`}></div>
                
                <div className="relative z-20">
                  {/* Rating stars */}
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  {/* Testimonial text */}
                  <p className="text-slate-700 leading-relaxed mb-6 text-lg">
                    "{testimonial.text}"
                  </p>
                  
                  {/* Author info */}
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{testimonial.name}</div>
                      <div className="text-sm text-slate-600">{testimonial.role}</div>
                      <div className="text-xs text-blue-600 font-medium">{testimonial.company}</div>
                    </div>
                  </div>
                  
                  {/* Quote decoration */}
                  <div className="absolute top-4 right-4 text-6xl text-slate-200/50 font-serif">&ldquo;</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">10K+</div>
                <div className="text-sm text-slate-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">500K+</div>
                <div className="text-sm text-slate-600">Comparisons Made</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">99.9%</div>
                <div className="text-sm text-slate-600">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">4.9/5</div>
                <div className="text-sm text-slate-600">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-full px-4 py-2 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              <Play className="w-4 h-4 text-blue-500 relative z-10" />
              <span className="text-sm font-medium text-slate-700 relative z-10">How It Works</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6">
              Three Simple Steps
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get started with AI model comparison in minutes
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="relative group">
                  {/* Enhanced Connection Line with gradient */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-1 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 transform translate-x-4 rounded-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse opacity-50"></div>
                    </div>
                  )}
                  
                  <div className="text-center relative">
                    {/* Enhanced icon container with animated rings */}
                    <div className="relative mx-auto mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl relative overflow-hidden">
                        <Icon className="w-10 h-10 text-white relative z-10" />
                        
                        {/* Animated background pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      {/* Animated rings around icon */}
                      <div className="absolute inset-0 rounded-3xl border-2 border-blue-300/30 animate-ping" style={{animationDuration: '3s', animationDelay: `${index * 0.5}s`}}></div>
                      <div className="absolute inset-0 rounded-3xl border border-purple-300/20 animate-pulse" style={{animationDelay: `${index * 0.3}s`}}></div>
                    </div>
                    
                    {/* Enhanced step number */}
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold rounded-full mb-4 shadow-lg">
                      {step.number}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">
                      {step.description}
                    </p>
                    
                    {/* Floating badge */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce">
                      <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(30)].map((_, i) => {
              // Use index-based positioning for consistent SSR/client rendering
              const left = ((i * 37) % 100);
              const top = ((i * 23) % 100);
              const delay = (i * 0.3) % 3;
              const duration = 2 + ((i * 0.2) % 2);
              
              return (
                <div 
                  key={i} 
                  className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    animationDelay: `${delay}s`,
                    animationDuration: `${duration}s`
                  }}
                />
              )
            })}
          </div>
          
          {/* Floating geometric shapes */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/5 rounded-lg rotate-45 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-3/4 right-1/3 w-16 h-16 bg-white/5 rounded-full animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3s'}}></div>
        </div>
        
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Enhanced heading with animated underline */}
          <div className="relative inline-block mb-6">
            <h2 className="text-4xl sm:text-5xl font-bold text-white relative z-10">
              Ready to Compare AI Models?
            </h2>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full"></div>
          </div>
          
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of researchers and developers who trust AI Fiesta for their AI model comparisons.
            <span className="block mt-2 text-white/80 font-semibold">Start your journey to AI excellence today.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Link
              href={user ? "/chat" : "/auth"}
              className="group relative bg-white text-blue-600 px-8 py-4 rounded-2xl text-lg font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center space-x-3 overflow-hidden"
            >
              {/* Animated background on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              
              {/* Glowing gold effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              
              <Sparkles className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10">Start Free Today</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Link>
            
            <div className="text-blue-100 text-sm space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-semibold">Free to use</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <span>No credit card required</span>
              </div>
            </div>
          </div>
          
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
            <div className="flex items-center space-x-2 text-white/80">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">99.9% Uptime</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">10K+ Users</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Main footer content */}
        <div className="relative py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand section */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">AI Fiesta</span>
                </div>
                <p className="text-slate-400 leading-relaxed mb-6 max-w-md">
                  The ultimate platform for comparing AI models. Send one message to multiple AI models and find the perfect response for every task.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Online</span>
                  </div>
                  <div className="text-sm text-slate-500">
                    <span className="font-semibold text-slate-400">10K+</span> active users
                  </div>
                </div>
              </div>
              
              {/* Quick links */}
              <div>
                <h4 className="font-bold text-white mb-4">Platform</h4>
                <ul className="space-y-2">
                  {[
                    { name: 'Compare Models', href: '/chat' },
                    { name: 'View History', href: '/history' },
                    { name: 'API Access', href: '/api' },
                    { name: 'Documentation', href: '/docs' }
                  ].map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="text-slate-400 hover:text-white transition-colors duration-200 text-sm flex items-center space-x-2">
                        <ChevronRight className="w-3 h-3" />
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* AI Models */}
              <div>
                <h4 className="font-bold text-white mb-4">AI Models</h4>
                <ul className="space-y-2">
                  {[
                    'GPT-5',
                    'Claude 4 Sonnet',
                    'Gemini 2.5',
                    'DeepSeek'
                  ].map((model, index) => (
                    <li key={index}>
                      <Link href="/chat" className="text-slate-400 hover:text-white transition-colors duration-200 text-sm flex items-center space-x-2 group">
                        <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:bg-blue-300 transition-colors duration-200"></div>
                        <span className="hover:underline">{model}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="border-t border-slate-700/50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6">
                <div className="text-slate-400 text-sm">
                  © 2024 AI Fiesta. Built for AI enthusiasts, by AI enthusiasts.
                </div>
                <div className="hidden md:flex items-center space-x-4 text-xs text-slate-500">
                  <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
                  <span>•</span>
                  <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
                  <span>•</span>
                  <Link href="/support" className="hover:text-slate-300 transition-colors">Support</Link>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>All systems operational</span>
                </div>
                <div className="text-xs text-slate-500">
                  Version 1.0.0
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative gradient line */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      </footer>
    </div>
  )
}