'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { Shield, Lock, AlertTriangle } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import HealthMonitor to avoid SSR issues
const HealthMonitor = dynamic(
  () => import('@/components/HealthMonitor'),
  { ssr: false, loading: () => (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    </div>
  )}
)

// Simple admin authentication
export default function AdminHealthPageContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Only run on client
    setMounted(true)
    // Check if already authenticated in session
    const authStatus = sessionStorage.getItem('adminHealthAuth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin2024'
    
    if (password === adminPassword) {
      setIsAuthenticated(true)
      sessionStorage.setItem('adminHealthAuth', 'true')
      setError('')
    } else {
      setError('Invalid password')
    }
  }, [password])

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('adminHealthAuth')
    setPassword('')
  }, [])

  // Don't render anything during SSR - return minimal valid HTML
  if (!mounted) {
    return <div className="min-h-screen bg-gray-100" />
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-blue-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Admin Health Dashboard
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Restricted access - Admins only
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-center text-red-700">
              <AlertTriangle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter admin password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Access Dashboard
            </button>
          </form>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            <AlertTriangle className="w-4 h-4 inline mr-1" />
            This dashboard contains sensitive system information.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Shield className="w-8 h-8 mr-3 text-blue-500" />
              System Health Monitor
            </h1>
            <p className="text-gray-500 mt-1">
              Real-time monitoring of all system components
            </p>
          </div>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Logout
          </button>
        </div>

        <Suspense fallback={
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
              <span className="ml-2 text-gray-600">Loading health data...</span>
            </div>
          </div>
        }>
          <HealthMonitor />
        </Suspense>
      </div>
    </div>
  )
}
