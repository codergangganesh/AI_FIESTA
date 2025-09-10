'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Brain, MessageSquare, Clock, Settings, LogOut, Users, BarChart3 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Navigation() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const navItems = [
    { name: 'Chat', href: '/chat', icon: MessageSquare },
    { name: 'History', href: '/history', icon: Clock },
    { name: 'Models', href: '/model-showcase', icon: Brain },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/account-settings', icon: Settings },
  ]

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/')
  }

  return (
    <nav className="bg-white border-r border-gray-200 w-64 min-h-screen fixed left-0 top-0 z-40">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center space-x-3 p-6 border-b border-gray-200">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            AI Fiesta
          </span>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-6 border-t border-gray-200">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {user.email}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user.plan || 'Free Plan'}
                  </div>
                </div>
              </div>
              <button
                onClick={signOut}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg transition-all duration-200"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}