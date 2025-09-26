'use client'

import React from 'react'

const AuthIllustration = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Main container for the illustration */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Glowing background elements */}
        <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-2xl animate-pulse"></div>
        <div className="absolute inset-4 rounded-full bg-purple-500/30 blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Holographic panels */}
        <div className="absolute w-32 h-32 border border-violet-400/50 rounded-xl transform rotate-45 backdrop-blur-sm">
          <div className="absolute inset-0 border border-violet-300/30 rounded-xl"></div>
        </div>
        
        <div className="absolute w-24 h-24 border border-violet-400/50 rounded-lg transform -rotate-12 backdrop-blur-sm">
          <div className="absolute inset-0 border border-violet-300/30 rounded-lg"></div>
        </div>
        
        {/* Floating lock icon */}
        <div className="relative z-10 w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl transform rotate-12 animate-float-subtle"></div>
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
        </div>
        
        {/* Glowing lines */}
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent bottom-8 animate-pulse"></div>
        <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-violet-400/50 to-transparent left-8 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Particles */}
        <div className="absolute top-4 left-4 w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-6 right-6 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1.2s' }}></div>
        <div className="absolute top-10 right-4 w-1 h-1 bg-violet-300 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>
        <div className="absolute bottom-4 left-6 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>
    </div>
  )
}

export default AuthIllustration