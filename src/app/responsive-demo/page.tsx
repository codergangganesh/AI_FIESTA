'use client'

import { useState } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useResponsive, getTouchTarget, getResponsiveSpacing, Responsive } from '@/hooks/useResponsive'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import {
  Smartphone,
  Tablet,
  Monitor,
  Tv,
  Grid3X3,
  List,
  Eye,
  Settings,
  Zap,
  Heart,
  Star,
  TrendingUp,
  Users,
  BarChart3,
  Activity,
  CheckCircle
} from 'lucide-react'

export default function ResponsiveDemoPage() {
  const { darkMode } = useDarkMode()
  const { isMobile, isTablet, isDesktop, isLargeDesktop, width, height } = useResponsive()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const getDeviceType = () => {
    if (isMobile) return { icon: Smartphone, label: 'Mobile', color: 'text-green-500' }
    if (isTablet) return { icon: Tablet, label: 'Tablet', color: 'text-blue-500' }
    if (isDesktop) return { icon: Monitor, label: 'Desktop', color: 'text-purple-500' }
    return { icon: Tv, label: 'Large Desktop', color: 'text-yellow-500' }
  }

  const deviceInfo = getDeviceType()
  const DeviceIcon = deviceInfo.icon

  const sampleData = [
    { id: 1, title: 'Performance Analytics', value: '98.5%', trend: '+2.3%', icon: TrendingUp },
    { id: 2, title: 'Active Users', value: '2,847', trend: '+12.5%', icon: Users },
    { id: 3, title: 'API Requests', value: '45.2K', trend: '+8.1%', icon: BarChart3 },
    { id: 4, title: 'Response Time', value: '1.2s', trend: '-0.3s', icon: Activity },
    { id: 5, title: 'Success Rate', value: '99.9%', trend: '+0.1%', icon: CheckCircle },
    { id: 6, title: 'User Satisfaction', value: '4.8/5', trend: '+0.2', icon: Star }
  ]

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <AdvancedSidebar />
      
      <div className={`transition-all duration-300 ${
        isMobile ? 'ml-0' : 'ml-16 lg:ml-72'
      }`}>
        {/* Header */}
        <div className={`backdrop-blur-sm border-b transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-800/60 border-gray-700/30' 
            : 'bg-white/60 border-slate-200/30'
        }`}>
          <div className={getResponsiveSpacing('p-4', 'md:p-6', 'lg:p-6')}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div>
                <h1 className={`text-2xl md:text-3xl font-bold transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Responsive Design Demo
                </h1>
                <p className={`mt-1 text-sm md:text-base transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Showcasing adaptive layouts for all screen sizes
                </p>
              </div>
              
              {/* Device Info */}
              <div className={`flex items-center space-x-3 px-4 py-2 rounded-xl transition-colors duration-200 ${
                darkMode ? 'bg-gray-800/60' : 'bg-white/80'
              }`}>
                <DeviceIcon className={`w-5 h-5 ${deviceInfo.color}`} />
                <div>
                  <p className={`text-sm font-medium transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {deviceInfo.label}
                  </p>
                  <p className={`text-xs transition-colors duration-200 ${
                    darkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    {width} × {height}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={getResponsiveSpacing('p-4', 'md:p-6', 'lg:p-6')}>
          {/* Responsive Features Overview */}
          <div className={`grid gap-4 md:gap-6 mb-6 md:mb-8 ${
            isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-4'
          }`}>
            {[
              { 
                icon: Smartphone, 
                title: 'Mobile First', 
                desc: 'Optimized for touch and small screens',
                active: isMobile 
              },
              { 
                icon: Tablet, 
                title: 'Tablet Ready', 
                desc: 'Perfect balance for medium screens',
                active: isTablet 
              },
              { 
                icon: Monitor, 
                title: 'Desktop Power', 
                desc: 'Full featured desktop experience',
                active: isDesktop 
              },
              { 
                icon: Tv, 
                title: 'Large Display', 
                desc: 'Maximized for large monitors',
                active: isLargeDesktop 
              }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className={`${getResponsiveSpacing('p-4', 'md:p-5', 'lg:p-6')} rounded-xl md:rounded-2xl transition-all duration-300 border-2 ${
                    feature.active
                      ? darkMode
                        ? 'bg-blue-900/30 border-blue-500 shadow-lg'
                        : 'bg-blue-50 border-blue-500 shadow-lg'
                      : darkMode
                        ? 'bg-gray-800/60 border-gray-700/50'
                        : 'bg-white/80 border-slate-200/50'
                  }`}
                >
                  <Icon className={`w-6 h-6 md:w-8 md:h-8 mb-3 ${
                    feature.active 
                      ? darkMode ? 'text-blue-400' : 'text-blue-600'
                      : darkMode ? 'text-gray-400' : 'text-slate-600'
                  }`} />
                  <h3 className={`font-bold mb-2 text-sm md:text-base transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-xs md:text-sm transition-colors duration-200 ${
                    darkMode ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    {feature.desc}
                  </p>
                  {feature.active && (
                    <div className="mt-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        darkMode 
                          ? 'bg-green-900/30 text-green-400' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* View Mode Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 mb-6">
            <h2 className={`text-lg md:text-xl font-bold transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Adaptive Data Display
            </h2>
            
            <div className={`flex items-center rounded-lg border transition-colors duration-200 ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
            }`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`${getTouchTarget('medium')} flex items-center space-x-2 px-4 py-2 rounded-l-lg transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="text-sm font-medium">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`${getTouchTarget('medium')} flex items-center space-x-2 px-4 py-2 rounded-r-lg transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="text-sm font-medium">List</span>
              </button>
            </div>
          </div>

          {/* Responsive Data Grid */}
          <Responsive
            mobile={
              <div className="space-y-4">
                {sampleData.map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl transition-colors duration-200 ${
                        darkMode 
                          ? 'bg-gray-800/60 border border-gray-700/50' 
                          : 'bg-white/80 border border-slate-200/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            darkMode ? 'bg-blue-600/20' : 'bg-blue-100'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              darkMode ? 'text-blue-400' : 'text-blue-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className={`font-semibold transition-colors duration-200 ${
                              darkMode ? 'text-white' : 'text-slate-900'
                            }`}>
                              {item.title}
                            </h3>
                            <p className={`text-sm transition-colors duration-200 ${
                              darkMode ? 'text-gray-400' : 'text-slate-600'
                            }`}>
                              {item.trend}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-xl font-bold transition-colors duration-200 ${
                            darkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            {item.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            }
            tablet={
              viewMode === 'grid' ? (
                <div className="grid grid-cols-2 gap-4">
                  {sampleData.map((item) => {
                    const Icon = item.icon
                    return (
                      <div
                        key={item.id}
                        className={`p-5 rounded-xl transition-colors duration-200 ${
                          darkMode 
                            ? 'bg-gray-800/60 border border-gray-700/50' 
                            : 'bg-white/80 border border-slate-200/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <Icon className={`w-6 h-6 ${
                            darkMode ? 'text-blue-400' : 'text-blue-600'
                          }`} />
                          <span className={`text-sm font-medium transition-colors duration-200 ${
                            item.trend.startsWith('+') 
                              ? darkMode ? 'text-green-400' : 'text-green-600'
                              : darkMode ? 'text-red-400' : 'text-red-600'
                          }`}>
                            {item.trend}
                          </span>
                        </div>
                        <h3 className={`text-lg font-bold mb-1 transition-colors duration-200 ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {item.value}
                        </h3>
                        <p className={`text-sm transition-colors duration-200 ${
                          darkMode ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          {item.title}
                        </p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-3">
                  {sampleData.map((item) => {
                    const Icon = item.icon
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-4 rounded-xl transition-colors duration-200 ${
                          darkMode 
                            ? 'bg-gray-800/60 border border-gray-700/50' 
                            : 'bg-white/80 border border-slate-200/50'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <Icon className={`w-5 h-5 ${
                            darkMode ? 'text-blue-400' : 'text-blue-600'
                          }`} />
                          <span className={`font-medium transition-colors duration-200 ${
                            darkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            {item.title}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`text-lg font-bold transition-colors duration-200 ${
                            darkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            {item.value}
                          </span>
                          <span className={`text-sm font-medium transition-colors duration-200 ${
                            item.trend.startsWith('+') 
                              ? darkMode ? 'text-green-400' : 'text-green-600'
                              : darkMode ? 'text-red-400' : 'text-red-600'
                          }`}>
                            {item.trend}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            }
            desktop={
              viewMode === 'grid' ? (
                <div className="grid grid-cols-3 gap-6">
                  {sampleData.map((item) => {
                    const Icon = item.icon
                    return (
                      <div
                        key={item.id}
                        className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                          darkMode 
                            ? 'bg-gray-800/60 border border-gray-700/50' 
                            : 'bg-white/80 border border-slate-200/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-xl ${
                            darkMode ? 'bg-blue-600/20' : 'bg-blue-100'
                          }`}>
                            <Icon className={`w-6 h-6 ${
                              darkMode ? 'text-blue-400' : 'text-blue-600'
                            }`} />
                          </div>
                          <span className={`text-sm font-medium transition-colors duration-200 ${
                            item.trend.startsWith('+') 
                              ? darkMode ? 'text-green-400' : 'text-green-600'
                              : darkMode ? 'text-red-400' : 'text-red-600'
                          }`}>
                            {item.trend}
                          </span>
                        </div>
                        <h3 className={`text-2xl font-bold mb-2 transition-colors duration-200 ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {item.value}
                        </h3>
                        <p className={`transition-colors duration-200 ${
                          darkMode ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          {item.title}
                        </p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className={`rounded-2xl overflow-hidden transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gray-800/60 border border-gray-700/50' 
                    : 'bg-white/80 border border-slate-200/50'
                }`}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={darkMode ? 'bg-gray-700/50' : 'bg-slate-50'}>
                        <tr>
                          <th className={`text-left px-6 py-4 font-semibold transition-colors duration-200 ${
                            darkMode ? 'text-gray-300' : 'text-slate-700'
                          }`}>Metric</th>
                          <th className={`text-left px-6 py-4 font-semibold transition-colors duration-200 ${
                            darkMode ? 'text-gray-300' : 'text-slate-700'
                          }`}>Value</th>
                          <th className={`text-left px-6 py-4 font-semibold transition-colors duration-200 ${
                            darkMode ? 'text-gray-300' : 'text-slate-700'
                          }`}>Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sampleData.map((item) => {
                          const Icon = item.icon
                          return (
                            <tr key={item.id} className={`border-t transition-colors duration-200 ${
                              darkMode ? 'border-gray-700/50' : 'border-slate-200/50'
                            }`}>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <Icon className={`w-5 h-5 ${
                                    darkMode ? 'text-blue-400' : 'text-blue-600'
                                  }`} />
                                  <span className={`font-medium transition-colors duration-200 ${
                                    darkMode ? 'text-white' : 'text-slate-900'
                                  }`}>
                                    {item.title}
                                  </span>
                                </div>
                              </td>
                              <td className={`px-6 py-4 text-lg font-bold transition-colors duration-200 ${
                                darkMode ? 'text-white' : 'text-slate-900'
                              }`}>
                                {item.value}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`font-medium transition-colors duration-200 ${
                                  item.trend.startsWith('+') 
                                    ? darkMode ? 'text-green-400' : 'text-green-600'
                                    : darkMode ? 'text-red-400' : 'text-red-600'
                                }`}>
                                  {item.trend}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            }
          />

          {/* Touch Target Demo */}
          <div className={`mt-8 p-6 rounded-2xl transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-800/60 border border-gray-700/50' 
              : 'bg-white/80 border border-slate-200/50'
          }`}>
            <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Touch-Friendly Controls
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { size: 'small', label: 'Small (44px)', color: 'bg-green-600' },
                { size: 'medium', label: 'Medium (48px)', color: 'bg-blue-600' },
                { size: 'large', label: 'Large (56px)', color: 'bg-purple-600' }
              ].map((demo) => (
                <div key={demo.size} className="text-center">
                  <button
                    className={`${getTouchTarget(demo.size as any)} ${demo.color} text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 mb-2`}
                  >
                    <Heart className="w-5 h-5 mx-auto" />
                  </button>
                  <p className={`text-sm transition-colors duration-200 ${
                    darkMode ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    {demo.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}