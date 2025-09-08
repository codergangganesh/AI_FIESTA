'use client'

import { useState, useEffect, useRef } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import {
  Upload,
  FileText,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Download,
  Eye,
  Filter,
  Search,
  Database,
  Zap,
  Target,
  Brain,
  Info
} from 'lucide-react'

interface DatasetInfo {
  name: string
  size: string
  rows: number
  columns: number
  fileType: string
  uploadDate: string
}

interface ColumnInfo {
  name: string
  type: string
  nullCount: number
  uniqueCount: number
  description?: string
}

interface AnalysisResult {
  summary: {
    totalRows: number
    totalColumns: number
    missingValues: number
    duplicateRows: number
    numericalColumns: number
    categoricalColumns: number
  }
  recommendations: string[]
  insights: string[]
}

export default function DatasetAnalysisPage() {
  const { darkMode } = useDarkMode()
  const [dataset, setDataset] = useState<DatasetInfo | null>(null)
  const [columns, setColumns] = useState<ColumnInfo[]>([])
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [activeTab, setActiveTab] = useState('upload')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsAnalyzing(true)
    setUploadProgress(0)

    // Simulate file upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setUploadProgress(100)
    clearInterval(progressInterval)

    // Mock dataset info
    setDataset({
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      rows: 10000,
      columns: 12,
      fileType: file.name.split('.').pop()?.toUpperCase() || 'CSV',
      uploadDate: new Date().toISOString()
    })

    // Mock column analysis
    setColumns([
      { name: 'customer_id', type: 'Integer', nullCount: 0, uniqueCount: 10000, description: 'Unique customer identifier' },
      { name: 'age', type: 'Integer', nullCount: 23, uniqueCount: 67, description: 'Customer age in years' },
      { name: 'gender', type: 'Categorical', nullCount: 5, uniqueCount: 3, description: 'Customer gender' },
      { name: 'income', type: 'Float', nullCount: 145, uniqueCount: 8934, description: 'Annual income in USD' },
      { name: 'education', type: 'Categorical', nullCount: 67, uniqueCount: 5, description: 'Education level' },
      { name: 'purchase_amount', type: 'Float', nullCount: 12, uniqueCount: 9876, description: 'Purchase amount' },
      { name: 'product_category', type: 'Categorical', nullCount: 0, uniqueCount: 8, description: 'Product category' },
      { name: 'satisfaction_score', type: 'Integer', nullCount: 234, uniqueCount: 10, description: 'Satisfaction rating 1-10' },
      { name: 'region', type: 'Categorical', nullCount: 0, uniqueCount: 4, description: 'Geographic region' },
      { name: 'timestamp', type: 'DateTime', nullCount: 0, uniqueCount: 10000, description: 'Purchase timestamp' },
      { name: 'is_premium', type: 'Boolean', nullCount: 0, uniqueCount: 2, description: 'Premium customer flag' },
      { name: 'churn_risk', type: 'Float', nullCount: 89, uniqueCount: 9234, description: 'Churn probability score' }
    ])

    // Mock analysis results
    setAnalysis({
      summary: {
        totalRows: 10000,
        totalColumns: 12,
        missingValues: 575,
        duplicateRows: 23,
        numericalColumns: 5,
        categoricalColumns: 7
      },
      recommendations: [
        'Handle missing values in income and satisfaction_score columns',
        'Consider encoding categorical variables for machine learning',
        'Remove duplicate rows to improve data quality',
        'Feature engineering opportunity: create age groups from continuous age',
        'Correlation analysis recommended between income and purchase_amount'
      ],
      insights: [
        'Dataset has good coverage with 10K samples across 12 features',
        'Missing values present in 5.75% of data points',
        'Customer ID appears to be properly unique across all records',
        'Categorical features show reasonable distribution',
        'Timestamp data suggests longitudinal analysis possibilities'
      ]
    })

    setIsAnalyzing(false)
    setActiveTab('overview')
  }

  const tabs = [
    { id: 'upload', label: 'Upload Dataset', icon: Upload },
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'columns', label: 'Column Analysis', icon: BarChart3 },
    { id: 'insights', label: 'Insights', icon: Brain }
  ]

  const getColumnTypeColor = (type: string) => {
    const colors = {
      'Integer': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Float': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Categorical': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'Boolean': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'DateTime': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
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
                  Dataset Analysis
                </h1>
                <p className={`mt-1 transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Upload and analyze your datasets with automated EDA and insights
                </p>
              </div>
              
              {dataset && (
                <div className="flex items-center space-x-4">
                  <div className={`px-4 py-2 rounded-xl transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 border border-gray-600' 
                      : 'bg-white border border-slate-200'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <Database className={`w-4 h-4 ${
                        darkMode ? 'text-gray-300' : 'text-slate-600'
                      }`} />
                      <span className={`text-sm font-medium ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {dataset.name}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="mt-6">
              <div className="flex space-x-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? darkMode
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-600 text-white'
                          : darkMode
                            ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="max-w-4xl mx-auto">
              <div className={`rounded-2xl border-2 border-dashed p-12 text-center transition-colors duration-200 ${
                darkMode 
                  ? 'border-gray-600 bg-gray-800/30' 
                  : 'border-slate-300 bg-slate-50/50'
              }`}>
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-blue-600' : 'bg-blue-100'
                }`}>
                  <Upload className={`w-10 h-10 ${
                    darkMode ? 'text-white' : 'text-blue-600'
                  }`} />
                </div>
                
                <h3 className={`text-2xl font-bold mb-4 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Upload Your Dataset
                </h3>
                
                <p className={`text-lg mb-8 transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Drag and drop your CSV, Excel, or JSON file here, or click to browse
                </p>

                <div className="space-y-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAnalyzing}
                    className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                  >
                    <Upload className="w-5 h-5" />
                    <span>{isAnalyzing ? 'Analyzing...' : 'Choose File'}</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {isAnalyzing && (
                    <div className="max-w-md mx-auto">
                      <div className="flex justify-between text-sm mb-2">
                        <span className={darkMode ? 'text-gray-300' : 'text-slate-600'}>
                          Processing...
                        </span>
                        <span className={darkMode ? 'text-gray-300' : 'text-slate-600'}>
                          {uploadProgress}%
                        </span>
                      </div>
                      <div className={`w-full rounded-full h-2 ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{width: `${uploadProgress}%`}}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  {[
                    { icon: FileText, title: 'Supported Formats', desc: 'CSV, Excel, JSON files up to 100MB' },
                    { icon: Zap, title: 'Fast Analysis', desc: 'Automated EDA completed in seconds' },
                    { icon: Target, title: 'Smart Insights', desc: 'AI-powered recommendations and insights' }
                  ].map((feature, index) => {
                    const Icon = feature.icon
                    return (
                      <div key={index} className={`p-4 rounded-xl transition-colors duration-200 ${
                        darkMode ? 'bg-gray-800/60' : 'bg-white/80'
                      }`}>
                        <Icon className={`w-8 h-8 mb-3 ${
                          darkMode ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                        <h4 className={`font-semibold mb-2 transition-colors duration-200 ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {feature.title}
                        </h4>
                        <p className={`text-sm transition-colors duration-200 ${
                          darkMode ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          {feature.desc}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && dataset && analysis && (
            <div className="space-y-6">
              {/* Dataset Info */}
              <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <h2 className={`text-xl font-bold mb-6 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Dataset Overview
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[
                    { label: 'Rows', value: analysis.summary.totalRows.toLocaleString(), icon: BarChart3 },
                    { label: 'Columns', value: analysis.summary.totalColumns.toString(), icon: Database },
                    { label: 'Missing Values', value: analysis.summary.missingValues.toString(), icon: AlertCircle },
                    { label: 'Duplicates', value: analysis.summary.duplicateRows.toString(), icon: CheckCircle },
                    { label: 'Numerical', value: analysis.summary.numericalColumns.toString(), icon: TrendingUp },
                    { label: 'Categorical', value: analysis.summary.categoricalColumns.toString(), icon: Filter }
                  ].map((stat, index) => {
                    const Icon = stat.icon
                    return (
                      <div key={index} className={`p-4 rounded-xl text-center transition-colors duration-200 ${
                        darkMode ? 'bg-gray-700/50' : 'bg-slate-50'
                      }`}>
                        <Icon className={`w-8 h-8 mx-auto mb-2 ${
                          darkMode ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                        <p className={`text-2xl font-bold mb-1 transition-colors duration-200 ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {stat.value}
                        </p>
                        <p className={`text-sm transition-colors duration-200 ${
                          darkMode ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          {stat.label}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Key Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gray-800/60 border border-gray-700/50' 
                    : 'bg-white/80 border border-slate-200/50'
                }`}>
                  <h3 className={`text-lg font-bold mb-4 flex items-center transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    <Brain className="w-5 h-5 mr-2 text-blue-600" />
                    Key Insights
                  </h3>
                  <div className="space-y-3">
                    {analysis.insights.map((insight, index) => (
                      <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                        darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
                      }`}>
                        <Info className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          darkMode ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                        <p className={`text-sm transition-colors duration-200 ${
                          darkMode ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          {insight}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gray-800/60 border border-gray-700/50' 
                    : 'bg-white/80 border border-slate-200/50'
                }`}>
                  <h3 className={`text-lg font-bold mb-4 flex items-center transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    <Target className="w-5 h-5 mr-2 text-green-600" />
                    Recommendations
                  </h3>
                  <div className="space-y-3">
                    {analysis.recommendations.map((recommendation, index) => (
                      <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                        darkMode ? 'bg-green-900/20' : 'bg-green-50'
                      }`}>
                        <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          darkMode ? 'text-green-400' : 'text-green-600'
                        }`} />
                        <p className={`text-sm transition-colors duration-200 ${
                          darkMode ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          {recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Columns Tab */}
          {activeTab === 'columns' && columns.length > 0 && (
            <div className={`rounded-2xl overflow-hidden transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-800/60 border border-gray-700/50' 
                : 'bg-white/80 border border-slate-200/50'
            }`}>
              <div className="p-6 border-b border-current border-opacity-10">
                <h2 className={`text-xl font-bold transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Column Analysis
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${darkMode ? 'bg-gray-700/50' : 'bg-slate-50'}`}>
                    <tr>
                      <th className={`text-left px-6 py-4 font-semibold transition-colors duration-200 ${
                        darkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>Column Name</th>
                      <th className={`text-left px-6 py-4 font-semibold transition-colors duration-200 ${
                        darkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>Type</th>
                      <th className={`text-left px-6 py-4 font-semibold transition-colors duration-200 ${
                        darkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>Null Count</th>
                      <th className={`text-left px-6 py-4 font-semibold transition-colors duration-200 ${
                        darkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>Unique Values</th>
                      <th className={`text-left px-6 py-4 font-semibold transition-colors duration-200 ${
                        darkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {columns.map((column, index) => (
                      <tr key={index} className={`border-t transition-colors duration-200 ${
                        darkMode ? 'border-gray-700/50' : 'border-slate-200/50'
                      }`}>
                        <td className={`px-6 py-4 font-mono text-sm transition-colors duration-200 ${
                          darkMode ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                          {column.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColumnTypeColor(column.type)}`}>
                            {column.type}
                          </span>
                        </td>
                        <td className={`px-6 py-4 transition-colors duration-200 ${
                          column.nullCount > 0 
                            ? darkMode ? 'text-orange-400' : 'text-orange-600'
                            : darkMode ? 'text-green-400' : 'text-green-600'
                        }`}>
                          {column.nullCount.toLocaleString()}
                        </td>
                        <td className={`px-6 py-4 transition-colors duration-200 ${
                          darkMode ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          {column.uniqueCount.toLocaleString()}
                        </td>
                        <td className={`px-6 py-4 text-sm transition-colors duration-200 ${
                          darkMode ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          {column.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && analysis && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Data Quality Score */}
                <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gray-800/60 border border-gray-700/50' 
                    : 'bg-white/80 border border-slate-200/50'
                }`}>
                  <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Data Quality Score
                  </h3>
                  
                  <div className="text-center">
                    <div className={`text-6xl font-bold mb-2 transition-colors duration-200 ${
                      darkMode ? 'text-green-400' : 'text-green-600'
                    }`}>
                      85
                    </div>
                    <p className={`text-sm transition-colors duration-200 ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      Out of 100
                    </p>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className={darkMode ? 'text-gray-300' : 'text-slate-700'}>Completeness</span>
                        <span className={darkMode ? 'text-white' : 'text-slate-900'}>94%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={darkMode ? 'text-gray-300' : 'text-slate-700'}>Uniqueness</span>
                        <span className={darkMode ? 'text-white' : 'text-slate-900'}>98%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={darkMode ? 'text-gray-300' : 'text-slate-700'}>Consistency</span>
                        <span className={darkMode ? 'text-white' : 'text-slate-900'}>92%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gray-800/60 border border-gray-700/50' 
                    : 'bg-white/80 border border-slate-200/50'
                }`}>
                  <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Recommended Next Steps
                  </h3>
                  
                  <div className="space-y-3">
                    {[
                      'Run model comparison analysis',
                      'Perform correlation analysis',
                      'Create visualization dashboard',
                      'Export cleaned dataset'
                    ].map((step, index) => (
                      <button
                        key={index}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                          darkMode 
                            ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white' 
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{step}</span>
                          <Eye className="w-4 h-4" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}