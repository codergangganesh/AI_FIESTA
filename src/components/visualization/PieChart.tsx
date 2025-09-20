'use client'

import { useDarkMode } from '@/contexts/DarkModeContext'

interface PieChartData {
  name: string
  value: number
  color: string
}

interface PieChartProps {
  data: PieChartData[]
  title: string
}

export default function PieChart({ data, title }: PieChartProps) {
  const { darkMode } = useDarkMode()
  
  // Calculate total value for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  // Calculate angles for each segment
  let startAngle = 0
  const segments = data.map(item => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0
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
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 h-[calc(100%-3rem)]">
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
            {/* Center text showing total */}
            <text 
              x="100" 
              y="100" 
              textAnchor="middle" 
              dy=".3em" 
              className={`text-lg font-bold ${darkMode ? 'fill-white' : 'fill-slate-900'}`}
            >
              {total > 0 ? Math.round(total) : 0}
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
                <div className="text-right">
                  <span className={`text-sm font-bold transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {segment.value}
                  </span>
                  <span className={`text-xs block transition-colors duration-200 ${
                    darkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    {segment.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}