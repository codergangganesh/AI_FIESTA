'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useAuth } from '@/contexts/AuthContext'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import {
  Activity,
  TrendingUp,
  Database,
  Zap,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  GitCompare,
  Clock,
  CheckCircle,
  AlertTriangle,
  Crown,
  Plus
} from 'lucide-react'

interface UsageMetric {
  title: string
  current: number
  limit: number
  unit: string
  percentage: number
  trend: 'up' | 'down' | 'stable'
  change: string
  icon: any
  color: string
}

interface ActivityItem {
  id: string
  type: string
  description: string
  timestamp: string
  cost: number
  status: 'success' | 'pending' | 'failed'
}

export default function UsagePage() {
  const { darkMode } = useDarkMode()
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState('30d')
  const [usageMetrics, setUsageMetrics] = useState<UsageMetric[]>([])
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUsageData = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUsageMetrics([
        {
          title: 'API Calls',
          current: 1247,
          limit: 2000,
          unit: 'calls',
          percentage: 62,
          trend: 'up',
          change: '+12%',
          icon: Zap,
          color: 'blue'
        },
        {
          title: 'Model Comparisons',
          current: 156,
          limit: 500,
          unit: 'comparisons',
          percentage: 31,
          trend: 'up',
          change: '+8%',
          icon: GitCompare,
          color: 'purple'
        },
        {
          title: 'Storage Used',
          current: 2.3,
          limit: 5,
          unit: 'GB',
          percentage: 46,
          trend: 'stable',
          change: '0%',
          icon: Database,
          color: 'green'
        },
        {
          title: 'Processing Time',
          current: 24.7,
          limit: 100,
          unit: 'hours',
          percentage: 25,
          trend: 'down',
          change: '-5%',
          icon: Clock,
          color: 'orange'
        }
      ])

      setRecentActivity([
        {
          id: '1',
          type: 'Model Comparison',
          description: 'GPT-4 vs Claude-3 comparison on sentiment analysis',
          timestamp: '2 minutes ago',
          cost: 0.15,
          status: 'success'
        },
        {
          id: '2',
          type: 'Dataset Processing',
          description: 'Processed customer reviews dataset (5,000 records)',
          timestamp: '15 minutes ago',
          cost: 0.08,
          status: 'success'
        },
        {
          id: '4',
          type: 'API Call',
          description: 'Batch inference on 1,000 text samples',
          timestamp: '2 hours ago',
          cost: 0.12,
          status: 'success'
        },
        {
          id: '5',
          type: 'Model Export',
          description: 'Downloaded comparison report (PDF)',
          timestamp: '3 hours ago',
          cost: 0.02,
          status: 'success'
        }
      ])

      setIsLoading(false)
    }

    loadUsageData()
  }, [timeRange])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-500" />
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="w-4 h-4 text-green-500" />
      case 'down':
        return <ArrowDownRight className="w-4 h-4 text-red-500" />
      default:
        return <ArrowUpRight className="w-4 h-4 text-gray-500" />
    }
  }

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-500'
    if (percentage < 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
      }`}>
        <AdvancedSidebar />
        <div className="ml-16 lg:ml-72 transition-all duration-300">
          <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className={`text-lg font-medium ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Loading Usage Data...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <AdvancedSidebar />
      
      <div className="ml-16 lg:ml-72 transition-all duration-300">
        {/* Header */}
        <div className={`backdrop-blur-sm border-b transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-800/60 border-gray-700/30' 
            : 'bg-white/60 border-slate-200/30'
        }`}>
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-3xl font-bold transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Usage & Analytics
                </h1>
                <p className={`mt-1 transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Monitor your API usage, quotas, and platform analytics
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Time Range Selector */}
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className={`px-4 py-2 rounded-xl border transition-all duration-200 ${
                    darkMode
                      ? 'bg-gray-800 border-gray-600 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>

                {/* Current Plan Badge */}
                <div className={`px-4 py-2 rounded-xl transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/30' 
                    : 'bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    <Crown className={`w-4 h-4 ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      darkMode ? 'text-blue-300' : 'text-blue-700'
                    }`}>
                      Pro Plan
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Usage Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {usageMetrics.map((metric, index) => {
              const Icon = metric.icon
              return (
                <div
                  key={index}
                  className={`rounded-2xl p-6 transition-all duration-200 hover:scale-105 ${
                    darkMode 
                      ? 'bg-gray-800/60 border border-gray-700/50' 
                      : 'bg-white/80 border border-slate-200/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${
                      darkMode ? 'bg-blue-600/20' : 'bg-blue-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        darkMode ? 'text-blue-400' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      {getTrendIcon(metric.trend)}
                      <span className={
                        metric.trend === 'up' ? 'text-green-500' : 
                        metric.trend === 'down' ? 'text-red-500' : 
                        'text-gray-500'
                      }>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className={`text-2xl font-bold mb-1 transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {metric.current.toLocaleString()}
                    </h3>
                    <p className={`text-sm transition-colors duration-200 ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      {metric.title}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className={darkMode ? 'text-gray-400' : 'text-slate-600'}>
                        {metric.current} / {metric.limit} {metric.unit}
                      </span>
                      <span className={darkMode ? 'text-gray-400' : 'text-slate-600'}>
                        {metric.percentage}%
                      </span>
                    </div>
                    <div className={`w-full rounded-full h-2 ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(metric.percentage)}`}
                        style={{width: `${metric.percentage}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className={`rounded-2xl overflow-hidden transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <div className="p-6 border-b border-current border-opacity-10">
                  <div className="flex items-center justify-between">
                    <h2 className={`text-xl font-bold transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Recent Activity
                    </h2>
                    <button className={`text-sm font-medium transition-colors duration-200 ${
                      darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}>
                      View All
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className={`flex items-start space-x-4 p-4 rounded-xl transition-colors duration-200 ${
                          darkMode ? 'bg-gray-700/30' : 'bg-slate-50'
                        }`}
                      >
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(activity.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`text-sm font-medium transition-colors duration-200 ${
                                darkMode ? 'text-white' : 'text-slate-900'
                              }`}>
                                {activity.type}
                              </p>
                              <p className={`text-sm mt-1 transition-colors duration-200 ${
                                darkMode ? 'text-gray-400' : 'text-slate-600'
                              }`}>
                                {activity.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className={`text-sm font-medium transition-colors duration-200 ${
                                darkMode ? 'text-white' : 'text-slate-900'
                              }`}>
                                ₹{activity.cost.toFixed(2)}
                              </p>
                              <p className={`text-xs transition-colors duration-200 ${
                                darkMode ? 'text-gray-400' : 'text-slate-500'
                              }`}>
                                {activity.timestamp}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Summary & Upgrade */}
            <div className="space-y-6">
              {/* Monthly Summary */}
              <div className={`rounded-2xl overflow-hidden transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <div className="p-6 border-b border-current border-opacity-10">
                  <h2 className={`text-xl font-bold transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    This Month
                  </h2>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                      Total Spend
                    </span>
                    <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      ₹247.50
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                      Comparisons Run
                    </span>
                    <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      156
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                      Models Used
                    </span>
                    <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      6 / 6
                    </span>
                  </div>

                  <div className="pt-4 border-t border-current border-opacity-10">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                        Plan Budget
                      </span>
                      <span className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        ₹2,752.50 remaining
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upgrade Prompt */}
              <div className={`rounded-2xl overflow-hidden transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-700/50' 
                  : 'bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200'
              }`}>
                <div className="p-6">
                  <div className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                      darkMode ? 'bg-purple-600' : 'bg-purple-100'
                    }`}>
                      <Crown className={`w-6 h-6 ${
                        darkMode ? 'text-white' : 'text-purple-600'
                      }`} />
                    </div>
                    
                    <h3 className={`text-lg font-bold mb-2 transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Upgrade to Pro Plus
                    </h3>
                    
                    <p className={`text-sm mb-4 transition-colors duration-200 ${
                      darkMode ? 'text-gray-300' : 'text-slate-600'
                    }`}>
                      Get access to all AI models, unlimited comparisons, and advanced features
                    </p>
                    
                    <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg">
                      <Plus className="w-4 h-4 mr-2 inline" />
                      Upgrade Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className={`rounded-2xl overflow-hidden transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <div className="p-6 border-b border-current border-opacity-10">
                  <h2 className={`text-xl font-bold transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Quick Stats
                  </h2>
                </div>
                
                <div className="p-6 space-y-4">
                  {[
                    { label: 'Avg. Response Time', value: '1.2s', icon: Clock },
                    { label: 'Success Rate', value: '99.7%', icon: CheckCircle },
                    { label: 'Models Available', value: '12+', icon: BarChart3 }
                  ].map((stat, index) => {
                    const Icon = stat.icon
                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          darkMode ? 'bg-blue-600/20' : 'bg-blue-100'
                        }`}>
                          <Icon className={`w-4 h-4 ${
                            darkMode ? 'text-blue-400' : 'text-blue-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                            {stat.label}
                          </p>
                          <p className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            {stat.value}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}