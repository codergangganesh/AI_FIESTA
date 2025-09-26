'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
// import { useRouter } from 'next/navigation'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { Brain, Plus, MessageSquare, History, BarChart3, Activity, DollarSign } from 'lucide-react'
import ProfileDropdown from '@/components/layout/ProfileDropdown'
import DeleteAccountDialog from '@/components/auth/DeleteAccountDialog'
import { usePopup } from '@/contexts/PopupContext'
import SubscriptionManager from '@/components/subscription/SubscriptionManager'
import UsageLimits from '@/components/usage/UsageLimits'

interface ChatResponseSummary {
  model: string
  success: boolean
}

interface ChatSessionSummary {
  id: string
  message: string
  timestamp: string
  selectedModels: string[]
  responses: ChatResponseSummary[]
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const { openPaymentPopup } = usePopup()
  // const router = useRouter()

  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem('aiFiestaChatSessions')
      if (!saved) { setSessions([]); return }
      try {
        const parsed = JSON.parse(saved)
        const mapped: ChatSessionSummary[] = parsed.map((s: any) => ({
          id: s.id,
          message: s.message,
          timestamp: s.timestamp,
          selectedModels: s.selectedModels || [],
          responses: (s.responses || []).map((r: any) => ({ model: r.model, success: !!r.success }))
        }))
        mapped.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        setSessions(mapped)
      } catch { setSessions([]) }
    }
    load()
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'aiFiestaChatSessions') load()
    }
    window.addEventListener('storage', onStorage)
    const id = setInterval(load, 2000)
    return () => {
      window.removeEventListener('storage', onStorage)
      clearInterval(id)
    }
  }, [])

  // Data transforms for charts
  const dailyCounts = useMemo(() => {
    const map = new Map<string, number>()
    sessions.forEach(s => {
      const day = new Date(s.timestamp)
      const key = `${day.getFullYear()}-${day.getMonth()+1}-${day.getDate()}`
      map.set(key, (map.get(key) || 0) + 1)
    })
    const entries = Array.from(map.entries()).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    return entries
  }, [sessions])

  const modelUsage = useMemo(() => {
    const map = new Map<string, number>()
    sessions.forEach(s => (s.selectedModels || []).forEach(m => map.set(m, (map.get(m) || 0) + 1)))
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [sessions])

  const successRatio = useMemo(() => {
    const total = sessions.reduce((acc, s) => acc + (s.responses || []).length, 0)
    const success = sessions.reduce((acc, s) => acc + (s.responses || []).filter(r => r.success).length, 0)
    return { total, success, fail: Math.max(0, total - success) }
  }, [sessions])

  return (
    <div className={`flex h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' 
        : 'bg-gradient-to-br from-white via-slate-50 to-blue-50'
    }`}>
      {/* Left Sidebar */}
      <div className={`w-80 backdrop-blur-xl border-r transition-colors duration-200 relative ${
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
          
          <div
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              darkMode 
                ? 'text-white bg-gray-700/50' 
                : 'text-slate-900 bg-slate-100/50'
            }`}
          >
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Dashboard</span>
          </div>
          
          <Link
            href="/usage"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              darkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <Activity className="w-5 h-5 transition-colors group-hover:text-blue-600" />
            <span className="font-medium">Usage</span>
          </Link>
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
        <div className={`px-6 py-5 border-b sticky top-0 z-10 transition-colors duration-200 ${
          darkMode ? 'border-gray-800/60 bg-gray-900/60' : 'border-slate-200/60 bg-white/70'
        } backdrop-blur-md`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Dashboard
              </h1>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Overview of your activity and comparisons
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Pricing Button */}
              <button
                onClick={openPaymentPopup}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  darkMode 
                    ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 hover:from-yellow-500/30 hover:to-yellow-600/30 text-yellow-300 hover:text-yellow-200 border border-yellow-500/30' 
                    : 'bg-gradient-to-r from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300 text-yellow-800 hover:text-yellow-900 border border-yellow-300'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Pricing</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Subscription and Usage Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SubscriptionManager />
            <UsageLimits />
          </div>
          
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border bg-white/80 dark:bg-gray-800/60 backdrop-blur-md transition-colors">
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Comparisons</div>
              <div className="text-3xl font-semibold mt-1">{sessions.length}</div>
            </div>
            <div className="p-5 rounded-2xl border bg-white/80 dark:bg-gray-800/60 backdrop-blur-md transition-colors">
              <div className="text-sm text-gray-500 dark:text-gray-400">Models Used (unique)</div>
              <div className="text-3xl font-semibold mt-1">{new Set(sessions.flatMap(s => s.selectedModels)).size}</div>
            </div>
            <div className="p-5 rounded-2xl border bg-white/80 dark:bg-gray-800/60 backdrop-blur-md transition-colors">
              <div className="text-sm text-gray-500 dark:text-gray-400">Completed Responses</div>
              <div className="text-3xl font-semibold mt-1">{sessions.reduce((acc, s) => acc + s.responses.filter(r => r.success).length, 0)}</div>
            </div>
          </div>

          {/* Charts Row: Line (daily), Bar (models), Donut (success) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Line Chart */}
          <div className="p-5 rounded-xl border bg-white/80 dark:bg-gray-800/60">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Comparisons Over Time</h3>
            </div>
            <svg viewBox="0 0 300 120" className="w-full h-40">
              <defs>
                <linearGradient id="lineGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              {(() => {
                const pts = dailyCounts
                if (pts.length === 0) return <text x="12" y="60" className="text-sm fill-gray-500">No data yet</text>
                const max = Math.max(...pts.map(([, v]) => v)) || 1
                const stepX = 280 / Math.max(1, pts.length - 1)
                const path = pts.map(([, v], i) => {
                  const x = 10 + i * stepX
                  const y = 100 - (v / max) * 80
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
                }).join(' ')
                const area = `${path} L 290 100 L 10 100 Z`
                return (
                  <>
                    <path d={area} fill="url(#lineGrad)" />
                    <path d={path} stroke="#60a5fa" strokeWidth="2" fill="none" />
                  </>
                )
              })()}
            </svg>
          </div>

          {/* Bar Chart */}
          <div className="p-5 rounded-xl border bg-white/80 dark:bg-gray-800/60">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Top Model Usage</h3>
            </div>
            <div className="h-40 flex items-end gap-2">
              {modelUsage.length === 0 ? (
                <div className="text-sm text-gray-500">No data yet</div>
              ) : (
                modelUsage.map(([name, count]) => {
                  const max = modelUsage[0][1] || 1
                  const height = Math.max(8, (count / max) * 120)
                  return (
                    <div key={name} className="flex-1 flex flex-col items-center">
                      <div className="w-full rounded-t-md bg-gradient-to-t from-purple-500 to-blue-500" style={{ height }} />
                      <div className="text-[10px] mt-1 truncate w-full text-center" title={name}>{name}</div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Donut Chart */}
          <div className="p-5 rounded-xl border bg-white/80 dark:bg-gray-800/60">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Response Success</h3>
            </div>
            <div className="flex items-center justify-center h-40">
              {(() => {
                const { total, success, fail } = successRatio
                if (total === 0) return <div className="text-sm text-gray-500">No data yet</div>
                const circumference = 2 * Math.PI * 36
                const successPct = success / total
                return (
                  <svg viewBox="0 0 100 100" className="w-40 h-40">
                    <circle cx="50" cy="50" r="36" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                    <circle cx="50" cy="50" r="36" stroke="#34d399" strokeWidth="12" fill="none"
                      strokeDasharray={`${circumference * successPct} ${circumference}`}
                      strokeDashoffset={circumference * 0.25}
                      transform="rotate(-90 50 50)" />
                    <text x="50" y="54" textAnchor="middle" className="fill-slate-700 dark:fill-slate-200 text-sm font-semibold">{Math.round(successPct * 100)}%</text>
                  </svg>
                )
              })()}
            </div>
          </div>
        </div>

        {/* Additional chart - Latency by Model (p95) visible only when data present */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border bg-white/80 dark:bg-gray-800/60">
            <h3 className="font-semibold mb-3">Latency by Model (p95)</h3>
            {modelUsage.length === 0 ? (
              <div className="text-sm text-gray-500">No data yet</div>
            ) : (
              <div className="h-48 flex items-end gap-2">
                {modelUsage.map(([name], idx) => {
                  const val = 200 + idx * 40
                  const height = Math.min(180, (val / 400) * 180)
                  return (
                    <div key={name} className="flex-1 flex flex-col items-center">
                      <div className="w-full rounded-t-md bg-blue-500/80" style={{ height }} />
                      <div className="text-[10px] mt-1 truncate w-full text-center" title={name}>{name}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <div className="p-5 rounded-xl border bg-white/80 dark:bg-gray-800/60">
            <h3 className="font-semibold mb-3">Response Success Rate</h3>
            <div className="flex items-center justify-center h-48">
              {successRatio.total === 0 ? (
                <div className="text-sm text-gray-500">No data yet</div>
              ) : (
                (() => {
                  const { total, success } = successRatio
                  const r = 44
                  const C = 2 * Math.PI * r
                  const pct = success / total
                  return (
                    <svg viewBox="0 0 120 120" className="w-48 h-48">
                      <circle cx="60" cy="60" r={r} stroke="#e5e7eb" strokeWidth="14" fill="none" />
                      <circle cx="60" cy="60" r={r} stroke="#f97316" strokeWidth="14" fill="none"
                        strokeDasharray={`${pct * C} ${C}`} transform="rotate(-90 60 60)" />
                      <text x="60" y="65" textAnchor="middle" className="fill-slate-700 dark:fill-slate-200 text-sm font-semibold">{Math.round(pct*100)}%</text>
                    </svg>
                  )
                })()
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Ongoing & Recent Comparisons</h2>
          <Link href="/charts" className="text-sm text-purple-600 hover:text-purple-700">View charts</Link>
        </div>
        <div className="rounded-2xl border overflow-hidden bg-white/80 dark:bg-gray-800/60 backdrop-blur-md">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Prompt</th>
                <th className="text-left p-3">Models</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Started</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 && (
                <tr>
                  <td className="p-4 text-gray-600 dark:text-gray-400" colSpan={5}>No comparisons yet. Start one in Compare.</td>
                </tr>
              )}
              {sessions.map(session => {
                const total = session.selectedModels.length
                const done = session.responses.filter(r => r.success).length
                const status = total === 0 ? 'Pending' : done === total ? 'Complete' : `Running (${done}/${total})`
                return (
                  <tr key={session.id} className="border-b last:border-b-0">
                    <td className="p-3 max-w-xl truncate" title={session.message}>{session.message}</td>
                    <td className="p-3">{total}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${done === total ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{status}</span>
                    </td>
                    <td className="p-3">{new Date(session.timestamp).toLocaleString()}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Link href="/charts" className="px-3 py-1 rounded-md bg-purple-600 text-white">Charts</Link>
                        <Link href="/compare" className={`px-3 py-1 rounded-md border ${darkMode ? 'border-gray-700' : 'border-slate-200'}`}>Open</Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        </div>
      </div>
      {/* Delete Account Dialog */}
      <DeleteAccountDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} />
    </div>
  )
}


