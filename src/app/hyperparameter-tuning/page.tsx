'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import {
  Settings,
  Play,
  RefreshCw,
  TrendingUp,
  Target,
  Zap,
  Brain,
  Download,
  Plus,
  Minus,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

interface Parameter {
  name: string
  type: 'range' | 'choice' | 'boolean'
  min?: number
  max?: number
  step?: number
  choices?: string[]
  default: any
  current: any
  description: string
}

interface TuningJob {
  id: string
  name: string
  status: 'running' | 'completed' | 'failed' | 'pending'
  progress: number
  bestScore: number
  totalTrials: number
  completedTrials: number
  startTime: string
  parameters: Parameter[]
}

export default function HyperparameterTuningPage() {
  const { darkMode } = useDarkMode()
  const [activeTab, setActiveTab] = useState('configure')
  const [tuningJobs, setTuningJobs] = useState<TuningJob[]>([])
  const [currentJob, setCurrentJob] = useState<TuningJob | null>(null)
  const [parameters, setParameters] = useState<Parameter[]>([
    {
      name: 'learning_rate',
      type: 'range',
      min: 0.0001,
      max: 0.1,
      step: 0.0001,
      default: 0.001,
      current: 0.001,
      description: 'Controls how much to change the model in response to the estimated error'
    },
    {
      name: 'batch_size',
      type: 'choice',
      choices: ['16', '32', '64', '128'],
      default: '32',
      current: '32',
      description: 'Number of training examples utilized in one iteration'
    },
    {
      name: 'max_tokens',
      type: 'range',
      min: 100,
      max: 4000,
      step: 100,
      default: 1000,
      current: 1000,
      description: 'Maximum number of tokens to generate'
    },
    {
      name: 'temperature',
      type: 'range',
      min: 0.1,
      max: 2.0,
      step: 0.1,
      default: 0.7,
      current: 0.7,
      description: 'Controls randomness in output generation'
    }
  ])

  useEffect(() => {
    // Mock tuning jobs
    const mockJobs: TuningJob[] = [
      {
        id: 'job-1',
        name: 'GPT-4 Optimization',
        status: 'completed',
        progress: 100,
        bestScore: 0.943,
        totalTrials: 50,
        completedTrials: 50,
        startTime: '2024-01-15T09:00:00Z',
        parameters: [...parameters]
      },
      {
        id: 'job-2',
        name: 'Claude 3 Tuning',
        status: 'running',
        progress: 60,
        bestScore: 0.912,
        totalTrials: 100,
        completedTrials: 60,
        startTime: '2024-01-15T11:30:00Z',
        parameters: [...parameters]
      }
    ]
    setTuningJobs(mockJobs)
  }, [])

  const updateParameter = (index: number, value: any) => {
    setParameters(prev => prev.map((param, i) => 
      i === index ? { ...param, current: value } : param
    ))
  }

  const startTuning = () => {
    const newJob: TuningJob = {
      id: `job-${Date.now()}`,
      name: `New Tuning Job`,
      status: 'pending',
      progress: 0,
      bestScore: 0,
      totalTrials: 50,
      completedTrials: 0,
      startTime: new Date().toISOString(),
      parameters: [...parameters]
    }
    setTuningJobs(prev => [newJob, ...prev])
    setCurrentJob(newJob)
  }

  const tabs = [
    { id: 'configure', label: 'Configure', icon: Settings },
    { id: 'jobs', label: 'Tuning Jobs', icon: BarChart3 },
    { id: 'results', label: 'Results', icon: Target }
  ]

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
                  Hyperparameter Tuning
                </h1>
                <p className={`mt-1 transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Optimize model performance with automated hyperparameter search
                </p>
              </div>
              
              <button
                onClick={startTuning}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
              >
                <Play className="w-5 h-5" />
                <span>Start Tuning</span>
              </button>
            </div>

            {/* Tabs */}
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

        {/* Content */}
        <div className="p-6">
          {/* Configure Tab */}
          {activeTab === 'configure' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <h2 className={`text-xl font-bold mb-6 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Parameter Configuration
                </h2>

                <div className="space-y-6">
                  {parameters.map((param, index) => (
                    <div key={param.name} className={`p-4 rounded-xl transition-colors duration-200 ${
                      darkMode ? 'bg-gray-700/50' : 'bg-slate-50'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className={`font-semibold transition-colors duration-200 ${
                            darkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            {param.name}
                          </h3>
                          <p className={`text-sm transition-colors duration-200 ${
                            darkMode ? 'text-gray-400' : 'text-slate-600'
                          }`}>
                            {param.description}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium transition-colors duration-200 ${
                          darkMode 
                            ? 'bg-blue-900/30 text-blue-400' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {param.type}
                        </span>
                      </div>

                      {param.type === 'range' && (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-4">
                            <input
                              type="range"
                              min={param.min}
                              max={param.max}
                              step={param.step}
                              value={param.current}
                              onChange={(e) => updateParameter(index, parseFloat(e.target.value))}
                              className="flex-1"
                            />
                            <input
                              type="number"
                              min={param.min}
                              max={param.max}
                              step={param.step}
                              value={param.current}
                              onChange={(e) => updateParameter(index, parseFloat(e.target.value))}
                              className={`w-24 p-2 rounded border transition-colors duration-200 ${
                                darkMode 
                                  ? 'bg-gray-600 border-gray-500 text-white' 
                                  : 'bg-white border-slate-300 text-slate-900'
                              }`}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{param.min}</span>
                            <span>{param.max}</span>
                          </div>
                        </div>
                      )}

                      {param.type === 'choice' && (
                        <select
                          value={param.current}
                          onChange={(e) => updateParameter(index, e.target.value)}
                          className={`w-full p-2 rounded border transition-colors duration-200 ${
                            darkMode 
                              ? 'bg-gray-600 border-gray-500 text-white' 
                              : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        >
                          {param.choices?.map(choice => (
                            <option key={choice} value={choice}>{choice}</option>
                          ))}
                        </select>
                      )}

                      {param.type === 'boolean' && (
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={param.current}
                            onChange={(e) => updateParameter(index, e.target.checked)}
                            className="rounded"
                          />
                          <span className={`text-sm transition-colors duration-200 ${
                            darkMode ? 'text-gray-300' : 'text-slate-700'
                          }`}>
                            Enable {param.name}
                          </span>
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Search Strategy */}
              <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Search Strategy
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Grid Search', desc: 'Exhaustive search through parameter combinations' },
                    { name: 'Random Search', desc: 'Random sampling of parameter space' },
                    { name: 'Bayesian Optimization', desc: 'Smart search using previous results' }
                  ].map((strategy, index) => (
                    <label key={strategy.name} className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      index === 1 
                        ? darkMode 
                          ? 'border-blue-500 bg-blue-900/20' 
                          : 'border-blue-500 bg-blue-50'
                        : darkMode
                          ? 'border-gray-600 hover:border-gray-500'
                          : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input type="radio" name="strategy" defaultChecked={index === 1} className="sr-only" />
                      <h4 className={`font-semibold mb-2 transition-colors duration-200 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {strategy.name}
                      </h4>
                      <p className={`text-sm transition-colors duration-200 ${
                        darkMode ? 'text-gray-400' : 'text-slate-600'
                      }`}>
                        {strategy.desc}
                      </p>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tuningJobs.map(job => (
                  <div key={job.id} className={`p-6 rounded-2xl transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-gray-800/60 border border-gray-700/50' 
                      : 'bg-white/80 border border-slate-200/50'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`font-bold transition-colors duration-200 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {job.name}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        job.status === 'completed' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : job.status === 'running'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                        {job.status === 'running' && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                        {job.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {job.status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={darkMode ? 'text-gray-400' : 'text-slate-600'}>Progress</span>
                          <span className={darkMode ? 'text-white' : 'text-slate-900'}>{job.progress}%</span>
                        </div>
                        <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{width: `${job.progress}%`}}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className={darkMode ? 'text-gray-400' : 'text-slate-600'}>Best Score</span>
                        <span className={darkMode ? 'text-white' : 'text-slate-900'}>{(job.bestScore * 100).toFixed(1)}%</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className={darkMode ? 'text-gray-400' : 'text-slate-600'}>Trials</span>
                        <span className={darkMode ? 'text-white' : 'text-slate-900'}>{job.completedTrials}/{job.totalTrials}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setCurrentJob(job)}
                      className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                        darkMode 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && currentJob && (
            <div className="space-y-6">
              <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <h2 className={`text-xl font-bold mb-6 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Tuning Results: {currentJob.name}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Best Score', value: `${(currentJob.bestScore * 100).toFixed(1)}%`, icon: Target },
                    { label: 'Total Trials', value: currentJob.totalTrials.toString(), icon: BarChart3 },
                    { label: 'Completed', value: currentJob.completedTrials.toString(), icon: CheckCircle },
                    { label: 'Time Elapsed', value: '2h 15m', icon: Clock }
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

                {/* Best Parameters */}
                <div className={`p-4 rounded-xl transition-colors duration-200 ${
                  darkMode ? 'bg-green-900/20 border border-green-700/30' : 'bg-green-50 border border-green-200'
                }`}>
                  <h3 className={`font-semibold mb-3 transition-colors duration-200 ${
                    darkMode ? 'text-green-400' : 'text-green-700'
                  }`}>
                    Best Parameters Found
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {currentJob.parameters.map(param => (
                      <div key={param.name}>
                        <p className={`text-sm font-medium transition-colors duration-200 ${
                          darkMode ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          {param.name}
                        </p>
                        <p className={`font-mono font-bold transition-colors duration-200 ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {param.current}
                        </p>
                      </div>
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