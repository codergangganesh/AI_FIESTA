'use client'

import { useState } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { Eye } from 'lucide-react'
import { formatNumber } from '@/utils/formatUtils'

interface SampleData {
  name: string
  value: number
  color: string
}

export default function SampleResponseTimeChart() {
  const { darkMode } = useDarkMode()
  const [showAll, setShowAll] = useState(false)
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)

  // Sample data to demonstrate what the chart would look like with actual data
  const sampleData: SampleData[] = [
    { name: 'LLaMA 3.3', value: 2.3, color: '#3B82F6' },
    { name: 'Qwen 2.5', value: 1.8, color: '#10B981' },
    { name: 'DeepSeek', value: 3.1, color: '#8B5CF6' },
    { name: 'GPT-5', value: 2.7, color: '#F59E0B' },
    { name: 'Claude 4 Sonnet', value: 2.1, color: '#EF4444' },
    { name: 'Gemini 2.5', value: 2.9, color: '#6B7280' },
    { name: 'Kimi 2', value: 3.5, color: '#EC4899' },
    { name: 'Shisa AI', value: 1.9, color: '#06B6D4' }
  ]

  const displayedData = showAll ? sampleData : sampleData.slice(0, 8)
  const maxValue = Math.max(...sampleData.map(d => d.value))

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

  const handleBarHover = (index: number) => {
    setHoveredBar(index)
  }

  const handleBarLeave = () => {
    setHoveredBar(null)
  }

  return (
    <div className={`rounded-2xl p-6 transition-colors duration-200 relative ${
      darkMode 
        ? 'bg-gray-800/60 border border-gray-700/50' 
        : 'bg-white/80 border border-slate-200/50'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-bold transition-colors duration-200 ${
          darkMode ? 'text-white' : 'text-slate-900'
        }`}>
          Response Time Comparison (Sample Data)
        </h3>
        
        {sampleData.length > 8 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="space-y-4 relative">
        {displayedData.map((item, index) => (
          <div 
            key={index} 
            className="space-y-2 relative"
            onMouseEnter={() => handleBarHover(index)}
            onMouseLeave={handleBarLeave}
          >
            <div className="flex justify-between items-center">
              <span className={`text-sm font-medium transition-colors duration-200 ${
                darkMode ? 'text-gray-300' : 'text-slate-700'
              }`}>
                {item.name}
              </span>
              <span className={`text-sm font-bold transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {formatNumber(item.value)}s
              </span>
            </div>
            <div className={`w-full rounded-full h-3 ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div 
                className="h-3 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${maxValue > 0 ? Math.min(100, Math.max(0, (item.value / maxValue) * 100)) : 0}%`,
                  backgroundColor: item.color
                }}
              ></div>
            </div>
            
            {/* Line graph that appears on hover */}
            {hoveredBar === index && (
              <div 
                className="absolute z-10"
                style={{
                  left: '50%',
                  top: '-120px',
                  transform: 'translateX(-50%)'
                }}
              >
                <div className={`p-3 rounded-lg shadow-lg ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className={`text-sm font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.name}: {formatNumber(item.value)}s
                    </span>
                  </div>
                  {/* Enhanced line visualization */}
                  <div className="w-48 h-20 relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0">
                      {[0, 1, 2, 3, 4].map(i => (
                        <div 
                          key={i}
                          className="absolute w-full h-px"
                          style={{ 
                            top: `${i * 25}%`,
                            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                          }}
                        ></div>
                      ))}
                    </div>
                    
                    {/* Line graph */}
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {(() => {
                        const trendData = generateTrendData(item.value);
                        const maxTrend = Math.max(...trendData);
                        const minTrend = Math.min(...trendData);
                        const range = maxTrend - minTrend || 1;
                        
                        // Generate points for the line
                        const points = trendData.map((value, i) => {
                          const x = (i / (trendData.length - 1)) * 100;
                          const y = 100 - ((value - minTrend) / range) * 100;
                          return `${x},${y}`;
                        }).join(' ');
                        
                        return (
                          <polyline
                            fill="none"
                            stroke={item.color}
                            strokeWidth="2"
                            points={points}
                          />
                        );
                      })()}
                    </svg>
                    
                    {/* Data points */}
                    <div className="absolute inset-0">
                      {generateTrendData(item.value).map((value, i) => {
                        const trendData = generateTrendData(item.value);
                        const maxTrend = Math.max(...trendData);
                        const minTrend = Math.min(...trendData);
                        const range = maxTrend - minTrend || 1;
                        
                        const x = (i / (trendData.length - 1)) * 100;
                        const y = 100 - ((value - minTrend) / range) * 100;
                        
                        return (
                          <div
                            key={i}
                            className="absolute w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: item.color,
                              left: `${x}%`,
                              top: `${y}%`,
                              transform: 'translate(-50%, -50%)'
                            }}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                  <div className={`text-xs mt-1 text-center ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Response time trend
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className={`mt-6 p-4 rounded-lg ${
        darkMode ? 'bg-gray-700/30' : 'bg-slate-50'
      }`}>
        <h4 className={`font-bold mb-2 ${
          darkMode ? 'text-white' : 'text-slate-900'
        }`}>
          How to see real data:
        </h4>
        <p className={`text-sm ${
          darkMode ? 'text-gray-300' : 'text-slate-600'
        }`}>
          To see actual response time data in this chart, you need to make model comparisons in the chat interface. 
          Each time you compare models, their response times will be recorded and displayed here.
        </p>
      </div>
    </div>
  )
}