'use client'

import { useState, useEffect, useRef } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useAuth } from '@/contexts/AuthContext'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import BarChart from '@/components/dashboard/BarChart'
import LineChart from '@/components/dashboard/LineChart'
import DonutChart from '@/components/dashboard/DonutChart'
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
  Timer,
  Download,
  Settings as SettingsIcon,
  X
} from 'lucide-react'
import SimpleProfileIcon from '@/components/layout/SimpleProfileIcon'

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
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [exportPosition, setExportPosition] = useState<'bottom' | 'top'>('bottom')
  
  const exportRef = useRef<HTMLDivElement>(null)

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

  // Close export dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setIsExportOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Position dropdown based on available space
  useEffect(() => {
    if (isExportOpen && exportRef.current) {
      const buttonRect = exportRef.current.getBoundingClientRect()
      const dropdownHeight = 200 // Approximate height
      const spaceBelow = window.innerHeight - buttonRect.bottom
      const spaceAbove = buttonRect.top
      
      // Position dropdown above if not enough space below
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setExportPosition('top')
      } else {
        setExportPosition('bottom')
      }
    }
  }, [isExportOpen])

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

  // Function to convert data to CSV format
  const convertToCSV = (data: any[]) => {
    if (!data || data.length === 0) return ''
    
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(obj => 
      Object.values(obj).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    ).join('\n')
    
    return `${headers}\n${rows}`
  }

  // Function to download data as CSV
  const downloadCSV = (data: any[], filename: string) => {
    const csv = convertToCSV(data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Function to download data as JSON
  const downloadJSON = (data: any, filename: string) => {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Export dashboard data to Excel (CSV format)
  const handleExportToExcel = () => {
    // Prepare data for export
    const exportData = {
      timestamp: new Date().toISOString(),
      user: user?.email,
      metrics: metrics,
      comparisonData: comparisonData,
      trendData: trendData,
      recentActivities: recentActivities
    }
    
    // Download as JSON for now (in a real app, you might use a library like xlsx)
    downloadJSON(exportData, `dashboard-export-${new Date().toISOString().slice(0, 10)}.json`)
    setIsExportOpen(false)
  }

  // Export dashboard data to CSV
  const handleExportToCSV = () => {
    // Prepare data for export in a structured format
    let csvContent = "Dashboard Export Report\n"
    csvContent += `Generated on: ${new Date().toISOString()}\n`
    csvContent += `User: ${user?.email || 'N/A'}\n\n`
    
    // Metrics section
    csvContent += "Metrics\n"
    csvContent += "Title,Value,Change,Trend\n"
    metrics.forEach(metric => {
      csvContent += `"${metric.title}","${metric.value}","${metric.change}","${metric.trend}"\n`
    })
    
    csvContent += "\n"
    
    // Comparison Data section
    csvContent += "Model Comparison Data\n"
    csvContent += "Model Name,Response Time (s),Messages Typed,Data Processing Time (s)\n"
    comparisonData.forEach(data => {
      csvContent += `"${data.modelName}",${data.responseTime},${data.messagesTyped},${data.modelDataTime}\n`
    })
    
    csvContent += "\n"
    
    // Trend Data section
    csvContent += "Performance Trends\n"
    csvContent += "Period,Response Time (s),Messages Typed,Data Processing Time (s)\n"
    trendData.forEach(data => {
      csvContent += `"${data.period}",${data.responseTime},${data.messagesTyped},${data.modelDataTime}\n`
    })
    
    csvContent += "\n"
    
    // Recent Activities section
    csvContent += "Recent Activities\n"
    csvContent += "Type,Description,Timestamp,Status\n"
    recentActivities.forEach(activity => {
      csvContent += `"${activity.type}","${activity.description}","${activity.timestamp}","${activity.status}"\n`
    })
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `dashboard-export-${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setIsExportOpen(false)
  }

  // Export dashboard data to PDF (placeholder)
  const handleExportToPDF = () => {
    // In a real implementation, you would use a library like jsPDF or html2pdf
    alert('PDF export functionality would generate a professional report of your dashboard data.')
    setIsExportOpen(false)
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
              
              <div className="flex items-center space-x-3">
                {/* Simple Profile Icon */}
                <SimpleProfileIcon darkMode={darkMode} />
                
                {/* Export Dropdown */}
                <div className="relative" ref={exportRef}>
                  <button 
                    onClick={() => setIsExportOpen(!isExportOpen)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      darkMode 
                        ? 'bg-gray-700/80 hover:bg-gray-600 text-gray-200 hover:text-white border border-gray-600' 
                        : 'bg-white/90 hover:bg-white border border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span className="font-medium">Export</span>
                  </button>
                  
                  {/* Dropdown menu for export options */}
                  {isExportOpen && (
                    <div 
                      className={`absolute right-0 w-56 rounded-xl shadow-xl z-20 overflow-hidden transform transition-all duration-200 ease-in-out ${
                        darkMode 
                          ? 'bg-gray-800/95 border border-gray-700 backdrop-blur-xl' 
                          : 'bg-white/95 border border-slate-200 backdrop-blur-xl'
                      }`}
                      style={exportPosition === 'top' ? { bottom: '100%', marginBottom: '0.5rem' } : { top: '100%', marginTop: '0.5rem' }}
                    >
                      <div className="py-1">
                        <div className={`px-4 py-3 border-b ${
                          darkMode ? 'border-gray-700' : 'border-slate-200'
                        }`}>
                          <h3 className={`text-sm font-semibold ${
                            darkMode ? 'text-gray-200' : 'text-slate-800'
                          }`}>
                            Export Dashboard Data
                          </h3>
                        </div>
                        <button
                          onClick={handleExportToExcel}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors duration-200 flex items-center justify-between ${
                            darkMode 
                              ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                              : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                              darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                            }`}>
                              <span className={`text-xs font-bold ${
                                darkMode ? 'text-blue-400' : 'text-blue-600'
                              }`}>XLSX</span>
                            </div>
                            <span>Export to Excel</span>
                          </div>
                        </button>
                        <button
                          onClick={handleExportToCSV}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors duration-200 flex items-center justify-between ${
                            darkMode 
                              ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                              : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                              darkMode ? 'bg-green-900/30' : 'bg-green-100'
                            }`}>
                              <span className={`text-xs font-bold ${
                                darkMode ? 'text-green-400' : 'text-green-600'
                              }`}>CSV</span>
                            </div>
                            <span>Export to CSV</span>
                          </div>
                        </button>
                        <button
                          onClick={handleExportToPDF}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors duration-200 flex items-center justify-between ${
                            darkMode 
                              ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                              : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                              darkMode ? 'bg-red-900/30' : 'bg-red-100'
                            }`}>
                              <span className={`text-xs font-bold ${
                                darkMode ? 'text-red-400' : 'text-red-600'
                              }`}>PDF</span>
                            </div>
                            <span>Export to PDF</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
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
              title="Response Time Trends Over Time" 
              metrics={['responseTime']}
              metricLabels={{
                responseTime: 'Response Time (s)'
              }}
            />
          </div>

          {/* Response Time Donut Chart */}
          <div className="grid grid-cols-1 gap-6">
            <DonutChart 
              data={responseTimeData} 
              title="Response Time Distribution" 
              unit="s"
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
                { label: 'Hyperparameter Tuning', href: '/hyperparameter-tuning', icon: SettingsIcon }
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