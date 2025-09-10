'use client'

import Link from 'next/link'
import { Brain, Zap, DollarSign, Clock, Star, Code, Image, FileText } from 'lucide-react'

export default function ModelFeaturesDocumentation() {
  const features = [
    {
      icon: Brain,
      title: 'Enhanced Model Information',
      description: 'Each AI model now includes detailed information about capabilities, performance, and pricing to help you make informed decisions.',
      details: [
        'Comprehensive model descriptions',
        'Capability tags (text, image, code, etc.)',
        'Performance metrics (speed and cost)',
        'Context window sizes'
      ]
    },
    {
      icon: Zap,
      title: 'Speed Ratings',
      description: 'Models are now categorized by their response speed to help you choose the right model for your needs.',
      details: [
        'Very Fast - Responses in under 0.5 seconds',
        'Fast - Responses in 0.5-1 second',
        'Medium - Responses in 1-2 seconds',
        'Slow - Responses in over 2 seconds'
      ]
    },
    {
      icon: DollarSign,
      title: 'Cost Transparency',
      description: 'Clear cost indicators help you balance performance with budget considerations.',
      details: [
        'Very Low - Most cost-effective models',
        'Low - Affordable with good performance',
        'Medium - Balanced cost and performance',
        'High - Premium models with advanced capabilities'
      ]
    },
    {
      icon: Clock,
      title: 'Context Awareness',
      description: 'Each model displays its context window size to help you understand how much information it can process.',
      details: [
        'Token-based context windows',
        'Clear display of model limitations',
        'Helps with prompt engineering decisions'
      ]
    }
  ]

  const capabilities = [
    {
      icon: FileText,
      name: 'Text Processing',
      description: 'Standard text generation and understanding capabilities'
    },
    {
      icon: Image,
      name: 'Image Analysis',
      description: 'Visual content understanding and generation'
    },
    {
      icon: Code,
      name: 'Code Generation',
      description: 'Programming assistance and code review'
    },
    {
      icon: Star,
      name: 'Mathematical Reasoning',
      description: 'Advanced numerical and logical problem solving'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200/50 rounded-full px-4 py-2 mb-6">
            <Brain className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">AI Model Features</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6">
            Enhanced Model Information
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Learn about the new features and improvements to our AI model selection system
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 p-8 shadow-lg mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
          <p className="text-slate-700 mb-4">
            We've enhanced our AI model selection system with detailed information about each model's capabilities, 
            performance characteristics, and cost structure. This helps you make more informed decisions when 
            choosing which models to use for your specific tasks.
          </p>
          <p className="text-slate-700">
            With these improvements, you can now quickly identify models that are best suited for your needs 
            based on factors like speed, cost, and specialized capabilities.
          </p>
        </div>

        {/* Key Features */}
        <div className="space-y-8 mb-12">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">Key Features</h2>
          
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div 
                key={index} 
                className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-700 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-slate-600">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Capabilities */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">Model Capabilities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon
              return (
                <div 
                  key={index} 
                  className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{capability.name}</h3>
                  </div>
                  <p className="text-slate-600">{capability.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Explore?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Check out our enhanced model selection interface and see how these new features 
            can help you find the perfect AI models for your tasks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/model-showcase"
              className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:shadow-lg transition-all duration-300"
            >
              View All Models
            </Link>
            <Link 
              href="/chat"
              className="px-6 py-3 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 transition-all duration-300 border border-white/30"
            >
              Try Model Comparison
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}