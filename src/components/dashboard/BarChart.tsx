'use client'

import { useState, useEffect, useRef } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { Eye, EyeOff } from 'lucide-react'
import { formatNumber } from '@/utils/formatUtils'

interface BarChartData {
  name: string
  value: number
  color: string
}

interface GroupedBarChartData {
  name: string
  values: { value: number; color: string }[]
}

interface BarChartProps {
  data: BarChartData[] | GroupedBarChartData[]
  title: string
  unit?: string
  isLoading?: boolean
  grouped?: boolean
}

export default function BarChart({ data, title, unit = '', isLoading = false, grouped = false }: BarChartProps) {
  const { darkMode } = useDarkMode()
  const [maxValue, setMaxValue] = useState(0)
  const [displayedData, setDisplayedData] = useState<BarChartData[] | GroupedBarChartData[]>([])
  const [showAll, setShowAll] = useState(false)
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (data.length > 0) {
      let max = 0
      if (grouped) {
        // For grouped data, find max among all values
        const groupedData = data as GroupedBarChartData[]
        max = Math.max(...groupedData.flatMap(d => d.values.map(v => v.value)))
      } else {
        // For regular data, find max among all values
        const regularData = data as BarChartData[]
        max = Math.max(...regularData.map(d => d.value))
      }
      setMaxValue(max)
      
      // Show all items when "View All" is clicked, otherwise show first 3
      setDisplayedData(showAll ? data : data.slice(0, 3))
    }
  }, [data, showAll, grouped])

  const handleBarHover = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    setHoveredBar(index)
    
    if (chartRef.current) {
      const chartRect = chartRef.current.getBoundingClientRect()
      setTooltipPosition({
        x: event.clientX - chartRect.left,
        y: event.clientY - chartRect.top
      })
    }
  }

  const handleBarLeave = () => {
    setHoveredBar(null)
  }

  // Generate mock trend data for the line graph
  const generateTrendData = (value: number) => {
    // Create a simple trend based on the value
    const base = value;
    const trend = [
      base * 0.7,
      base * 0.85,
      base * 0.9,
      base,
      base * 0.95,
      base * 0.8
    ];
    return trend;
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
        
        <div className="flex items-center justify-center h-48">
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
    <div 
      ref={chartRef}
      className={`rounded-2xl p-6 transition-colors duration-200 relative ${
        darkMode 
          ? 'bg-gray-800/60 border border-gray-700/50' 
          : 'bg-white/80 border border-slate-200/50'
      }`}
    >
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
      
      <div className="space-y-4 relative">
        {displayedData.map((item, index) => (
          <div 
            key={index} 
            className="space-y-2 relative"
            onMouseEnter={(e) => handleBarHover(index, e)}
            onMouseLeave={handleBarLeave}
          >
            {grouped ? (
              // Render grouped bar chart
              (() => {
                const groupedItem = item as GroupedBarChartData
                return (
                  <>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium transition-colors duration-200 ${
                        darkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                        {groupedItem.name}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      {groupedItem.values.map((valueObj, valueIndex) => (
                        <div key={valueIndex} className="flex-1">
                          <div className={`w-full rounded-full h-3 ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-200'
                          }`}>
                            <div 
                              className="h-3 rounded-full transition-all duration-1000 ease-out"
                              style={{
                                width: `${maxValue > 0 ? Math.min(100, Math.max(0, (valueObj.value / maxValue) * 100)) : 0}%`,
                                backgroundColor: valueObj.color
                              }}
                            ></div>
                          </div>
                          <div className={`text-xs mt-1 text-center ${
                            darkMode ? 'text-gray-400' : 'text-slate-500'
                          }`}>
                            {formatNumber(valueObj.value)}{unit}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )
              })()
            ) : (
              // Render regular bar chart
              (() => {
                const regularItem = item as BarChartData
                return (
                  <>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium transition-colors duration-200 ${
                        darkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                        {regularItem.name}
                      </span>
                      <span className={`text-sm font-bold transition-colors duration-200 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {formatNumber(regularItem.value)}{unit}
                      </span>
                    </div>
                    <div className={`w-full rounded-full h-3 ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div 
                        className="h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${maxValue > 0 ? Math.min(100, Math.max(0, (regularItem.value / maxValue) * 100)) : 0}%`,
                          backgroundColor: regularItem.color
                        }}
                      ></div>
                    </div>
                  </>
                )
              })()
            )}
          </div>
        ))}
      </div>
    </div>
  )
}