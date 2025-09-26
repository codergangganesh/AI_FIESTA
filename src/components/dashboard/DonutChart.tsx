'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { Eye, EyeOff } from 'lucide-react'

interface DonutChartProps {
  data: { name: string; value: number; color: string }[]
  title: string
  unit?: string
}

export default function DonutChart({ data, title, unit = '' }: DonutChartProps) {
  const { darkMode } = useDarkMode()
  const [displayedData, setDisplayedData] = useState<{ name: string; value: number; color: string }[]>([])
  const [showAll, setShowAll] = useState(false)
  
  useEffect(() => {
    // Show first 3 items by default, or all if there are 3 or fewer
    const defaultDisplayCount = Math.min(3, data.length)
    setDisplayedData(showAll ? data : data.slice(0, defaultDisplayCount))
  }, [data, showAll])
  
  // Calculate total value for percentages
  const total = displayedData.reduce((sum, item) => sum + item.value, 0)
  
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
  
  // Calculate angles for each segment
  let startAngle = 0
  const segments = displayedData.map(item => {
    const percentage = total > 0 ? Math.min(100, Math.max(0, (item.value / total) * 100)) : 0
    const angle = (percentage / 100) * 360
    const endAngle = startAngle + angle
    const result = {
      ...item,
      startAngle,
      endAngle,
      percentage
    }
    startAngle = endAngle
    return result
  })

  // Function to convert angle to coordinates
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }

  // Function to create SVG path for a segment
  const createSegmentPath = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle)
    const end = polarToCartesian(centerX, centerY, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
    
    return [
      "M", centerX, centerY,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ")
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
        
        {data.length > 3 && (
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
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative w-64 h-64">
          <svg width="100%" height="100%" viewBox="0 0 200 200">
            {segments.map((segment, index) => (
              <path
                key={index}
                d={createSegmentPath(100, 100, 80, segment.startAngle, segment.endAngle)}
                fill={segment.color}
                stroke={darkMode ? "#1f2937" : "#ffffff"}
                strokeWidth="2"
              />
            ))}
            <circle cx="100" cy="100" r="30" fill={darkMode ? "#1f2937" : "#ffffff"} />
            <text 
              x="100" 
              y="100" 
              textAnchor="middle" 
              dominantBaseline="middle" 
              className={`text-2xl font-bold ${darkMode ? 'fill-white' : 'fill-slate-900'}`}
            >
              {total.toFixed(1)}
              <tspan 
                x="100" 
                dy="1.2em" 
                className={`text-sm font-normal ${darkMode ? 'fill-gray-400' : 'fill-slate-500'}`}
              >
                {unit}
              </tspan>
            </text>
          </svg>
        </div>
        
        <div className="flex-1">
          <div className="space-y-3">
            {segments.map((segment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  ></div>
                  <span className={`text-sm font-medium transition-colors duration-200 ${
                    darkMode ? 'text-gray-300' : 'text-slate-700'
                  }`}>
                    {segment.name}
                  </span>
                </div>
                <span className={`text-sm font-bold transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {segment.value.toFixed(1)}{unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}