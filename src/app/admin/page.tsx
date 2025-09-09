'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { 
  Users, 
  BarChart3, 
  MessageSquare, 
  Star, 
  TrendingUp, 
  Eye, 
  Clock,
  BarChart
} from 'lucide-react'

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeUsers, setActiveUsers] = useState(42)
  const [pageVisits, setPageVisits] = useState(1247)
  const [avgRating, setAvgRating] = useState(4.8)
  const [mostVisitedPages, setMostVisitedPages] = useState([
    { page: '/chat', visits: 342 },
    { page: '/history', visits: 210 },
    { page: '/analytics', visits: 187 },
    { page: '/pricing', visits: 156 },
    { page: '/contact', visits: 98 }
  ])

  // Check if user is admin (in a real app, this would come from the backend)
  useEffect(() => {
    if (user) {
      // For demo purposes, we'll assume the admin has a specific email
      // In a real app, this would be checked against user roles/permissions
      setIsAdmin(user.email === 'admin@aifiesta.com' || user.email?.includes('admin'))
    }
  }, [user])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => Math.max(10, prev + Math.floor(Math.random() * 5) - 2))
      setPageVisits(prev => prev + Math.floor(Math.random() * 3))
      setAvgRating(prev => {
        const change = (Math.random() * 0.2) - 0.1
        return Math.min(5, Math.max(1, prev + change))
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  // Redirect non-admin users
  useEffect(() => {
    if (user && !isAdmin) {
      router.push('/dashboard')
    }
  }, [user, isAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  // Model performance data
  const modelPerformance = [
    { model: 'Linear Regression', accuracy: 87, engagement: 78 },
    { model: 'Random Forest', accuracy: 92, engagement: 85 },
    { model: 'Neural Network', accuracy: 95, engagement: 91 },
    { model: 'XGBoost', accuracy: 90, engagement: 82 },
    { model: 'SVM', accuracy: 85, engagement: 75 }
  ]

  const stats = [
    { label: 'Current Active Users', value: activeUsers, icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Page Visit Count', value: pageVisits, icon: Eye, color: 'from-purple-500 to-purple-600' },
    { label: 'Average Feedback Rating', value: avgRating.toFixed(1), icon: Star, color: 'from-yellow-500 to-yellow-600' },
    { label: 'Total Conversations', value: '1,247', icon: MessageSquare, color: 'from-green-500 to-green-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Real-time analytics and model performance insights</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            )
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Model Performance Chart */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Model Performance Comparison</h3>
              <BarChart className="w-5 h-5 text-slate-500" />
            </div>
            <div className="space-y-4">
              {modelPerformance.map((model, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-900">{model.model}</span>
                    <span className="text-slate-600">
                      Accuracy: {model.accuracy}%, Engagement: {model.engagement}%
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                          style={{ width: `${model.accuracy}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Accuracy</div>
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                          style={{ width: `${model.engagement}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Engagement</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Page Visits Chart */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Most Visited Pages</h3>
              <BarChart3 className="w-5 h-5 text-slate-500" />
            </div>
            <div className="space-y-4">
              {mostVisitedPages.map((page, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-900">{page.page}</span>
                    <span className="text-slate-600">{page.visits} visits</span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      style={{ width: `${(page.visits / 400) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Updates */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Real-time Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="text-sm text-blue-700 font-medium">Active Users</div>
              <div className="text-2xl font-bold text-blue-900">{activeUsers}</div>
              <div className="text-xs text-blue-600 mt-1">Updated just now</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="text-sm text-purple-700 font-medium">Page Visits</div>
              <div className="text-2xl font-bold text-purple-900">{pageVisits}</div>
              <div className="text-xs text-purple-600 mt-1">Updated just now</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-xl">
              <div className="text-sm text-yellow-700 font-medium">Avg. Rating</div>
              <div className="text-2xl font-bold text-yellow-900">{avgRating.toFixed(1)}</div>
              <div className="text-xs text-yellow-600 mt-1">Updated just now</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}