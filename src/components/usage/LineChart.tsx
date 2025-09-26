'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'

interface LineChartDataPoint {
  period: string
  [key: string]: number | string
}

interface LineChartProps {
  data: LineChartDataPoint[]
  title: string
  metrics: string[]
  metricLabels: Record<string, string>
}

export default function LineChart({ data, title, metrics, metricLabels }: LineChartProps) {
  const { darkMode } = useDarkMode()
  const [maxValue, setMaxValue] = useState(0)
  const [minValue, setMinValue] = useState(0)

  useEffect(() => {
    if (data.length > 0 && metrics.length > 0) {
      const allValues = data.flatMap(point => 
        metrics.map(metric => typeof point[metric] === 'number' ? point[metric] as number : 0)
      )
      const max = Math.max(...allValues)
      const min = Math.min(...allValues)
      // Add some padding to the scale
      const range = max - min
      setMaxValue(max + range * 0.1)
      setMinValue(min - range * 0.1)
    }
  }, [data, metrics])

  const getColorForMetric = (metric: string, index: number): string => {
    const colors = [
      '#3B82F6', // blue
      '#10B981', // green
      '#8B5CF6', // purple
      '#F59E0B', // yellow
      '#EF4444', // red
      '#6B7280'  // gray
    ]
    return colors[index % colors.length]
  }

  if (data.length === 0 || metrics.length === 0) {
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
            No data available.
          </p>
        </div>
      </div>
    )
  }

  // Calculate coordinates for the line
  const calculateCoordinates = (value: number, index: number, maxValue: number, minValue: number, dataLength: number) => {
    const x = (index / (dataLength - 1)) * 100
    const range = maxValue - minValue
    const y = range > 0 ? 100 - ((value - minValue) / range) * 100 : 50
    return { x, y }
  }

  return (
    <div className={`rounded-2xl p-6 transition-colors duration-200 ${
      darkMode 
        ? 'bg-gray-800/60 border border-gray-700/50' 
        : 'bg-white/80 border border-slate-200/50'
    }`}>
      <h3 className={`text-xl font-bold mb-6 transition-colors duration-200 ${
        darkMode ? 'text-white' : 'text-slate-900'
      }`}>
        {title}
      </h3>
      
      {/* Chart area */}
      <div className="relative h-80">
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
              {maxValue > 0 ? (minValue + (maxValue - minValue) * (1 - i/4)).toFixed(1) : 0}
            </span>
          ))}
        </div>
        
        {/* Chart content */}
        <div className="absolute inset-0 pl-8 pb-8">
          <div className="relative w-full h-full">
            {/* Data lines with solid style (different from storage chart) */}
            {metrics.map((metric, metricIndex) => {
              // Create path for the line
              let pathData = ""
              const points: { x: number; y: number }[] = []
              
              data.forEach((point, index) => {
                const value = typeof point[metric] === 'number' ? point[metric] as number : 0
                const coords = calculateCoordinates(value, index, maxValue, minValue, data.length)
                points.push(coords)
                
                if (index === 0) {
                  pathData += `M ${coords.x} ${coords.y} `
                } else {
                  pathData += `L ${coords.x} ${coords.y} `
                }
              })
              
              return (
                <div key={metricIndex} className="absolute inset-0">
                  <svg width="100%" height="100%" className="overflow-visible">
                    {/* Line with solid style */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={getColorForMetric(metric, metricIndex)}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Data points */}
                    {points.map((point, index) => {
                      const value = typeof data[index][metric] === 'number' ? data[index][metric] as number : 0
                      return (
                        <g key={`${metricIndex}-${index}`}>
                          <circle
                            cx={`${point.x}%`}
                            cy={`${point.y}%`}
                            r="6"
                            fill={getColorForMetric(metric, metricIndex)}
                            stroke={darkMode ? "#1f2937" : "#ffffff"}
                            strokeWidth="2"
                          />
                          <text
                            x={`${point.x}%`}
                            y={`${point.y - 10}%`}
                            textAnchor="middle"
                            className={`text-xs font-bold ${
                              darkMode ? 'fill-white' : 'fill-slate-900'
                            }`}
                          >
                            {value.toFixed(1)}
                          </text>
                        </g>
                      )
                    })}
                  </svg>
                </div>
              )
            })}
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
      <div className="mt-6 flex flex-wrap gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-4 h-1 rounded-full"
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