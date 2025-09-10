'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import {
  GitCompare,
  BarChart3,
  Target,
  Star,
  Clock,
  DollarSign,
  Award,
  Download,
  RefreshCw,
  Play,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

interface ModelMetrics {
  id: string
  name: string
  provider: string
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  rocAuc: number
  responseTime: number
  costPer1k: number
  status: 'running' | 'completed' | 'failed'
}

interface ComparisonConfig {
  selectedModels: string[]
  selectedMetrics: string[]
  testDataset: string
}

export default function ModelComparisonPage() {
  const { darkMode } = useDarkMode()
  const [models, setModels] = useState<ModelMetrics[]>([])
  const [config, setConfig] = useState<ComparisonConfig>({
    selectedModels: [],
    selectedMetrics: ['accuracy', 'precision', 'recall', 'f1Score'],
    testDataset: 'default'
  })
  const [isRunning, setIsRunning] = useState(false)
  const [sortBy, setSortBy] = useState<string>('accuracy')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const mockModels: ModelMetrics[] = [
      {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'OpenAI',
        accuracy: 94.2,
        precision: 93.8,
        recall: 94.6,
        f1Score: 94.2,
        rocAuc: 97.1,
        responseTime: 1.2,
        costPer1k: 0.03,
        status: 'completed'
      },
      {
        id: 'claude-3',
        name: 'Claude 3 Sonnet',
        provider: 'Anthropic',
        accuracy: 92.8,
        precision: 92.1,
        recall: 93.5,
        f1Score: 92.8,
        rocAuc: 96.3,
        responseTime: 0.9,
        costPer1k: 0.025,
        status: 'completed'
      },
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        provider: 'Google',
        accuracy: 91.5,
        precision: 90.8,
        recall: 92.2,
        f1Score: 91.5,
        rocAuc: 95.7,
        responseTime: 0.7,
        costPer1k: 0.02,
        status: 'completed'
      },
      {
        id: 'meta-llama/llama-3.3-70b-instruct',
        name: 'LLaMA 3.3',
        provider: 'Meta',
        accuracy: 89.3,
        precision: 88.7,
        recall: 90.0,
        f1Score: 89.3,
        rocAuc: 94.1,
        responseTime: 1.8,
        costPer1k: 0.015,
        status: 'running'
      },
      {
        id: 'qwen/qwen-2.5-72b-instruct',
        name: 'Qwen 2.5',
        provider: 'Alibaba',
        accuracy: 87.5,
        precision: 86.9,
        recall: 88.1,
        f1Score: 87.5,
        rocAuc: 93.2,
        responseTime: 2.1,
        costPer1k: 0.012,
        status: 'completed'
      },
      {
        id: 'deepseek/deepseek-chat',
        name: 'DeepSeek',
        provider: 'DeepSeek',
        accuracy: 85.2,
        precision: 84.7,
        recall: 85.7,
        f1Score: 85.2,
        rocAuc: 91.8,
        responseTime: 1.5,
        costPer1k: 0.008,
        status: 'completed'
      }
    ]
    setModels(mockModels)
    
    // Set default models to LLaMA, Qwen, and DeepSeek for first-time users
    const defaultModelIds = [
      'meta-llama/llama-3.3-70b-instruct',
      'qwen/qwen-2.5-72b-instruct', 
      'deepseek/deepseek-chat'
    ]
    setConfig(prev => ({ ...prev, selectedModels: defaultModelIds }))
  }, [])

  const availableMetrics = [
    { key: 'accuracy', label: 'Accuracy' },
    { key: 'precision', label: 'Precision' },
    { key: 'recall', label: 'Recall' },
    { key: 'f1Score', label: 'F1-Score' },
    { key: 'rocAuc', label: 'ROC-AUC' },
    { key: 'responseTime', label: 'Response Time' },
    { key: 'costPer1k', label: 'Cost per 1K' }
  ]

  const getMetricValue = (model: ModelMetrics, metric: string): number => {
    return model[metric as keyof ModelMetrics] as number
  }

  const getMetricColor = (value: number, metric: string): string => {
    const isHigherBetter = !['responseTime', 'costPer1k'].includes(metric)
    
    if (metric === 'responseTime') {
      if (value <= 1.0) return darkMode ? 'text-green-400' : 'text-green-600'
      if (value <= 2.0) return darkMode ? 'text-yellow-400' : 'text-yellow-600'
      return darkMode ? 'text-red-400' : 'text-red-600'
    }
    
    if (isHigherBetter) {
      if (value >= 90) return darkMode ? 'text-green-400' : 'text-green-600'
      if (value >= 80) return darkMode ? 'text-yellow-400' : 'text-yellow-600'
      return darkMode ? 'text-red-400' : 'text-red-600'
    }
    
    return darkMode ? 'text-gray-300' : 'text-slate-700'
  }

  const runComparison = async () => {
    setIsRunning(true)
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsRunning(false)
  }

  const sortedModels = [...models]
    .filter(model => config.selectedModels.includes(model.id))
    .sort((a, b) => {
      const aValue = getMetricValue(a, sortBy)
      const bValue = getMetricValue(b, sortBy)
      const isHigherBetter = !['responseTime', 'costPer1k'].includes(sortBy)
      
      if (sortOrder === 'desc') {
        return isHigherBetter ? bValue - aValue : aValue - bValue
      } else {
        return isHigherBetter ? aValue - bValue : bValue - aValue
      }
    })

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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className={`text-3xl font-bold transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Model Comparison
                </h1>
                <p className={`mt-1 transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Compare AI models across multiple metrics and performance indicators
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={runComparison}
                  disabled={isRunning || config.selectedModels.length < 2}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                >
                  {isRunning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                  <span>{isRunning ? 'Running...' : 'Run Comparison'}</span>
                </button>
                
                <button className={`p-3 rounded-xl transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                }`}>
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Configuration Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Model Selection */}
              <div className={`p-4 rounded-xl transition-colors duration-200 ${
                darkMode ? 'bg-gray-800/60' : 'bg-white/80'
              }`}>
                <h3 className={`text-sm font-semibold mb-3 transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-700'
                }`}>
                  Select Models ({config.selectedModels.length})
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {models.map(model => (
                    <label key={model.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.selectedModels.includes(model.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setConfig(prev => ({
                              ...prev,
                              selectedModels: [...prev.selectedModels, model.id]
                            }))
                          } else {
                            setConfig(prev => ({
                              ...prev,
                              selectedModels: prev.selectedModels.filter(id => id !== model.id)
                            }))
                          }
                        }}
                        className="rounded text-blue-600"
                      />
                      <span className={`text-sm transition-colors duration-200 ${
                        darkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                        {model.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Metrics Selection */}
              <div className={`p-4 rounded-xl transition-colors duration-200 ${
                darkMode ? 'bg-gray-800/60' : 'bg-white/80'
              }`}>
                <h3 className={`text-sm font-semibold mb-3 transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-700'
                }`}>
                  Metrics ({config.selectedMetrics.length})
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availableMetrics.map(metric => (
                    <label key={metric.key} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.selectedMetrics.includes(metric.key)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setConfig(prev => ({
                              ...prev,
                              selectedMetrics: [...prev.selectedMetrics, metric.key]
                            }))
                          } else {
                            setConfig(prev => ({
                              ...prev,
                              selectedMetrics: prev.selectedMetrics.filter(m => m !== metric.key)
                            }))
                          }
                        }}
                        className="rounded text-blue-600"
                      />
                      <span className={`text-sm transition-colors duration-200 ${
                        darkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                        {metric.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dataset Selection */}
              <div className={`p-4 rounded-xl transition-colors duration-200 ${
                darkMode ? 'bg-gray-800/60' : 'bg-white/80'
              }`}>
                <h3 className={`text-sm font-semibold mb-3 transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-700'
                }`}>
                  Test Dataset
                </h3>
                <select
                  value={config.testDataset}
                  onChange={(e) => setConfig(prev => ({ ...prev, testDataset: e.target.value }))}
                  className={`w-full p-2 rounded-lg border transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="default">Default Test Set</option>
                  <option value="custom-1">Customer Support Dataset</option>
                  <option value="custom-2">Technical Documentation</option>
                  <option value="custom-3">Creative Writing Tasks</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="p-6">
          {config.selectedModels.length < 2 ? (
            <div className={`text-center py-16 rounded-2xl transition-colors duration-200 ${
              darkMode ? 'bg-gray-800/60' : 'bg-white/80'
            }`}>
              <GitCompare className={`w-16 h-16 mx-auto mb-4 transition-colors duration-200 ${
                darkMode ? 'text-gray-500' : 'text-slate-400'
              }`} />
              <h3 className={`text-xl font-bold mb-2 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Select Models to Compare
              </h3>
              <p className={`transition-colors duration-200 ${
                darkMode ? 'text-gray-400' : 'text-slate-600'
              }`}>
                Choose at least 2 models to start the comparison analysis
              </p>
            </div>
          ) : (
            <>
              {/* Sort Controls */}
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Comparison Results
                </h2>
                
                <div className="flex items-center space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`p-2 rounded-lg border transition-colors duration-200 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    {availableMetrics.map(metric => (
                      <option key={metric.key} value={metric.key}>{metric.label}</option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {sortOrder === 'desc' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Comparison Table */}
              <div className={`rounded-2xl overflow-hidden transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={darkMode ? 'bg-gray-700/50' : 'bg-slate-50'}>
                      <tr>
                        <th className={`text-left px-6 py-4 font-semibold transition-colors duration-200 ${
                          darkMode ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          Model
                        </th>
                        {config.selectedMetrics.map(metricKey => {
                          const metric = availableMetrics.find(m => m.key === metricKey)
                          return (
                            <th key={metricKey} className={`text-left px-6 py-4 font-semibold transition-colors duration-200 ${
                              darkMode ? 'text-gray-300' : 'text-slate-700'
                            }`}>
                              {metric?.label}
                            </th>
                          )
                        })}
                        <th className={`text-left px-6 py-4 font-semibold transition-colors duration-200 ${
                          darkMode ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedModels.map((model, index) => (
                        <tr key={model.id} className={`border-t transition-colors duration-200 ${
                          darkMode ? 'border-gray-700/50' : 'border-slate-200/50'
                        }`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                                index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                              }`} />
                              <div>
                                <p className={`font-medium transition-colors duration-200 ${
                                  darkMode ? 'text-white' : 'text-slate-900'
                                }`}>
                                  {model.name}
                                </p>
                                <p className={`text-sm transition-colors duration-200 ${
                                  darkMode ? 'text-gray-400' : 'text-slate-500'
                                }`}>
                                  {model.provider}
                                </p>
                              </div>
                              {index === 0 && <Award className="w-5 h-5 text-yellow-500" />}
                            </div>
                          </td>
                          {config.selectedMetrics.map(metricKey => (
                            <td key={metricKey} className="px-6 py-4">
                              <span className={`font-mono font-semibold ${getMetricColor(getMetricValue(model, metricKey), metricKey)}`}>
                                {metricKey === 'costPer1k' ? '$' : ''}
                                {getMetricValue(model, metricKey).toFixed(metricKey === 'responseTime' || metricKey === 'costPer1k' ? 3 : 1)}
                                {metricKey === 'responseTime' ? 's' : 
                                 ['accuracy', 'precision', 'recall', 'f1Score', 'rocAuc'].includes(metricKey) ? '%' : ''}
                              </span>
                            </td>
                          ))}
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              model.status === 'completed' 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : model.status === 'running'
                                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {model.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {model.status === 'running' && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                              {model.status === 'failed' && <AlertTriangle className="w-3 h-3 mr-1" />}
                              {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Performance Summary */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Target, label: 'Best Accuracy', value: `${Math.max(...sortedModels.map(m => m.accuracy)).toFixed(1)}%`, model: sortedModels.find(m => m.accuracy === Math.max(...sortedModels.map(m => m.accuracy)))?.name },
                  { icon: Clock, label: 'Fastest Response', value: `${Math.min(...sortedModels.map(m => m.responseTime)).toFixed(2)}s`, model: sortedModels.find(m => m.responseTime === Math.min(...sortedModels.map(m => m.responseTime)))?.name },
                  { icon: DollarSign, label: 'Most Cost Effective', value: `$${Math.min(...sortedModels.map(m => m.costPer1k)).toFixed(3)}`, model: sortedModels.find(m => m.costPer1k === Math.min(...sortedModels.map(m => m.costPer1k)))?.name },
                  { icon: Star, label: 'Best F1-Score', value: `${Math.max(...sortedModels.map(m => m.f1Score)).toFixed(1)}%`, model: sortedModels.find(m => m.f1Score === Math.max(...sortedModels.map(m => m.f1Score)))?.name }
                ].map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className={`p-4 rounded-xl transition-colors duration-200 ${
                      darkMode ? 'bg-gray-800/60' : 'bg-white/80'
                    }`}>
                      <div className="flex items-center space-x-3 mb-2">
                        <Icon className={`w-6 h-6 ${
                          darkMode ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                        <h3 className={`font-semibold transition-colors duration-200 ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {stat.label}
                        </h3>
                      </div>
                      <p className={`text-2xl font-bold mb-1 transition-colors duration-200 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {stat.value}
                      </p>
                      <p className={`text-sm transition-colors duration-200 ${
                        darkMode ? 'text-gray-400' : 'text-slate-500'
                      }`}>
                        {stat.model}
                      </p>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}