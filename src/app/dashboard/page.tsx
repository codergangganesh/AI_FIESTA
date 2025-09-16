'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useAuth } from '@/contexts/AuthContext'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import BarChart from '@/components/dashboard/BarChart'
import LineChart from '@/components/dashboard/LineChart'
import {
  TrendingUp,
  Users,
  Activity,
  Zap,
  GitCompare,
  Database,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Brain,
  Sparkles,
  Target,
  Timer
} from 'lucide-react'

interface MetricCard {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: any
  color: string
}

interface RecentActivity {
  id: string
  type: string
  description: string
  timestamp: string
  status: 'success' | 'pending' | 'error'
}

interface ModelComparisonData {
  modelName: string
  responseTime: number
  messagesTyped: number
  modelDataTime: number
}

interface PerformanceTrendData {
  period: string
  responseTime: number
  messagesTyped: number
  modelDataTime: number
  [key: string]: string | number
}

export default function DashboardPage() {
  const { darkMode } = useDarkMode()
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<MetricCard[]>([])
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [comparisonData, setComparisonData] = useState<ModelComparisonData[]>([])
  const [trendData, setTrendData] = useState<PerformanceTrendData[]>([])
  const [hasComparisons, setHasComparisons] = useState(false)

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMetrics([
        {
          title: 'Total Comparisons',
          value: '2,847',
          change: '+12.5%',
          trend: 'up',
          icon: GitCompare,
          color: 'blue'
        },
        {
          title: 'Models Analyzed',
          value: '156',
          change: '+8.2%',
          trend: 'up',
          icon: Brain,
          color: 'purple'
        },
        {
          title: 'Accuracy Score',
          value: '94.6%',
          change: '+2.1%',
          trend: 'up',
          icon: TrendingUp,
          color: 'green'
        },
        {
          title: 'API Usage',
          value: '78.3%',
          change: '-5.4%',
          trend: 'down',
          icon: Activity,
          color: 'orange'
        }
      ])

      setRecentActivities([
        {
          id: '1',
          type: 'Model Comparison',
          description: 'Compared GPT-4 vs Claude-3 on classification task',
          timestamp: '2 minutes ago',
          status: 'success'
        },
        {
          id: '2',
          type: 'Dataset Analysis',
          description: 'Processed customer sentiment dataset (10,000 records)',
          timestamp: '15 minutes ago',
          status: 'success'
        },
        {
          id: '4',
          type: 'Model Export',
          description: 'Downloaded comparison report for project X',
          timestamp: '2 hours ago',
          status: 'success'
        }
      ])

      // Check if user has made any comparisons
      // In a real app, this would come from the database
      const userHasComparisons = Math.random() > 0.5 // Random for demo purposes
      setHasComparisons(userHasComparisons)

      if (userHasComparisons) {
        // Sample comparison data
        setComparisonData([
          { modelName: 'GPT-4', responseTime: 1.2, messagesTyped: 24, modelDataTime: 0.8 },
          { modelName: 'Claude-3', responseTime: 1.5, messagesTyped: 22, modelDataTime: 1.1 },
          { modelName: 'Gemini Pro', responseTime: 1.8, messagesTyped: 20, modelDataTime: 1.3 },
          { modelName: 'LLaMA 3', responseTime: 2.1, messagesTyped: 18, modelDataTime: 1.7 },
          { modelName: 'Qwen 2.5', responseTime: 2.3, messagesTyped: 16, modelDataTime: 1.9 }
        ])

        // Sample trend data
        setTrendData([
          { period: 'Week 1', responseTime: 2.1, messagesTyped: 15, modelDataTime: 1.8 },
          { period: 'Week 2', responseTime: 1.9, messagesTyped: 17, modelDataTime: 1.6 },
          { period: 'Week 3', responseTime: 1.7, messagesTyped: 19, modelDataTime: 1.4 },
          { period: 'Week 4', responseTime: 1.5, messagesTyped: 21, modelDataTime: 1.2 },
          { period: 'Week 5', responseTime: 1.3, messagesTyped: 23, modelDataTime: 1.0 },
          { period: 'Week 6', responseTime: 1.2, messagesTyped: 24, modelDataTime: 0.8 }
        ])
      }

      setIsLoading(false)
    }

    loadDashboardData()
  }, [])

  // Transform comparison data for bar charts
  const responseTimeData = comparisonData.map(item => ({
    name: item.modelName,
    value: item.responseTime,
    color: '#3B82F6' // Blue
  }))

  const messagesTypedData = comparisonData.map(item => ({
    name: item.modelName,
    value: item.messagesTyped,
    color: '#10B981' // Green
  }))

  const modelDataTimeData = comparisonData.map(item => ({
    name: item.modelName,
    value: item.modelDataTime,
    color: '#8B5CF6' // Purple
  }))

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />
    }
  }

  const getMetricColorClasses = (color: string) => {
    const colors = {
      blue: darkMode 
        ? 'from-blue-600 to-blue-700 text-white' 
        : 'from-blue-500 to-blue-600 text-white',
      purple: darkMode 
        ? 'from-purple-600 to-purple-700 text-white' 
        : 'from-purple-500 to-purple-600 text-white',
      green: darkMode 
        ? 'from-green-600 to-green-700 text-white' 
        : 'from-green-500 to-green-600 text-white',
      orange: darkMode 
        ? 'from-orange-600 to-orange-700 text-white' 
        : 'from-orange-500 to-orange-600 text-white'
    }
    return colors[color as keyof typeof colors] || colors.blue
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
                Loading Dashboard...
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
                  Dashboard
                </h1>
                <p className={`mt-1 transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}! Here's your AI platform overview.
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className={`px-4 py-2 rounded-xl transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/30' 
                    : 'bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    <Sparkles className={`w-4 h-4 ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      darkMode ? 'text-blue-300' : 'text-blue-700'
                    }`}>
                      Pro Plan Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => {
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
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${getMetricColorClasses(metric.color)}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className={`flex items-center space-x-1 text-sm ${
                      metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      <ArrowUpRight className={`w-4 h-4 ${
                        metric.trend === 'down' ? 'rotate-180' : ''
                      }`} />
                      <span>{metric.change}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className={`text-2xl font-bold mb-1 transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {metric.value}
                    </h3>
                    <p className={`text-sm transition-colors duration-200 ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      {metric.title}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart 
              data={responseTimeData} 
              title="Response Time Comparison" 
              unit="s"
            />
            <BarChart 
              data={messagesTypedData} 
              title="Messages Typed per Model" 
              unit=""
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart 
              data={modelDataTimeData} 
              title="Model Data Processing Time" 
              unit="s"
            />
            <LineChart 
              data={trendData} 
              title="Performance Trends Over Time" 
              metrics={['responseTime', 'messagesTyped', 'modelDataTime']}
              metricLabels={{
                responseTime: 'Response Time',
                messagesTyped: 'Messages Typed',
                modelDataTime: 'Data Processing Time'
              }}
            />
          </div>

          {/* Quick Actions */}
          <div className={`rounded-2xl overflow-hidden transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-800/60 border border-gray-700/50' 
              : 'bg-white/80 border border-slate-200/50'
          }`}>
            <div className="p-6 border-b border-current border-opacity-10">
              <h2 className={`text-xl font-bold transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Quick Actions
              </h2>
            </div>
            
            <div className="p-6 space-y-3">
              {[
                { label: 'New Comparison', href: '/model-comparison', icon: GitCompare },
                { label: 'Analyze Dataset', href: '/dataset-analysis', icon: Database },
                { label: 'View Charts', href: '/visualization', icon: BarChart3 }
              ].map((action, index) => {
                const Icon = action.icon
                return (
                  <a
                    key={index}
                    href={action.href}
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group ${
                      darkMode 
                        ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                        : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{action.label}</span>
                    <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}