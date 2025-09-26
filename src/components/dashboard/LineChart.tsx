'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { formatNumber, formatResponseTime } from '@/utils/formatUtils'
import { Eye, EyeOff } from 'lucide-react'

interface LineChartDataPoint {
  period: string
  [key: string]: number | string
}

interface LineChartProps {
  data: LineChartDataPoint[]
  title: string
  metrics: string[]
  metricLabels: Record<string, string>
  isLoading?: boolean
}

export default function LineChart({ data, title, metrics, metricLabels, isLoading = false }: LineChartProps) {
  const { darkMode } = useDarkMode()
  const [maxValue, setMaxValue] = useState(0)
  const [displayedMetrics, setDisplayedMetrics] = useState<string[]>([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (data.length > 0 && metrics.length > 0) {
      // Show first 3 metrics by default, or all if there are 3 or fewer
      const defaultDisplayCount = Math.min(3, metrics.length)
      setDisplayedMetrics(showAll ? metrics : metrics.slice(0, defaultDisplayCount))
      
      const allValues = data.flatMap(point => 
        metrics.map(metric => typeof point[metric] === 'number' ? point[metric] as number : 0)
      )
      const max = Math.max(...allValues)
      setMaxValue(max)
    }
  }, [data, metrics, showAll])

  const getColorForMetric = (metric: string, index: number): string => {
    const colors = [
      '#3B82F6', // blue
      '#10B981', // green
      '#8B5CF6', // purple
      '#F59E0B', // yellow
      '#EF4444', // red
      '#6B7280', // gray
      '#06B6D4', // cyan
      '#8B5CF6', // violet
      '#F97316'  // orange
    ]
    return colors[index % colors.length]
  }

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
        
        <div className="relative h-64 animate-pulse">
          <div className={`absolute inset-0 rounded-lg ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>
        </div>
      </div>
    )
  }

  if (data.length === 0 || metrics.length === 0) {
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
        
        {metrics.length > 3 && (
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
      
      {/* Chart area */}
      <div className="relative h-64">
        <div className="absolute inset-0 flex items-end justify-between px-4">
          {data.map((point, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 flex-1">
              <div className="relative flex items-end justify-center h-48 w-full">
                {displayedMetrics.map((metric, metricIndex) => (
                  <div 
                    key={`${index}-${metricIndex}`}
                    className="absolute bottom-0 flex flex-col items-center"
                    style={{ 
                      left: `${(100 / (displayedMetrics.length + 1)) * (metricIndex + 1)}%`,
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <div 
                      className="w-2 rounded-t transition-all duration-1000"
                      style={{ 
                        height: `${maxValue > 0 ? Math.min(192, Math.max(0, ((point[metric] as number) / maxValue) * 192)) : 0}px`,
                        backgroundColor: getColorForMetric(metric, metricIndex)
                      }}
                    ></div>
                    <div className={`absolute -top-8 text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${
                      darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                    }`}>
                      {/* Updated to use proper formatting based on metric type */}
                      {metric === 'responseTime' ? formatResponseTime(point[metric] as number) : 
                       ['accuracy', 'precision', 'recall', 'f1Score', 'rocAuc'].includes(metric) ? 
                       `${formatNumber(point[metric] as number)}%` : 
                       formatNumber(point[metric] as number)}
                    </div>
                  </div>
                ))}
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
        {displayedMetrics.map((metric, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getColorForMetric(metric, index) }}
            ></div>
            <span className={`text-sm transition-colors duration-200 ${
              darkMode ? 'text-gray-300' : 'text-slate-600'
            }`}>
              {metricLabels[metric] || metric}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}