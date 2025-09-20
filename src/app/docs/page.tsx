'use client'

import Link from 'next/link'
import { 
  Brain, 
  MessageSquare, 
  Zap, 
  BarChart3, 
  Shield, 
  Clock, 
  Users, 
  Star, 
  ChevronRight, 
  Play, 
  Globe, 
  TrendingUp, 
  Award, 
  Infinity, 
  Cpu, 
  Layers, 
  GitBranch, 
  Settings as SettingsIcon, 
  LogOut, 
  Moon, 
  Sun, 
  DollarSign, 
  MessageCircle,
  BookOpen,
  FileText,
  Database,
  PieChart,
  History,
  User,
  Key,
  CreditCard,
  HelpCircle
} from 'lucide-react'

export default function DocumentationPage() {
  const features = [
    {
      icon: MessageSquare,
      title: 'Universal Input',
      description: 'One message box sends to all selected AI models simultaneously. No need to repeat yourself.',
      details: [
        'Type your prompt once and send to multiple models',
        'Save time by avoiding repetitive input',
        'Compare responses side-by-side in real-time'
      ]
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get instant responses from multiple AI models in real-time with optimized parallel processing.',
      details: [
        'Parallel processing for simultaneous responses',
        'Average response time under 0.5 seconds',
        'Optimized for performance and speed'
      ]
    },
    {
      icon: BarChart3,
      title: 'Smart Comparison',
      description: 'Side-by-side cards make it easy to compare quality, style, and accuracy of responses.',
      details: [
        'Visual side-by-side comparison',
        'Mark best responses for future reference',
        'Easy evaluation of model outputs'
      ]
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with encrypted storage and user authentication.',
      details: [
        'End-to-end encrypted storage',
        'Secure user authentication',
        'Privacy-focused design'
      ]
    },
    {
      icon: Clock,
      title: 'Rich History',
      description: 'Access complete conversation history with searchable responses and best response tracking.',
      details: [
        'Complete conversation history',
        'Searchable responses',
        'Best response tracking'
      ]
    },
    {
      icon: Users,
      title: 'Premium Models',
      description: 'Access to cutting-edge AI models including GPT-5, Claude 4, and emerging models.',
      details: [
        '9+ premium AI models',
        'Access to cutting-edge technology',
        'Regular model updates'
      ]
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

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Play,
      content: 'Learn how to begin using AI Fiesta to compare AI models.'
    },
    {
      id: 'features',
      title: 'Core Features',
      icon: Star,
      content: 'Explore all the powerful features that make AI Fiesta unique.'
    },
    {
      id: 'models',
      title: 'AI Models',
      icon: Cpu,
      content: 'Detailed information about the AI models available on our platform.'
    },
    {
      id: 'comparison',
      title: 'Model Comparison',
      icon: BarChart3,
      content: 'How to effectively compare and evaluate AI model responses.'
    },
    {
      id: 'history',
      title: 'Conversation History',
      icon: History,
      content: 'Access and manage your conversation history.'
    },
    {
      id: 'account',
      title: 'Account Management',
      icon: User,
      content: 'Manage your account settings, preferences, and subscription.'
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: Shield,
      content: 'Learn about our security measures and privacy policies.'
    },
    {
      id: 'pricing',
      title: 'Pricing & Plans',
      icon: DollarSign,
      content: 'Understand our pricing structure and available plans.'
    },
    {
      id: 'support',
      title: 'Support & Help',
      icon: HelpCircle,
      content: 'Get help and support when you need it.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200/50 rounded-full px-4 py-2 mb-6">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">Documentation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6">
            AI Fiesta Documentation
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Everything you need to know about using AI Fiesta to compare AI models and find the perfect response for every task.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 p-8 shadow-lg mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-blue-500" />
            Table of Contents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <Link 
                  key={index} 
                  href={`#${section.id}`}
                  className="flex items-start space-x-3 p-4 rounded-xl hover:bg-blue-50/50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {section.content}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Getting Started */}
        <div id="getting-started" className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 p-8 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
            <Play className="w-7 h-7 mr-3 text-blue-500" />
            Getting Started
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-slate-700 mb-6">
              Welcome to AI Fiesta! This guide will help you get started with comparing AI models in minutes.
            </p>
            
            <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Start Guide</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold rounded-full mb-3">
                      {step.number}
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h4>
                    <p className="text-slate-600">{step.description}</p>
                  </div>
                )
              })}
            </div>
            
            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center">
                <Star className="w-5 h-5 mr-2 text-blue-500" />
                Pro Tip
              </h4>
              <p className="text-slate-700">
                Start with 3-4 models for your first comparison to get familiar with the interface. 
                You can always add more models later as you become more comfortable with the platform.
              </p>
            </div>
          </div>
        </div>

        {/* Core Features */}
        <div id="features" className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 p-8 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
            <Star className="w-7 h-7 mr-3 text-blue-500" />
            Core Features
          </h2>
          <div className="space-y-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex items-start space-x-4 p-6 rounded-xl hover:bg-blue-50/30 transition-colors">
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
              )
            })}
          </div>
        </div>

        {/* AI Models */}
        <div id="models" className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 p-8 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
            <Cpu className="w-7 h-7 mr-3 text-blue-500" />
            AI Models
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-slate-700 mb-6">
              AI Fiesta provides access to 9+ premium AI models from leading providers:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                'GPT-5',
                'Claude 4 Sonnet',
                'Gemini 2.5',
                'DeepSeek',
                'Qwen 2.5',
                'grok',
                'Llama',
                'Kimi',
                'ShisaAI'
              ].map((model, index) => (
                <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200/50">
                  <h4 className="font-bold text-slate-900 flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    {model}
                  </h4>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-purple-50 rounded-xl border border-purple-200">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
                Model Updates
              </h4>
              <p className="text-slate-700">
                We regularly update our model selection to include the latest and greatest AI models. 
                Check back often to see new models added to the platform.
              </p>
            </div>
          </div>
        </div>

        {/* Model Comparison */}
        <div id="comparison" className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 p-8 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
            <BarChart3 className="w-7 h-7 mr-3 text-blue-500" />
            Model Comparison
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-slate-700 mb-6">
              Our side-by-side comparison interface makes it easy to evaluate AI model responses:
            </p>
            
            <div className="space-y-6">
              <div className="p-6 bg-blue-50 rounded-xl border border-blue-200/50">
                <h4 className="font-bold text-slate-900 mb-2">Response Evaluation</h4>
                <p className="text-slate-700">
                  Compare responses based on quality, relevance, creativity, and accuracy. 
                  Mark your preferred response with the "Best Response" button for future reference.
                </p>
              </div>
              
              <div className="p-6 bg-green-50 rounded-xl border border-green-200/50">
                <h4 className="font-bold text-slate-900 mb-2">Performance Metrics</h4>
                <p className="text-slate-700">
                  Track response times and other performance metrics to understand which models 
                  work best for your specific use cases.
                </p>
              </div>
              
              <div className="p-6 bg-purple-50 rounded-xl border border-purple-200/50">
                <h4 className="font-bold text-slate-900 mb-2">Custom Comparisons</h4>
                <p className="text-slate-700">
                  Create custom comparison sets for different types of tasks (creative writing, 
                  technical analysis, coding, etc.) and save them for future use.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Conversation History */}
        <div id="history" className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 p-8 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
            <History className="w-7 h-7 mr-3 text-blue-500" />
            Conversation History
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-slate-700 mb-6">
              Access your complete conversation history with powerful search and organization features:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 rounded-xl border border-blue-200/50">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center">
                  <Database className="w-5 h-5 mr-2 text-blue-500" />
                  Complete History
                </h4>
                <p className="text-slate-700">
                  All your conversations are securely stored and accessible anytime. 
                  Never lose important AI interactions again.
                </p>
              </div>
              
              <div className="p-6 bg-green-50 rounded-xl border border-green-200/50">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-green-500" />
                  Best Responses
                </h4>
                <p className="text-slate-700">
                  Quickly find your best responses across all conversations. 
                  Perfect for referencing successful prompts and outputs.
                </p>
              </div>
              
              <div className="p-6 bg-purple-50 rounded-xl border border-purple-200/50">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-purple-500" />
                  Searchable Content
                </h4>
                <p className="text-slate-700">
                  Search through all your conversations to find specific topics, 
                  prompts, or responses in seconds.
                </p>
              </div>
              
              <div className="p-6 bg-amber-50 rounded-xl border border-amber-200/50">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-amber-500" />
                  Favorites
                </h4>
                <p className="text-slate-700">
                  Star your most important conversations for quick access. 
                  Organize your AI interactions efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Management */}
        <div id="account" className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 p-8 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
            <User className="w-7 h-7 mr-3 text-blue-500" />
            Account Management
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-slate-700 mb-6">
              Manage your account settings, preferences, and subscription:
            </p>
            
            <div className="space-y-6">
              <div className="p-6 bg-blue-50 rounded-xl border border-blue-200/50">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center">
                  <SettingsIcon className="w-5 h-5 mr-2 text-blue-500" />
                  Profile Settings
                </h4>
                <p className="text-slate-700">
                  Update your profile information, change your password, and manage your account preferences.
                </p>
              </div>
              
              <div className="p-6 bg-green-50 rounded-xl border border-green-200/50">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center">
                  <Key className="w-5 h-5 mr-2 text-green-500" />
                  Security
                </h4>
                <p className="text-slate-700">
                  Manage your security settings, enable two-factor authentication, and review your login activity.
                </p>
              </div>
              
              <div className="p-6 bg-purple-50 rounded-xl border border-purple-200/50">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-purple-500" />
                  Subscription
                </h4>
                <p className="text-slate-700">
                  View your subscription details, update your payment method, and manage your billing information.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Privacy */}
        <div id="security" className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 p-8 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
            <Shield className="w-7 h-7 mr-3 text-blue-500" />
            Security & Privacy
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-slate-700 mb-6">
              Your data security and privacy are our top priorities:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 rounded-xl border border-blue-200/50">
                <h4 className="font-bold text-slate-900 mb-2">End-to-End Encryption</h4>
                <p className="text-slate-700">
                  All your conversations are encrypted both in transit and at rest using industry-standard encryption protocols.
                </p>
              </div>
              
              <div className="p-6 bg-green-50 rounded-xl border border-green-200/50">
                <h4 className="font-bold text-slate-900 mb-2">Zero Data Retention</h4>
                <p className="text-slate-700">
                  We never sell or share your data with third parties. Your conversations remain private and secure.
                </p>
              </div>
              
              <div className="p-6 bg-purple-50 rounded-xl border border-purple-200/50">
                <h4 className="font-bold text-slate-900 mb-2">GDPR Compliant</h4>
                <p className="text-slate-700">
                  We comply with GDPR and other privacy regulations to ensure your data rights are protected.
                </p>
              </div>
              
              <div className="p-6 bg-amber-50 rounded-xl border border-amber-200/50">
                <h4 className="font-bold text-slate-900 mb-2">Regular Security Audits</h4>
                <p className="text-slate-700">
                  Our infrastructure undergoes regular security audits and penetration testing to maintain the highest security standards.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Plans */}
        <div id="pricing" className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 p-8 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
            <DollarSign className="w-7 h-7 mr-3 text-blue-500" />
            Pricing & Plans
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-slate-700 mb-6">
              Flexible pricing options to suit your needs:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200/50">
                <h4 className="font-bold text-slate-900 mb-2">Free Plan</h4>
                <p className="text-slate-700 mb-4">
                  Perfect for getting started with basic model comparisons.
                </p>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    3 model comparisons per day
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    Access to 5 AI models
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    Basic conversation history
                  </li>
                </ul>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200/50">
                <h4 className="font-bold text-slate-900 mb-2">Pro Plan</h4>
                <p className="text-slate-700 mb-4">
                  For power users who need more comparisons and features.
                </p>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                    Unlimited model comparisons
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                    Access to all 9+ AI models
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                    Advanced conversation history
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                    Priority support
                  </li>
                </ul>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200/50">
                <h4 className="font-bold text-slate-900 mb-2">Enterprise Plan</h4>
                <p className="text-slate-700 mb-4">
                  For teams and organizations with custom needs.
                </p>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></div>
                    Unlimited everything
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></div>
                    Custom model integrations
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></div>
                    Dedicated support
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></div>
                    Team management
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Support & Help */}
        <div id="support" className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 p-8 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
            <HelpCircle className="w-7 h-7 mr-3 text-blue-500" />
            Support & Help
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-slate-700 mb-6">
              Need help? We're here to support you:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 rounded-xl border border-blue-200/50">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
                  Contact Support
                </h4>
                <p className="text-slate-700 mb-4">
                  Reach out to our support team for assistance with any questions or issues.
                </p>
                <Link href="/contact" className="text-blue-600 font-medium hover:underline">
                  Contact Support →
                </Link>
              </div>
              
              <div className="p-6 bg-green-50 rounded-xl border border-green-200/50">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-green-500" />
                  Knowledge Base
                </h4>
                <p className="text-slate-700 mb-4">
                  Browse our comprehensive knowledge base for answers to common questions.
                </p>
                <Link href="/docs" className="text-green-600 font-medium hover:underline">
                  Visit Knowledge Base →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Comparing?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of researchers and developers who trust AI Fiesta for their AI model comparisons.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth"
              className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:shadow-lg transition-all duration-300"
            >
              Get Started Free
            </Link>
            <Link 
              href="/chat"
              className="px-6 py-3 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 transition-all duration-300 border border-white/30"
            >
              View Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}