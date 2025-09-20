'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'

interface TransparentBarChartData {
  name: string
  value: number
  color: string
}

interface TransparentBarChartProps {
  data: TransparentBarChartData[]
  title: string
  unit?: string
  isLoading?: boolean
}

export default function TransparentBarChart({ data, title, unit = '', isLoading = false }: TransparentBarChartProps) {
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
      <div className={`rounded-2xl p-6 transition-colors duration-200 flex flex-col items-center justify-center h-64 ${
        darkMode 
          ? 'bg-gray-800/60 border border-gray-700/50' 
          : 'bg-white/80 border border-slate-200/50'
      }`}>
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
    <div className={`rounded-2xl transition-colors duration-200 ${
      darkMode 
        ? 'bg-transparent border border-gray-700/50'  // Transparent background
        : 'bg-transparent border border-slate-200/50'  // Transparent background
    }`}>
      {title && (
        <h3 className={`text-xl font-bold mb-6 px-6 pt-6 transition-colors duration-200 ${
          darkMode ? 'text-white' : 'text-slate-900'
        }`}>
          {title}
        </h3>
      )}
      
      <div className="space-y-4 px-6 pb-6">
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
              darkMode ? 'bg-gray-700/30' : 'bg-gray-200/30'  // Semi-transparent background
            }`}>
              <div 
                className="h-3 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                  backgroundColor: item.color,
                  opacity: 0.7  // Transparent bar
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}