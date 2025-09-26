'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'

interface StorageLineChartDataPoint {
  period: string
  value: number
}

interface StorageLineChartProps {
  data: StorageLineChartDataPoint[]
  title: string
}

export default function StorageLineChart({ data, title }: StorageLineChartProps) {
  const { darkMode } = useDarkMode()
  const [maxValue, setMaxValue] = useState(0)
  const [minValue, setMinValue] = useState(0)

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map(point => point.value)
      const max = Math.max(...values)
      const min = Math.min(...values)
      // Add some padding to the scale
      const range = max - min
      setMaxValue(max + range * 0.1)
      setMinValue(Math.max(0, min - range * 0.1))
    }
  }, [data])

  const calculateCoordinates = (value: number, index: number, maxValue: number, minValue: number, dataLength: number) => {
    const x = (index / (dataLength - 1)) * 100
    const range = maxValue - minValue
    const y = range > 0 ? 100 - ((value - minValue) / range) * 100 : 50
    return { x, y }
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
            No data available.
          </p>
        </div>
      </div>
    )
  }

  // Create path for the line
  let pathData = ""
  const points: { x: number; y: number }[] = []
  
  data.forEach((point, index) => {
    const coords = calculateCoordinates(point.value, index, maxValue, minValue, data.length)
    points.push(coords)
    
    if (index === 0) {
      pathData += `M ${coords.x} ${coords.y} `
    } else {
      pathData += `L ${coords.x} ${coords.y} `
    }
  })

  return (
    <div className="flex flex-col h-full">
      {/* Chart area */}
      <div className="relative flex-1">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`w-full h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
            ></div>
          ))}
        </div>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between pb-2 pr-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <span 
              key={i} 
              className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}
            >
              {maxValue > 0 ? (minValue + (maxValue - minValue) * (1 - i/4)).toFixed(2) : 0}
            </span>
          ))}
        </div>
        
        {/* Chart content */}
        <div className="absolute inset-0 pl-8 pb-8">
          <div className="relative w-full h-full">
            {/* Area fill with gradient */}
            <div className="absolute inset-0">
              <svg width="100%" height="100%" className="overflow-visible">
                <defs>
                  <linearGradient id="storageGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                {points.length > 0 && (
                  <>
                    <path
                      d={`${pathData} L 100 100 L 0 100 Z`}
                      fill="url(#storageGradient)"
                    />
                  </>
                )}
              </svg>
            </div>
            
            {/* Data line */}
            <div className="absolute inset-0">
              <svg width="100%" height="100%" className="overflow-visible">
                <path
                  d={pathData}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Data points */}
                {points.map((point, index) => (
                  <g key={index}>
                    <circle
                      cx={`${point.x}%`}
                      cy={`${point.y}%`}
                      r="6"
                      fill="#10B981"
                      stroke={darkMode ? "#1f2937" : "#ffffff"}
                      strokeWidth="2"
                    />
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2 px-8">
        {data.map((point, index) => (
          <span 
            key={index} 
            className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}
          >
            {point.period}
          </span>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className={`text-sm transition-colors duration-200 ${
          darkMode ? 'text-gray-300' : 'text-slate-600'
        }`}>
          Storage Used (GB)
        </span>
      </div>
    </div>
  )
}