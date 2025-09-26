'use client'

import { useDarkMode } from '@/contexts/DarkModeContext'

interface ResponseTimeChartProps {
  responseTime: number
  title: string
}

export default function ResponseTimeChart({ responseTime, title }: ResponseTimeChartProps) {
  const { darkMode } = useDarkMode()
  
  // Determine color based on response time
  const getColor = () => {
    if (responseTime <= 1) return 'text-green-500'
    if (responseTime <= 3) return 'text-yellow-500'
    return 'text-red-500'
  }
  
  const getBgColor = () => {
    if (responseTime <= 1) return 'bg-green-500'
    if (responseTime <= 3) return 'bg-yellow-500'
    return 'bg-red-500'
  }
  
  const getBgColorLight = () => {
    if (responseTime <= 1) return 'bg-green-100 dark:bg-green-900/30'
    if (responseTime <= 3) return 'bg-yellow-100 dark:bg-yellow-900/30'
    return 'bg-red-100 dark:bg-red-900/30'
  }

  // Determine performance label
  const getPerformanceLabel = () => {
    if (responseTime <= 1) return 'Excellent'
    if (responseTime <= 3) return 'Good'
    return 'Needs Improvement'
  }

  return (
    <div className={`rounded-2xl p-6 transition-colors duration-200 h-full ${
      darkMode 
        ? 'bg-gray-800/60 border border-gray-700/50' 
        : 'bg-white/80 border border-slate-200/50'
    }`}>
      <h3 className={`text-xl font-bold mb-6 transition-colors duration-200 ${
        darkMode ? 'text-white' : 'text-slate-900'
      }`}>
        {title}
      </h3>
      
      <div className="flex flex-col items-center justify-center py-4 h-[calc(100%-3rem)]">
        <div className={`relative w-32 h-32 rounded-full flex items-center justify-center ${getBgColorLight()}`}>
          <div className={`absolute inset-4 rounded-full flex items-center justify-center ${getBgColorLight()}`}>
            <div className={`absolute inset-4 rounded-full flex items-center justify-center ${getBgColorLight()}`}>
              <span className={`text-3xl font-bold ${getColor()}`}>
                {responseTime.toFixed(2)}s
              </span>
            </div>
          </div>
          
          {/* Animated ring */}
          <div className={`absolute inset-0 rounded-full border-4 ${getBgColor()} opacity-20 animate-ping`}></div>
        </div>
        
        <div className="mt-6 text-center">
          <p className={`text-lg font-semibold ${getColor()}`}>
            {getPerformanceLabel()}
          </p>
          <p className={`text-sm mt-2 transition-colors duration-200 ${
            darkMode ? 'text-gray-400' : 'text-slate-600'
          }`}>
            Time taken for the last model comparison
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>Fast (&lt;1s)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>Good (1-3s)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>Slow (&gt;3s)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}