'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { BarChart3, TrendingUp, Users, MessageSquare, Clock, Star } from 'lucide-react'

export default function AnalyticsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const stats = [
    { label: 'Total Conversations', value: '127', icon: MessageSquare, color: 'from-blue-500 to-blue-600' },
    { label: 'AI Models Used', value: '8', icon: BarChart3, color: 'from-purple-500 to-purple-600' },
    { label: 'Average Response Time', value: '2.3s', icon: Clock, color: 'from-green-500 to-green-600' },
    { label: 'Best Responses', value: '89%', icon: Star, color: 'from-yellow-500 to-yellow-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics Dashboard</h1>
          <p className="text-slate-600">Track your AI conversation insights and performance metrics</p>
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

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Usage Over Time</h3>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">Chart visualization coming soon</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Model Performance</h3>
            <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">Performance metrics coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}