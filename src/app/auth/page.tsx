'use client'

import ModernAuthForm from '@/components/auth/ModernAuthForm'

export default function AuthPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-6 md:grid-cols-8 gap-2 md:gap-4 h-full w-full transform rotate-12 scale-150">
            {Array.from({ length: 48 }).map((_, i) => (
              <div
                key={i}
                className="border border-blue-300 rounded-lg animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white px-12 py-16 animate-fade-in">
          {/* Logo */}
          <div className="mb-12 animate-float">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-2xl ring-4 ring-blue-400/20 hover:ring-blue-300/30 transition-all duration-300">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              AI Fiesta
            </h1>
            <p className="text-xl text-blue-200 text-center font-light">
              Your Journey to AI Excellence
            </p>
          </div>

          {/* Mission Statement */}
          <div className="bg-blue-800/30 backdrop-blur-sm border border-blue-600/30 rounded-2xl p-8 mb-12 max-w-md">
            <p className="text-lg leading-relaxed text-blue-100 text-center">
              The best way to predict the future is to create it. At AI Fiesta, 
              we're not just comparing AI models - we're shaping the next generation 
              of AI innovators.
            </p>
          </div>

          {/* CEO Information */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <span className="text-white font-bold text-lg">MG</span>
            </div>
            <h3 className="text-xl font-semibold mb-1">Mannam Ganesh Babu</h3>
            <p className="text-blue-300 text-sm font-medium">Founder & CEO, AI Fiesta</p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-10 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl"></div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
        <div className="w-full max-w-md">
          <ModernAuthForm />
        </div>
      </div>
    </div>
  )
}