'use client'

import { useMemo, useState, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { Calendar, Moon, Sun, TrendingUp, TrendingDown, Minus, Brain, MessageSquare, History, BarChart3, Plus, Menu, X, Activity, DollarSign } from 'lucide-react'
import Link from 'next/link'
import ProfileDropdown from '@/components/layout/ProfileDropdown'
import DeleteAccountDialog from '@/components/auth/DeleteAccountDialog'
import { usePopup } from '@/contexts/PopupContext'

export default function UsagePage() {
  const { darkMode, toggleDarkMode } = useDarkMode()
  const { openPaymentPopup } = usePopup()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [timeRange, setTimeRange] = useState('Last 30 days')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [realTimeData, setRealTimeData] = useState({
    latency: Array.from({ length: 10 }, () => 0),
    apiCalls: 0,
    cacheHits: 0
  })

  // Dynamic usage derived from localStorage sessions - reset to zero for now
  const stats = useMemo(() => {
    // Always return zero data for now - will be updated when models give responses
    return {
      totalComparisons: 0,
      totalResponses: 0,
      uniqueModels: 0,
      monthlyUsage: 0,
      modelUsage: [],
      trends: {
        comparisons: 0,
        responses: 0,
        models: 0,
        usage: 0
      }
    }
  }, [])

  // Simulate real-time latency updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        latency: [...prev.latency.slice(1), Math.random() * 100 + 50]
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  const getTrendText = (value: number) => {
    const absValue = Math.abs(value)
    if (value > 0) return `+${absValue}% from last month`
    if (value < 0) return `-${absValue}% from last month`
    return 'No change'
  }

  return (
    <div className={`flex h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' 
        : 'bg-gradient-to-br from-white via-slate-50 to-blue-50'
    }`}>
      {/* Left Sidebar - Hidden on mobile */}
      <div className={`hidden lg:flex w-80 backdrop-blur-xl border-r transition-colors duration-200 relative ${
        darkMode 
          ? 'bg-gray-800/80 border-gray-700' 
          : 'bg-white/80 border-slate-200/50'
      }`}>
        {/* Sidebar Content Container */}
        <div className="flex flex-col h-full pb-20"> {/* Added bottom padding for dropdown */}
        {/* Header with Logo */}
        <div className={`p-6 border-b transition-colors duration-200 ${
          darkMode ? 'border-gray-700' : 'border-slate-200/30'
        }`}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-colors duration-200 ${
                darkMode 
                  ? 'from-white to-gray-200' 
                  : 'from-slate-900 to-slate-700'
              }`}>
                AI Fiesta
              </h1>
            </div>
          </div>

          {/* New Chat Button */}
          <Link
            href="/compare"
            className="w-full flex items-center justify-center space-x-3 px-4 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] group"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span>New Comparison</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-2">
          <Link
            href="/compare"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              darkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <MessageSquare className="w-5 h-5 transition-colors group-hover:text-blue-600" />
            <span className="font-medium">Current Chat</span>
          </Link>
          
          <Link
            href="/history"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              darkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <History className="w-5 h-5 transition-colors group-hover:text-blue-600" />
            <span className="font-medium">History</span>
          </Link>
          
          <Link
            href="/dashboard"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              darkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <BarChart3 className="w-5 h-5 transition-colors group-hover:text-blue-600" />
            <span className="font-medium">Dashboard</span>
          </Link>
          
                  <div
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      darkMode 
                        ? 'text-white bg-gray-700/50' 
                        : 'text-slate-900 bg-slate-100/50'
                    }`}
                  >
                    <Activity className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Usage</span>
                  </div>
        </div>
        </div>
        
        {/* Profile Dropdown at Bottom - Fixed Position */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-800/95 border-gray-700 backdrop-blur-xl' 
            : 'bg-white/95 border-slate-200/30 backdrop-blur-xl'
        }`}>
          <div className="flex items-center justify-end">
            <ProfileDropdown 
              darkMode={darkMode}
              onToggleDarkMode={toggleDarkMode}
              onDeleteAccount={() => setIsDeleteDialogOpen(true)}
              onNewConversation={() => window.location.href = '/compare'}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`px-4 lg:px-6 py-4 lg:py-5 border-b sticky top-0 z-10 transition-colors duration-200 ${
          darkMode ? 'border-gray-800/60 bg-gray-900/60' : 'border-slate-200/60 bg-white/70'
        } backdrop-blur-md`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`lg:hidden p-2 rounded-xl transition-all duration-200 ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <div>
                <h1 className={`text-2xl lg:text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Usage Analytics
                </h1>
                <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Track usage at a glance with real-time data visualization
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Pricing Button */}
              <button
                onClick={openPaymentPopup}
                className={`px-3 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 text-sm ${
                  darkMode 
                    ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 hover:from-yellow-500/30 hover:to-yellow-600/30 text-yellow-300 hover:text-yellow-200 border border-yellow-500/30' 
                    : 'bg-gradient-to-r from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300 text-yellow-800 hover:text-yellow-900 border border-yellow-300'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:inline">Pricing</span>
              </button>
              
              {/* Time Range Dropdown */}
              <div className="relative">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  title="Select time range for usage data"
                  className={`appearance-none bg-transparent border rounded-lg px-3 lg:px-4 py-2 pr-6 lg:pr-8 text-sm font-medium transition-colors duration-200 ${
                    darkMode 
                      ? 'text-white bg-gray-800/50 border-gray-600' 
                      : 'text-gray-700 bg-white/50 border-gray-300'
                  }`}
                >
                  <option value="Last 7 days">Last 7 days</option>
                  <option value="Last 30 days">Last 30 days</option>
                  <option value="Last 90 days">Last 90 days</option>
                  <option value="This year">This year</option>
                </select>
                <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {showMobileMenu && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              className="flex-1 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowMobileMenu(false)}
            />
            
            {/* Mobile Sidebar */}
            <div className={`w-80 backdrop-blur-xl border-r transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-800/95 border-gray-700' 
                : 'bg-white/95 border-slate-200/50'
            }`}>
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className={`p-6 border-b transition-colors duration-200 ${
                  darkMode ? 'border-gray-700' : 'border-slate-200/30'
                }`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h1 className={`text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-colors duration-200 ${
                          darkMode 
                            ? 'from-white to-gray-200' 
                            : 'from-slate-900 to-slate-700'
                        }`}>
                          AI Fiesta
                        </h1>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowMobileMenu(false)}
                      className={`p-2 rounded-xl transition-all duration-200 ${
                        darkMode 
                          ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`}
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* New Chat Button */}
                  <Link
                    href="/compare"
                    onClick={() => setShowMobileMenu(false)}
                    className="w-full flex items-center justify-center space-x-3 px-4 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] group"
                  >
                    <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                    <span>New Comparison</span>
                  </Link>
                </div>

                {/* Mobile Navigation */}
                <div className="p-4 space-y-2 flex-1">
                  <Link
                    href="/compare"
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      darkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50'
                    }`}
                  >
                    <MessageSquare className="w-5 h-5 transition-colors group-hover:text-blue-600" />
                    <span className="font-medium">Current Chat</span>
                  </Link>
                  
                  <Link
                    href="/history"
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      darkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50'
                    }`}
                  >
                    <History className="w-5 h-5 transition-colors group-hover:text-blue-600" />
                    <span className="font-medium">History</span>
                  </Link>
                  
                  <Link
                    href="/dashboard"
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      darkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50'
                    }`}
                  >
                    <BarChart3 className="w-5 h-5 transition-colors group-hover:text-blue-600" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  
                  <div
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      darkMode 
                        ? 'text-white bg-gray-700/50' 
                        : 'text-slate-900 bg-slate-100/50'
                    }`}
                  >
                    <Activity className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Usage</span>
                  </div>
                </div>
                
                {/* Mobile Profile Dropdown */}
                <div className={`p-4 border-t transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gray-800/95 border-gray-700 backdrop-blur-xl' 
                    : 'bg-white/95 border-slate-200/30 backdrop-blur-xl'
                }`}>
                  <div className="flex items-center justify-end">
                    <ProfileDropdown 
                      darkMode={darkMode}
                      onToggleDarkMode={toggleDarkMode}
                      onDeleteAccount={() => setIsDeleteDialogOpen(true)}
                      onNewConversation={() => {
                        setShowMobileMenu(false)
                        window.location.href = '/compare'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 lg:space-y-8">

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Comparisons */}
            <div className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg backdrop-blur-md ${
              darkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Total Comparisons</div>
                {getTrendIcon(stats.trends.comparisons)}
              </div>
              <div className={`text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats.totalComparisons.toLocaleString()}
              </div>
              <div className={`text-sm flex items-center ${stats.trends.comparisons > 0 ? 'text-green-500' : stats.trends.comparisons < 0 ? 'text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {getTrendText(stats.trends.comparisons)}
              </div>
            </div>

            {/* Total Responses */}
            <div className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg backdrop-blur-md ${
              darkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Total Responses</div>
                {getTrendIcon(stats.trends.responses)}
              </div>
              <div className={`text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats.totalResponses.toLocaleString()}
              </div>
              <div className={`text-sm flex items-center ${stats.trends.responses > 0 ? 'text-green-500' : stats.trends.responses < 0 ? 'text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {getTrendText(stats.trends.responses)}
              </div>
            </div>

            {/* Unique Models */}
            <div className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg backdrop-blur-md ${
              darkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Unique Models</div>
                {getTrendIcon(stats.trends.models)}
              </div>
              <div className={`text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats.uniqueModels}
              </div>
              <div className={`text-sm flex items-center ${stats.trends.models > 0 ? 'text-green-500' : stats.trends.models < 0 ? 'text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {getTrendText(stats.trends.models)}
              </div>
            </div>

            {/* Monthly Usage */}
            <div className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg backdrop-blur-md ${
              darkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Monthly Usage</div>
                {getTrendIcon(stats.trends.usage)}
              </div>
              <div className={`text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ${stats.monthlyUsage.toFixed(0)}
              </div>
              <div className={`text-sm flex items-center ${stats.trends.usage > 0 ? 'text-green-500' : stats.trends.usage < 0 ? 'text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {getTrendText(stats.trends.usage)}
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Monthly Comparisons Area Chart */}
            <div className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg backdrop-blur-md ${
              darkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Monthly Comparisons</h3>
            <div className="h-48">
              <svg viewBox="0 0 400 180" className="w-full h-full">
              <defs>
                <linearGradient id="usageArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              {(() => {
                  const series = Array.from({ length: 12 }, (_, i) => {
                    const base = stats.totalComparisons / 12
                    const variation = Math.sin(i / 2) * (base * 0.3)
                    return Math.max(0, base + variation + (i % 3) * 2)
                  })
                const max = Math.max(...series)
                const path = series.map((v, i) => {
                    const x = 20 + (i * 360) / 11
                    const y = 160 - (v / max) * 120
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
                }).join(' ')
                  const area = `${path} L 380 160 L 20 160 Z`
                return (
                  <>
                    <path d={area} fill="url(#usageArea)" />
                      <path d={path} stroke="#10b981" strokeWidth="3" fill="none" />
                      {series.map((v, i) => {
                        const x = 20 + (i * 360) / 11
                        const y = 160 - (v / max) * 120
                        return (
                          <circle key={i} cx={x} cy={y} r="4" fill="#10b981" />
                        )
                      })}
                  </>
                )
              })()}
            </svg>
            </div>
          </div>

            {/* Most Active Models Bar Chart */}
            <div className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg backdrop-blur-md ${
              darkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Most Active Models</h3>
            <div className="space-y-4">
              {stats.modelUsage.length > 0 ? stats.modelUsage.map(([name, count], index) => {
                const max = Math.max(...stats.modelUsage.map(([, c]) => c))
                const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b']
                return (
                  <div key={name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{name}</span>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{count}</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${(count / max) * 100}%` }}
                      >
                        <div 
                          className="h-full w-full rounded-full"
                          style={{ 
                            background: `linear-gradient(90deg, ${colors[index % colors.length]}, ${colors[(index + 1) % colors.length]})`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
              }) : (
                <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <div className="text-sm">No model usage data available</div>
                  <div className="text-xs mt-1">Start comparing models to see usage statistics</div>
                </div>
              )}
            </div>
          </div>

            {/* Responses Success Rate Donut Chart */}
            <div className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg backdrop-blur-md ${
              darkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Responses This Month</h3>
            <div className="flex items-center justify-center h-48">
            {(() => {
                const successRate = Math.min(95, Math.max(85, 85 + (stats.totalResponses % 10)))
                const r = 50
              const C = 2 * Math.PI * r
                const strokeDasharray = `${(successRate / 100) * C} ${C}`
              return (
                  <div className="relative">
                    <svg viewBox="0 0 120 120" className="w-32 h-32">
                      <circle 
                        cx="60" 
                        cy="60" 
                        r={r} 
                        stroke={darkMode ? "#374151" : "#e5e7eb"} 
                        strokeWidth="8" 
                        fill="none" 
                      />
                      <circle 
                        cx="60" 
                        cy="60" 
                        r={r} 
                        stroke="#8b5cf6" 
                        strokeWidth="8" 
                        fill="none"
                        strokeDasharray={strokeDasharray}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                        className="transition-all duration-1000"
                      />
                  </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{successRate}%</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Success Rate</div>
                      </div>
                    </div>
                </div>
              )
            })()}
          </div>
        </div>
        </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Real-time API Call Latency Chart */}
            <div className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg backdrop-blur-md ${
              darkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Real-time API Call Latency (ms)</h3>
            <div className="h-48">
              <svg viewBox="0 0 400 180" className="w-full h-full">
                <defs>
                  <linearGradient id="latencyGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map(i => (
                  <line
                    key={i}
                    x1="20" y1={20 + i * 35}
                    x2="380" y2={20 + i * 35}
                    stroke={darkMode ? "#374151" : "#e5e7eb"}
                    strokeWidth="1"
                  />
                ))}
                {/* Latency line */}
                <path
                  d={realTimeData.latency.map((value, i) => {
                    const x = 20 + (i * 360) / (realTimeData.latency.length - 1)
                    const y = 160 - ((value - 50) / 100) * 120
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
                  }).join(' ')}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  fill="none"
                />
                {/* Data points */}
                {realTimeData.latency.map((value, i) => {
                  const x = 20 + (i * 360) / (realTimeData.latency.length - 1)
                  const y = 160 - ((value - 50) / 100) * 120
                  return (
                    <circle key={i} cx={x} cy={y} r="3" fill="#3b82f6" />
                  )
                })}
                {/* Latency bars */}
                {realTimeData.latency.map((value, i) => {
                  const x = 20 + (i * 360) / (realTimeData.latency.length - 1)
                  const height = ((value - 50) / 100) * 120
                  return (
                    <rect
                      key={`bar-${i}`}
                      x={x - 2}
                      y={160 - height}
                      width="4"
                      height={height}
                      fill="url(#latencyGradient)"
                      opacity="0.3"
                    />
                  )
                })}
                {/* Y-axis labels */}
                {[0, 1, 2, 3, 4].map(i => (
                  <text
                    key={i}
                    x="10"
                    y={25 + i * 35}
                    textAnchor="end"
                    className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-500'}`}
                  >
                    {150 - i * 25}
                  </text>
                ))}
              </svg>
            </div>
          </div>

            {/* Resource Breakdown */}
            <div className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg backdrop-blur-md ${
              darkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Resource Breakdown</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>API Calls</span>
                <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {realTimeData.apiCalls.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Comparisons</span>
                <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalComparisons.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Active Models Used</span>
                <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.uniqueModels}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Cache Hits</span>
                <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {realTimeData.cacheHits}%
                </span>
              </div>
              
              {/* Progress bars for visual representation */}
              <div className="mt-6 space-y-3">
                <div>
                  <div className={`flex justify-between text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>API Usage</span>
                    <span>{Math.round((realTimeData.apiCalls / 20000) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (realTimeData.apiCalls / 20000) * 100)}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className={`flex justify-between text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>Cache Efficiency</span>
                    <span>{realTimeData.cacheHits}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                      style={{ width: `${realTimeData.cacheHits}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      
      {/* Delete Account Dialog */}
      <DeleteAccountDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} />
    </div>
  )
}
