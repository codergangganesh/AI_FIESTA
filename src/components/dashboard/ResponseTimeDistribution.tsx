'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { Eye, EyeOff } from 'lucide-react'
import { formatResponseTime } from '@/utils/formatUtils'
import { AI_MODELS } from '@/config/ai-models'

interface ResponseTimeData {
  name: string
  value: number
  color: string
}

interface ResponseTimeDistributionProps {
  data: ResponseTimeData[]
  title: string
  unit?: string
  isLoading?: boolean
}

// Function to get brand name from model name
const getBrandName = (modelName: string): string => {
  // First try exact match
  let model = AI_MODELS.find(m => m.name === modelName || m.id === modelName)
  
  // If no exact match, try partial match
  if (!model) {
    model = AI_MODELS.find(m => 
      m.name.includes(modelName) || 
      m.id.includes(modelName) ||
      modelName.includes(m.name) ||
      modelName.includes(m.id)
    )
  }
  
  // If still no match, try case insensitive match
  if (!model) {
    model = AI_MODELS.find(m => 
      m.name.toLowerCase() === modelName.toLowerCase() || 
      m.id.toLowerCase() === modelName.toLowerCase()
    )
  }
  
  return model ? model.displayName : modelName
}

export default function ResponseTimeDistribution({ 
  data, 
  title, 
  unit = 's', 
  isLoading = false 
}: ResponseTimeDistributionProps) {
  const { darkMode } = useDarkMode()
  const [displayedData, setDisplayedData] = useState<ResponseTimeData[]>([])
  const [showAll, setShowAll] = useState(false)
  const [maxValue, setMaxValue] = useState(0)

  useEffect(() => {
    if (data.length > 0) {
      const max = Math.max(...data.map(d => d.value))
      setMaxValue(max)
      
      // By default, show first 3 models, or all if there are 3 or fewer
      const defaultDisplayCount = Math.min(3, data.length)
      setDisplayedData(showAll ? data : data.slice(0, defaultDisplayCount))
    }
  }, [data, showAll])

  if (isLoading) {
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
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="space-y-2 animate-pulse">
              <div className="flex justify-between items-center">
                <div className={`h-4 rounded ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`} style={{ width: '30%' }}></div>
                <div className={`h-4 rounded ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`} style={{ width: '10%' }}></div>
              </div>
              <div className={`w-full rounded-full h-3 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div 
                  className={`h-3 rounded-full ${
                    darkMode ? 'bg-gray-600' : 'bg-gray-300'
                  }`}
                  style={{ width: '0%' }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (data.length === 0) {
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
        </div>
        
        <div className="flex items-center justify-center h-64">
          <p className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-slate-500'
          }`}>
            No data available
          </p>
        </div>
      </div>
    )
  }

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
        
        {(data.length > 3) && ( // Show View All button when there are more than 3 items
          <button
            onClick={() => setShowAll(!showAll)}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            title={showAll ? "Show less" : "View all"}
          >
            {showAll ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedData.map((item, index) => {
          // Calculate percentage for radial visualization
          const percentage = maxValue > 0 ? Math.min(100, Math.max(0, (item.value / maxValue) * 100)) : 0
          const radius = 40
          const circumference = 2 * Math.PI * radius
          const strokeDashoffset = circumference - (percentage / 100) * circumference
          
          // Get brand name instead of model name
          const brandName = getBrandName(item.name)
          
          // Determine color based on response time value
          let statusColor = 'text-blue-500'
          let statusBg = 'bg-blue-500'
          let statusLabel = 'Good'
          
          if (item.value <= 1) {
            statusColor = 'text-green-500'
            statusBg = 'bg-green-500'
            statusLabel = 'Excellent'
          } else if (item.value <= 3) {
            statusColor = 'text-yellow-500'
            statusBg = 'bg-yellow-500'
            statusLabel = 'Good'
          } else {
            statusColor = 'text-red-500'
            statusBg = 'bg-red-500'
            statusLabel = 'Needs Improvement'
          }
          
          // Calculate performance indicator
          const performanceIndicator = item.value <= 1 ? 'Fast' : item.value <= 3 ? 'Moderate' : 'Slow'
          
          return (
            <div 
              key={index} 
              className={`rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] ${
                darkMode 
                  ? 'bg-gray-700/30 hover:bg-gray-700/50' 
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-semibold transition-colors duration-200 ${
                  darkMode ? 'text-gray-200' : 'text-slate-800'
                }`}>
                  {brandName}
                </h4>
                <span className={`text-xs px-2 py-1 rounded-full ${statusBg} text-white`}>
                  {statusLabel}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="relative">
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      stroke={darkMode ? "#374151" : "#e5e7eb"}
                      strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      stroke={item.color}
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                      className="transition-all duration-1000 ease-out"
                    />
                    {/* Center text */}
                    <text
                      x="50"
                      y="50"
                      textAnchor="middle"
                      dy="0.3em"
                      className={`text-lg font-bold ${
                        darkMode ? 'fill-gray-200' : 'fill-slate-800'
                      }`}
                    >
                      {formatResponseTime(item.value).replace('s', '')}
                      <tspan className="text-xs font-normal">{unit}</tspan>
                    </text>
                  </svg>
                </div>
                
                <div className="text-right">
                  <div className={`text-2xl font-bold ${statusColor}`}>
                    {formatResponseTime(item.value)}
                  </div>
                  <div className={`text-xs mt-1 ${
                    darkMode ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    Response Time
                  </div>
                  
                  <div className="mt-3">
                    <div className={`w-full rounded-full h-2 ${
                      darkMode ? 'bg-gray-600' : 'bg-gray-200'
                    }`}>
                      <div 
                        className={`h-2 rounded-full ${statusBg} transition-all duration-1000 ease-out`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className={`text-xs mt-1 ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      {percentage.toFixed(0)}% of max
                    </div>
                  </div>
                  
                  {/* Additional information about the response time */}
                  <div className={`mt-2 text-xs px-2 py-1 rounded ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {performanceIndicator} performance
                  </div>
                </div>
              </div>
              
              {/* Visualization of user input to response time */}
              <div className={`mt-3 pt-3 border-t ${
                darkMode ? 'border-gray-600' : 'border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={darkMode ? 'text-gray-400' : 'text-slate-600'}>User Input</span>
                  <span className={darkMode ? 'text-gray-400' : 'text-slate-600'}>Model Response</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                  <div className={`flex-1 h-1 mx-1 ${darkMode ? 'bg-gray-600' : 'bg-slate-200'}`}>
                    <div 
                      className={`h-1 ${statusBg}`}
                      style={{ 
                        width: `${Math.min(100, item.value * 20)}%`,
                        transition: 'width 1s ease-out'
                      }}
                    ></div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${statusColor.replace('text-', 'bg-')}`}></div>
                </div>
                <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                  Time difference: {formatResponseTime(item.value)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
