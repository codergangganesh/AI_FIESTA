'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { Eye } from 'lucide-react'

interface ApiCallHistoryData {
  period: string
  value: number
  timestamp?: string
}

interface ApiCallHistoryChartProps {
  data: ApiCallHistoryData[]
  title: string
  unit?: string
  isLoading?: boolean
  onViewAll?: (data: ApiCallHistoryData[], unit: string) => void
}

export default function ApiCallHistoryChart({ data, title, unit = '', isLoading = false, onViewAll }: ApiCallHistoryChartProps) {
  const { darkMode } = useDarkMode()
  const [showAll, setShowAll] = useState(false)
  const [displayedData, setDisplayedData] = useState<any[]>([])
  const [maxValue, setMaxValue] = useState(0)
  // Add state for tooltip
  const [tooltip, setTooltip] = useState<{visible: boolean, x: number, y: number, data: ApiCallHistoryData | null}>({
    visible: false,
    x: 0,
    y: 0,
    data: null
  })

  // Process data for visualization
  useEffect(() => {
    if (data && data.length > 0) {
      // Transform data for the chart
      const transformedData = data.map((item, index) => {
        const period = item.period || `Period ${index + 1}`;
        const value = item.value || 0;
        
        return {
          ...item,
          period,
          value,
          name: period.replace('Comparison ', ''),
        };
      });
      
      // Order data to show most recent at the top
      const orderedData = [...transformedData].sort((a, b) => {
        // If data has timestamps, sort by those (most recent first)
        if (a.timestamp && b.timestamp) {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        }
        
        // Otherwise, sort by period name if it contains numbers
        const aNum = a.period?.match(/\d+/)?.[0] || 0
        const bNum = b.period?.match(/\d+/)?.[0] || 0
        return parseInt(bNum as string) - parseInt(aNum as string)
      });
      
      // Set displayed data based on showAll state
      const finalData = showAll ? orderedData : orderedData.slice(0, 8)
      setDisplayedData(finalData)
      
      // Calculate max value for scaling bars
      const max = Math.max(...finalData.map(item => item.value), 0)
      setMaxValue(max || 1) // Ensure we don't divide by zero
    } else {
      setDisplayedData([])
      setMaxValue(0)
    }
  }, [data, showAll])

  // Handle mouse enter on bar
  const handleBarMouseEnter = (e: React.MouseEvent, item: ApiCallHistoryData) => {
    setTooltip({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      data: item
    })
  }

  // Handle mouse move on bar
  const handleBarMouseMove = (e: React.MouseEvent) => {
    setTooltip(prev => ({
      ...prev,
      x: e.clientX,
      y: e.clientY
    }))
  }

  // Handle mouse leave on bar
  const handleBarMouseLeave = () => {
    setTooltip({
      visible: false,
      x: 0,
      y: 0,
      data: null
    })
  }

  if (isLoading) {
    return (
      <div className={`rounded-2xl p-6 transition-colors duration-200 h-full flex flex-col ${
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
        
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse w-full">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="grid grid-cols-5 gap-4 mt-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If we have data but it's empty, show empty state
  if (data.length === 0) {
    return (
      <div className={`rounded-2xl p-6 transition-colors duration-200 flex flex-col items-center justify-center h-full ${
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
            {title || 'API Calls History'}
          </h3>
          <p className={`transition-colors duration-200 ${
            darkMode ? 'text-gray-400' : 'text-slate-600'
          }`}>
            No data available. Start making API calls to see chart data.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl p-6 transition-colors duration-200 h-full flex flex-col ${
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
        {data.length > 8 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            title={showAll ? "Show less" : "View all"}
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Modern Bar Chart Visualization */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        <div className="flex-1 flex items-end justify-between space-x-2 md:space-x-4 pt-4">
          {displayedData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1 h-full">
              {/* Bar */}
              <div className="flex flex-col items-center w-full flex-1">
                <div className="flex items-end justify-center w-full h-full">
                  <div 
                    className="w-3/4 rounded-t-md transition-all duration-500 ease-out hover:opacity-90 cursor-pointer"
                    style={{ 
                      height: `${(item.value / maxValue) * 100}%`,
                      backgroundColor: darkMode ? '#60A5FA' : '#3B82F6',
                      minHeight: '4px'
                    }}
                    onMouseEnter={(e) => handleBarMouseEnter(e, item)}
                    onMouseMove={handleBarMouseMove}
                    onMouseLeave={handleBarMouseLeave}
                  ></div>
                </div>
              </div>
              
              {/* Label */}
              <div className="mt-2 text-center">
                <div className={`text-xs font-medium truncate w-full ${
                  darkMode ? 'text-gray-300' : 'text-slate-700'
                }`}>
                  {item.name}
                </div>
                <div className={`text-xs font-bold mt-1 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {item.value}{unit}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* X-axis line */}
        <div className={`mt-2 border-t ${darkMode ? 'border-gray-700' : 'border-slate-200'}`}></div>
      </div>
      
      {/* Simplified summary below the chart */}
      <div className="mt-6">
        <div className="flex justify-between text-sm">
          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
            Recent API Usage
          </span>
          <span className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {displayedData.reduce((sum, item) => sum + item.value, 0)}{unit} total
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${Math.min(100, (displayedData.reduce((sum, item) => sum + item.value, 0) / (data.reduce((sum, item) => sum + item.value, 0) || 100)) * 100)}%` 
            }}
          ></div>
        </div>
      </div>
      
      {data.length > 8 && (
        <div className="text-center pt-4">
          <button
            onClick={() => onViewAll && onViewAll(data, unit)}
            className={`text-sm font-medium transition-colors duration-200 ${
              darkMode 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            View all {data.length} records
          </button>
        </div>
      )}
      
      {/* Tooltip */}
      {tooltip.visible && tooltip.data && (
        <div 
          className={`absolute p-3 rounded-lg shadow-lg pointer-events-none ${
            darkMode 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-slate-200'
          }`}
          style={{
            left: `${tooltip.x + 10}px`,
            top: `${tooltip.y - 10}px`,
            transform: 'translateY(-100%)',
            zIndex: 50
          }}
        >
          <div className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {tooltip.data.period}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>
            {tooltip.data.value}{unit}
          </div>
        </div>
      )}
    </div>
  )
}