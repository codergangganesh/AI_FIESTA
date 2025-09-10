'use client'

import ModernAuthForm from '@/components/auth/ModernAuthForm'
import AuthIllustration from '@/components/auth/AuthIllustration'

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Glowing particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-violet-600 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-violet-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Glowing lines */}
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-violet-500/20 via-violet-400/10 to-transparent"></div>
        <div className="absolute top-1/3 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent"></div>
        <div className="absolute bottom-1/4 right-1/3 w-1/3 h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Illustration Section */}
          <div className="hidden lg:flex justify-center">
            <div className="w-80 h-80">
              <AuthIllustration />
            </div>
          </div>

          {/* Auth Form Section */}
          <div className="w-full">
            <div className="bg-black/30 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-8 shadow-2xl shadow-violet-500/20 animate-float">
              {/* Logo */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30 ring-1 ring-violet-500/50">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-1">AI Fiesta</h1>
                <p className="text-violet-300">Your Journey to AI Excellence</p>
              </div>

              {/* Auth Form */}
              <ModernAuthForm />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-violet-300/70 text-sm">
            © 2025 AI Fiesta. All rights reserved.
          </p>
        </div>
      </div>

      {/* Additional decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl"></div>
      <div className="absolute top-1/3 right-20 w-24 h-24 bg-violet-600/10 rounded-full blur-2xl"></div>
    </div>
  )
}