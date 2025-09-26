'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'

interface HistoricalBarChartDataPoint {
  name: string
  value: number
  color: string
}

interface HistoricalBarChartProps {
  data: HistoricalBarChartDataPoint[]
  title: string
  unit?: string
  isLoading?: boolean
}

export default function HistoricalBarChart({ data, title, unit = '', isLoading = false }: HistoricalBarChartProps) {
  const { darkMode } = useDarkMode()
  const [maxValue, setMaxValue] = useState(0)

  useEffect(() => {
    if (data.length > 0) {
      const max = Math.max(...data.map(d => d.value))
      setMaxValue(max)
    }
  }, [data])

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-bold transition-colors duration-200 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            {title}
          </h3>
        </div>
        
        <div className="flex items-end flex-1 space-x-2">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex flex-col items-center flex-1 animate-pulse">
              <div className={`w-full rounded-t ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`} style={{ height: `${20 + item * 10}%` }}></div>
              <div className={`mt-2 h-3 rounded ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`} style={{ width: '70%' }}></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className={`text-center p-4 rounded-lg ${
          darkMode ? 'bg-gray-700/30' : 'bg-slate-50'
        }`}>
          <h3 className={`text-lg font-bold mb-2 transition-colors duration-200 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            {title}
          </h3>
          <p className={`transition-colors duration-200 ${
            darkMode ? 'text-gray-400' : 'text-slate-600'
          }`}>
            No data available. Start making comparisons to see chart data.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold transition-colors duration-200 ${
          darkMode ? 'text-white' : 'text-slate-900'
        }`}>
          {title}
        </h3>
      </div>
      
      <div className="flex items-end flex-1 space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="w-full rounded-t transition-all duration-500 ease-out"
              style={{
                height: `${maxValue > 0 ? (item.value / maxValue) * 80 + 10 : 10}%`,
                backgroundColor: item.color,
                minHeight: '10%'
              }}
            ></div>
            <span className={`mt-2 text-xs font-medium transition-colors duration-200 ${
              darkMode ? 'text-gray-400' : 'text-slate-600'
            }`}>
              {item.value}{unit}
            </span>
            <span className={`text-xs transition-colors duration-200 ${
              darkMode ? 'text-gray-500' : 'text-slate-500'
            }`}>
              {item.name.replace('Comparison ', '')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}