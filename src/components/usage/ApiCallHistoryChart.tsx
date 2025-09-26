'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface ChartDataPoint {
  period: string
  value: number
  timestamp?: string
}

interface ApiCallHistoryChartProps {
  data: ChartDataPoint[]
  title: string
  unit?: string
  isLoading?: boolean
  onViewAll?: (data: ChartDataPoint[], unit: string) => void
}

export default function ApiCallHistoryChart({ 
  data, 
  title, 
  unit = '', 
  isLoading = false,
  onViewAll 
}: ApiCallHistoryChartProps) {
  const { darkMode } = useDarkMode()
  const [maxValue, setMaxValue] = useState(0)

  useEffect(() => {
    if (data.length > 0) {
      const max = Math.max(...data.map(d => d.value))
      setMaxValue(max)
    }
  }, [data])

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-slate-200'
        }`}>
          <p className={`font-medium ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            {label}
          </p>
          <p className={darkMode ? 'text-blue-400' : 'text-blue-600'}>
            {payload[0].value}{unit}
          </p>
        </div>
      )
    }
    return null
  }

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
            No data available. Start making API calls to see chart data.
          </p>
        </div>
      </div>
    )
  }

  // For the bar chart, we'll use a blue color gradient
  const barColor = darkMode ? '#3B82F6' : '#2563EB'

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold transition-colors duration-200 ${
          darkMode ? 'text-white' : 'text-slate-900'
        }`}>
          {title}
        </h3>
        {onViewAll && (
          <button
            onClick={() => onViewAll(data, unit)}
            className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors duration-200 ${
              darkMode 
                ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30' 
                : 'text-blue-600 hover:text-blue-700 hover:bg-blue-100'
            }`}
          >
            View All
          </button>
        )}
      </div>
      
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={darkMode ? '#374151' : '#E5E7EB'} 
            />
            <XAxis 
              dataKey="period" 
              tick={{ 
                fill: darkMode ? '#9CA3AF' : '#6B7280',
                fontSize: 12
              }}
              tickLine={false}
            />
            <YAxis 
              tick={{ 
                fill: darkMode ? '#9CA3AF' : '#6B7280',
                fontSize: 12
              }}
              tickLine={false}
              axisLine={false}
              domain={[0, maxValue > 0 ? maxValue * 1.1 : 10]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" name="API Calls">
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={barColor}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <span className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-slate-600'
          }`}>
            Showing {data.length} data points
          </span>
          {onViewAll && (
            <button
              onClick={() => onViewAll(data, unit)}
              className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors duration-200 ${
                darkMode 
                  ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30' 
                  : 'text-blue-600 hover:text-blue-700 hover:bg-blue-100'
              }`}
            >
              View All Data
            </button>
          )}
        </div>
      </div>
    </div>
  )
}