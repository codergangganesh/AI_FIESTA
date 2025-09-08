'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import {
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  Download,
  Eye,
  Settings,
  Filter,
  RefreshCw,
  Target,
  Zap,
  Activity,
  Brain
} from 'lucide-react'

interface ChartData {
  name: string
  value: number
  color?: string
}

interface MetricTrend {
  period: string
  accuracy: number
  precision: number
  recall: number
  f1Score: number
}

export default function VisualizationPage() {
  const { darkMode } = useDarkMode()
  const [selectedChart, setSelectedChart] = useState('accuracy-comparison')
  const [timeRange, setTimeRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(false)

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

  const trendData: MetricTrend[] = [
    { period: 'Week 1', accuracy: 89.2, precision: 87.5, recall: 91.0, f1Score: 89.2 },
    { period: 'Week 2', accuracy: 90.1, precision: 88.3, recall: 91.8, f1Score: 90.0 },
    { period: 'Week 3', accuracy: 91.5, precision: 89.7, recall: 93.2, f1Score: 91.4 },
    { period: 'Week 4', accuracy: 92.8, precision: 91.2, recall: 94.1, f1Score: 92.6 },
    { period: 'Week 5', accuracy: 93.4, precision: 91.8, recall: 94.8, f1Score: 93.3 },
    { period: 'Week 6', accuracy: 94.2, precision: 92.5, recall: 95.6, f1Score: 94.0 }
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
            <button className={`p-2 rounded-lg transition-all duration-200 ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
            }`}>
              <Download className="w-4 h-4" />
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

  const renderTrendChart = () => {
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
            Performance Trends
          </h3>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={`px-3 py-2 rounded-lg border transition-all duration-200 ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
        
        {/* Simple line chart representation */}
        <div className="relative h-64">
          <div className="absolute inset-0 flex items-end justify-between px-4">
            {trendData.map((point, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="relative">
                  <div 
                    className="w-3 bg-blue-500 rounded-t transition-all duration-1000"
                    style={{ height: `${(point.accuracy / 100) * 200}px` }}
                  ></div>
                  <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold px-2 py-1 rounded ${
                    darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {point.accuracy}%
                  </div>
                </div>
                <span className={`text-xs transition-colors duration-200 ${
                  darkMode ? 'text-gray-400' : 'text-slate-500'
                }`}>
                  {point.period}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4">
          {[
            { name: 'Accuracy', color: 'bg-blue-500' },
            { name: 'Precision', color: 'bg-green-500' },
            { name: 'Recall', color: 'bg-yellow-500' },
            { name: 'F1-Score', color: 'bg-purple-500' }
          ].map((metric, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${metric.color}`}></div>
              <span className={`text-sm transition-colors duration-200 ${
                darkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                {metric.name}
              </span>
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
                
                <button className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white' 
                    : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
                }`}>
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart Area */}
            <div className="lg:col-span-2">
              {selectedChart === 'accuracy-comparison' && renderBarChart(accuracyData, 'Model Accuracy Comparison', '%')}
              {selectedChart === 'response-time' && renderBarChart(responseTimeData, 'Average Response Time', 's')}
              {selectedChart === 'cost-analysis' && renderBarChart(costData, 'Cost per 1K Tokens', '$')}
              {selectedChart === 'performance-trends' && renderTrendChart()}
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Chart Info */}
              <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Chart Information
                </h3>
                
                {charts.filter(chart => chart.id === selectedChart).map(chart => {
                  const Icon = chart.icon
                  return (
                    <div key={chart.id} className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-xl ${
                          darkMode ? 'bg-blue-600' : 'bg-blue-100'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            darkMode ? 'text-white' : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className={`font-semibold transition-colors duration-200 ${
                            darkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            {chart.name}
                          </h4>
                          <p className={`text-sm transition-colors duration-200 ${
                            darkMode ? 'text-gray-400' : 'text-slate-600'
                          }`}>
                            {chart.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                            Last Updated
                          </span>
                          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            2 minutes ago
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                            Data Points
                          </span>
                          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            {selectedChart === 'performance-trends' ? trendData.length : accuracyData.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                            Chart Type
                          </span>
                          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            {selectedChart === 'performance-trends' ? 'Line Chart' : 'Bar Chart'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Quick Stats */}
              <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Quick Stats
                </h3>
                
                <div className="space-y-4">
                  {[
                    { label: 'Best Performer', value: 'GPT-4', sublabel: '94.2% accuracy' },
                    { label: 'Fastest Response', value: 'GPT-3.5', sublabel: '1.2s average' },
                    { label: 'Most Cost-Effective', value: 'GPT-3.5', sublabel: '$0.002/1K tokens' },
                    { label: 'Trending Up', value: 'Claude-3', sublabel: '+5.2% this week' }
                  ].map((stat, index) => (
                    <div key={index} className={`p-3 rounded-lg transition-colors duration-200 ${
                      darkMode ? 'bg-gray-700/30' : 'bg-slate-50'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                          {stat.label}
                        </span>
                        <div className="text-right">
                          <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            {stat.value}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                            {stat.sublabel}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Options */}
              <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Export Options
                </h3>
                
                <div className="space-y-2">
                  {[
                    { label: 'Download as PNG', format: 'PNG' },
                    { label: 'Export to PDF', format: 'PDF' },
                    { label: 'Save as Excel', format: 'XLSX' },
                    { label: 'Export Raw Data', format: 'CSV' }
                  ].map((option, index) => (
                    <button
                      key={index}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                        darkMode 
                          ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                          : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{option.label}</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}