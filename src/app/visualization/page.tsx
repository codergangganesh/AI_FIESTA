'use client'

import { useState } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import PieChart from '@/components/visualization/PieChart'
import LineChart from '@/components/visualization/LineChart'
import {
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  TrendingUp,
  Download,
  Eye,
  Settings,
  Filter,
  RefreshCw,
  Target,
  Zap,
  Activity,
  Brain,
  ChevronDown
} from 'lucide-react'
import SimpleProfileIcon from '@/components/layout/SimpleProfileIcon'

interface ChartData {
  name: string
  value: number
  color: string
}

interface TrendDataPoint {
  period: string
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  responseTime: number
  cost: number
}

export default function VisualizationPage() {
  const { darkMode } = useDarkMode()
  const [selectedChart, setSelectedChart] = useState('accuracy-comparison')
  const [timeRange, setTimeRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(false)
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false)

  // Mock data for different charts
  const accuracyData: ChartData[] = [
    { name: 'GPT-4', value: 94.2, color: '#3B82F6' },
    { name: 'Claude-3', value: 92.8, color: '#8B5CF6' },
    { name: 'Gemini Pro', value: 91.5, color: '#10B981' },
    { name: 'GPT-3.5', value: 89.3, color: '#F59E0B' },
    { name: 'Claude-2', value: 87.6, color: '#EF4444' },
    { name: 'Llama-2', value: 85.4, color: '#6B7280' }
  ]

  const responseTimeData: ChartData[] = [
    { name: 'GPT-3.5', value: 1.2, color: '#F59E0B' },
    { name: 'Claude-2', value: 1.8, color: '#EF4444' },
    { name: 'Gemini Pro', value: 2.1, color: '#10B981' },
    { name: 'GPT-4', value: 2.4, color: '#3B82F6' },
    { name: 'Claude-3', value: 2.7, color: '#8B5CF6' },
    { name: 'Llama-2', value: 3.2, color: '#6B7280' }
  ]

  const costData: ChartData[] = [
    { name: 'GPT-3.5', value: 0.002, color: '#F59E0B' },
    { name: 'Claude-2', value: 0.008, color: '#EF4444' },
    { name: 'Llama-2', value: 0.012, color: '#6B7280' },
    { name: 'Gemini Pro', value: 0.015, color: '#10B981' },
    { name: 'Claude-3', value: 0.024, color: '#8B5CF6' },
    { name: 'GPT-4', value: 0.03, color: '#3B82F6' }
  ]

  const trendData: { period: string; [key: string]: number | string }[] = [
    { period: 'Week 1', accuracy: 89.2, precision: 87.5, recall: 91.0, f1Score: 89.2, responseTime: 2.8, cost: 0.012 },
    { period: 'Week 2', accuracy: 90.1, precision: 88.3, recall: 91.8, f1Score: 90.0, responseTime: 2.6, cost: 0.011 },
    { period: 'Week 3', accuracy: 91.5, precision: 89.7, recall: 93.2, f1Score: 91.4, responseTime: 2.3, cost: 0.010 },
    { period: 'Week 4', accuracy: 92.8, precision: 91.2, recall: 94.1, f1Score: 92.6, responseTime: 2.1, cost: 0.009 },
    { period: 'Week 5', accuracy: 93.4, precision: 91.8, recall: 94.8, f1Score: 93.3, responseTime: 1.8, cost: 0.007 },
    { period: 'Week 6', accuracy: 94.2, precision: 92.5, recall: 95.6, f1Score: 94.0, responseTime: 1.5, cost: 0.005 }
  ]

  const charts = [
    { id: 'accuracy-comparison', name: 'Model Accuracy', icon: Target, description: 'Compare accuracy across models' },
    { id: 'response-time', name: 'Response Time', icon: Zap, description: 'Average response times' },
    { id: 'cost-analysis', name: 'Cost Analysis', icon: Activity, description: 'Cost per 1K tokens' },
    { id: 'performance-trends', name: 'Performance Trends', icon: TrendingUp, description: 'Performance over time' }
  ]

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleExport = (format: string) => {
    console.log(`Exporting data as ${format}`)
    // In a real application, this would trigger the actual export functionality
    alert(`Exporting data as ${format}`)
    setIsExportDropdownOpen(false)
  }

  const renderBarChart = (data: ChartData[], title: string, unit: string = '%') => {
    const maxValue = Math.max(...data.map(d => d.value))
    
    return (
      <div className={`rounded-2xl p-6 transition-colors duration-200 ${
        darkMode 
          ? 'bg-gray-800/60 border border-gray-700/50' 
          : 'bg-white/80 border border-slate-200/50'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold transition-colors duration-200 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            {title}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className={`p-2 rounded-lg transition-all duration-200 ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-sm font-medium transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-700'
                }`}>
                  {item.name}
                </span>
                <span className={`text-sm font-bold transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {item.value}{unit}
                </span>
              </div>
              <div className={`w-full rounded-full h-3 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div 
                  className="h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color
                  }}
                ></div>
              </div>
            </div>
          ))}
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
        {/* Add simple profile icon at the top */}
        <div className={`sticky top-0 z-50 backdrop-blur-sm border-b transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-800/60 border-gray-700/30' 
            : 'bg-white/60 border-slate-200/30'
        }`}>
          <div className="px-6 py-4 flex justify-end">
            <SimpleProfileIcon darkMode={darkMode} />
          </div>
        </div>
        
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
                  Visualization Dashboard
                </h1>
                <p className={`mt-1 transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Interactive charts and analytics for model performance
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white' 
                    : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
                }`}>
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
                
                {/* Export Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white' 
                        : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {isExportDropdownOpen && (
                    <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10 ${
                      darkMode 
                        ? 'bg-gray-800 border border-gray-700' 
                        : 'bg-white border border-slate-200'
                    }`}>
                      <div className="py-1">
                        {[
                          { label: 'Download as PNG', format: 'PNG' },
                          { label: 'Export to PDF', format: 'PDF' },
                          { label: 'Save as Excel', format: 'XLSX' },
                          { label: 'Export Raw Data', format: 'CSV' }
                        ].map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleExport(option.format)}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                              darkMode 
                                ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                                : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option.label}</span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-slate-200 text-slate-600'
                              }`}>
                                {option.format}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chart Selection Tabs */}
            <div className="mt-6">
              <div className="flex space-x-1 overflow-x-auto">
                {charts.map((chart) => {
                  const Icon = chart.icon
                  return (
                    <button
                      key={chart.id}
                      onClick={() => setSelectedChart(chart.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                        selectedChart === chart.id
                          ? darkMode
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-600 text-white'
                          : darkMode
                            ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{chart.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Main Chart Area */}
            <div>
              {selectedChart === 'accuracy-comparison' && (
                <LineChart 
                  data={trendData}
                  title="Model Accuracy Over Time"
                  metrics={['accuracy']}
                  metricLabels={{ accuracy: 'Accuracy (%)' }}
                />
              )}
              {selectedChart === 'response-time' && (
                <LineChart 
                  data={trendData}
                  title="Response Time Over Time"
                  metrics={['responseTime']}
                  metricLabels={{ responseTime: 'Response Time (s)' }}
                />
              )}
              {selectedChart === 'cost-analysis' && (
                <PieChart 
                  data={costData} 
                  title="Cost Analysis Distribution" 
                />
              )}
              {selectedChart === 'performance-trends' && (
                <LineChart 
                  data={trendData}
                  title="Performance Trends"
                  metrics={['accuracy', 'responseTime']}
                  metricLabels={{
                    accuracy: 'Accuracy (%)',
                    responseTime: 'Response Time (s)'
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}