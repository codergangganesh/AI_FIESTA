'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useAuth } from '@/contexts/AuthContext'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import TransparentBarChart from '@/components/visualization/TransparentBarChart'
import PieChart from '@/components/visualization/PieChart'
import StorageLineChart from '@/components/visualization/StorageLineChart'
import ResponseTimeChart from '@/components/visualization/ResponseTimeChart'
import HistoricalBarChart from '@/components/visualization/HistoricalBarChart'
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
import { createClient } from '@/lib/supabase/client'

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

// Add this interface for chart data
interface ChartDataPoint {
  period: string
  value: number
}

export default function UsagePage() {
  const { darkMode } = useDarkMode()
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState('30d')
  const [usageMetrics, setUsageMetrics] = useState<UsageMetric[]>([])
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [planType, setPlanType] = useState('free')
  // Add state for chart data
  const [apiCallsData, setApiCallsData] = useState<ChartDataPoint[]>([])
  const [storageData, setStorageData] = useState<ChartDataPoint[]>([])
  const [responseTime, setResponseTime] = useState<number>(0)

  useEffect(() => {
    const loadUsageData = async () => {
      if (!user) return

      try {
        const supabase = createClient()
        
        // Get user plan and usage data
        const { data: planData, error: planError } = await supabase
          .from('user_plans')
          .select('plan_type, usage')
          .eq('user_id', user.id)
          .single()

        if (planError) {
          console.error('Error fetching plan data:', planError)
          return
        }

        setPlanType(planData.plan_type)
        
        // Extract usage data
        const usage = planData.usage as Record<string, number>
        const apiCalls = usage.apiCalls || 0
        const comparisons = usage.comparisons || 0
        const storage = usage.storage || 0
        const responseTimeValue = usage.responseTime || 0

        // Set response time
        setResponseTime(responseTimeValue)

        // Generate mock data for charts (in a real app, this would come from the database)
        const mockApiCallsData: ChartDataPoint[] = [
          { period: 'Comparison 1', value: Math.max(0, apiCalls - 4) },
          { period: 'Comparison 2', value: Math.max(0, apiCalls - 3) },
          { period: 'Comparison 3', value: Math.max(0, apiCalls - 2) },
          { period: 'Comparison 4', value: Math.max(0, apiCalls - 1) },
          { period: 'Comparison 5', value: apiCalls }
        ]
        
        const mockStorageData: ChartDataPoint[] = [
          { period: 'Comparison 1', value: Math.max(0, parseFloat((storage - 0.1).toFixed(3))) },
          { period: 'Comparison 2', value: Math.max(0, parseFloat((storage - 0.075).toFixed(3))) },
          { period: 'Comparison 3', value: Math.max(0, parseFloat((storage - 0.05).toFixed(3))) },
          { period: 'Comparison 4', value: Math.max(0, parseFloat((storage - 0.025).toFixed(3))) },
          { period: 'Comparison 5', value: storage }
        ]
        
        setApiCallsData(mockApiCallsData)
        setStorageData(mockStorageData)

        // Define limits based on plan type
        let apiCallsLimit = 100
        let comparisonsLimit = 10
        let storageLimit = 1
        
        switch (planData.plan_type) {
          case 'pro':
            apiCallsLimit = 2500
            comparisonsLimit = 500
            storageLimit = 10
            break
          case 'pro_plus':
            apiCallsLimit = 10000
            comparisonsLimit = -1 // unlimited
            storageLimit = 100
            break
        }

        // Calculate percentages
        const apiCallsPercentage = apiCallsLimit > 0 
          ? Math.round((apiCalls / apiCallsLimit) * 100) 
          : 0
          
        const comparisonsPercentage = comparisonsLimit > 0 
          ? Math.round((comparisons / comparisonsLimit) * 100) 
          : 100 // For unlimited plans
          
        const storagePercentage = storageLimit > 0 
          ? Math.round((storage / storageLimit) * 100) 
          : 0

        setUsageMetrics([
          {
            title: 'API Calls',
            current: apiCalls,
            limit: apiCallsLimit,
            unit: 'calls',
            percentage: apiCallsPercentage,
            trend: 'up',
            change: '+12%',
            icon: Zap,
            color: 'blue'
          },
          {
            title: 'Model Comparisons',
            current: comparisons,
            limit: comparisonsLimit === -1 ? Infinity : comparisonsLimit,
            unit: comparisonsLimit === -1 ? 'unlimited' : 'comparisons',
            percentage: comparisonsPercentage,
            trend: 'up',
            change: '+8%',
            icon: GitCompare,
            color: 'purple'
          },
          {
            title: 'Storage Used',
            current: storage,
            limit: storageLimit,
            unit: 'GB',
            percentage: storagePercentage,
            trend: 'stable',
            change: '2.3%',
            icon: Database,
            color: 'green'
          },
          {
            title: 'Response Time',
            current: responseTimeValue,
            limit: 100,
            unit: 'seconds',
            percentage: responseTimeValue > 3 ? 90 : responseTimeValue > 1 ? 50 : 20,
            trend: responseTimeValue > 3 ? 'down' : responseTimeValue > 1 ? 'stable' : 'up',
            change: responseTimeValue > 3 ? '-15%' : responseTimeValue > 1 ? '+5%' : '+20%',
            icon: Clock,
            color: responseTimeValue > 3 ? 'red' : responseTimeValue > 1 ? 'yellow' : 'green'
          }
        ])

       
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading usage data:', error)
        setIsLoading(false)
      }
    }

    loadUsageData()
  }, [timeRange, user])

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

  // Prepare data for the pie chart (Model Comparisons)
  const modelComparisonsData = [
    { name: 'Used', value: usageMetrics[1]?.current || 0, color: '#8B5CF6' }, // purple
    { name: 'Remaining', value: usageMetrics[1]?.limit === Infinity ? 100 : Math.max(0, (usageMetrics[1]?.limit || 100) - (usageMetrics[1]?.current || 0)), color: darkMode ? '#374151' : '#E5E7EB' } // gray
  ]

  // Prepare historical data for API calls bar chart
  const apiCallsBarData = apiCallsData.map((item, index) => ({
    name: item.period,
    value: item.value,
    color: '#3B82F6' // blue color
  }))

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
                      {planType.charAt(0).toUpperCase() + planType.slice(1)} Plan
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-8">
          {/* Usage Summary - Moved to top */}
          <div>
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Usage Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {usageMetrics.map((metric, index) => {
                const Icon = metric.icon
                return (
                  <div
                    key={index}
                    className={`rounded-xl p-4 transition-all duration-200 ${
                      darkMode 
                        ? 'bg-gray-800/60 border border-gray-700/50' 
                        : 'bg-white/80 border border-slate-200/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${
                        darkMode ? 'bg-blue-600/20' : 'bg-blue-100'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          darkMode ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex items-center space-x-1 text-xs">
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
                    
                    <div>
                      <h3 className={`text-lg font-bold mb-1 transition-colors duration-200 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {metric.current.toLocaleString()}
                      </h3>
                      <p className={`text-xs transition-colors duration-200 ${
                        darkMode ? 'text-gray-400' : 'text-slate-600'
                      }`}>
                        {metric.title}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* API Usage Section */}
          <div>
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              API Usage
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* API Calls - Historical Bar Chart */}
              <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <h3 className={`text-xl font-bold mb-6 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  API Calls History
                </h3>
                <div className="h-80">
                  <HistoricalBarChart 
                    data={apiCallsBarData}
                    title=""
                    unit=" calls"
                    isLoading={false}
                  />
                </div>
              </div>
              
              {/* Model Comparisons - Donut Chart */}
              <PieChart 
                data={modelComparisonsData}
                title="Model Comparisons"
              />
            </div>
          </div>
          
          {/* Storage & Performance Section */}
          <div>
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Storage & Performance
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Storage Used - Enhanced Visualization */}
              <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-xl font-bold transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Storage Used
                  </h3>
                  <div className={`text-right ${
                    darkMode ? 'text-gray-300' : 'text-slate-600'
                  }`}>
                    <div className={`text-2xl font-bold ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {usageMetrics[2]?.current?.toFixed(2) || 0} GB
                    </div>
                    <div className="text-sm">
                      of {usageMetrics[2]?.limit || 1} GB
                    </div>
                  </div>
                </div>
                <div className="h-64">
                  <StorageLineChart 
                    data={storageData}
                    title=""
                  />
                </div>
                <div className="mt-4">
                  <div className={`w-full rounded-full h-2 ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="h-2 rounded-full bg-green-500"
                      style={{ 
                        width: `${usageMetrics[2]?.percentage || 0}%`,
                        maxWidth: '100%'
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className={darkMode ? 'text-gray-400' : 'text-slate-500'}>
                      0 GB
                    </span>
                    <span className={`font-medium ${
                      darkMode ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      {usageMetrics[2]?.percentage || 0}% used
                    </span>
                    <span className={darkMode ? 'text-gray-400' : 'text-slate-500'}>
                      {usageMetrics[2]?.limit || 1} GB
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Response Time - Custom Visualization */}
              <ResponseTimeChart 
                responseTime={responseTime}
                title="Response Time"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}