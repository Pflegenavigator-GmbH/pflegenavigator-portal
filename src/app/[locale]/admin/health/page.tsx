// Server Component - forces dynamic rendering
// This page requires runtime APIs and should not be statically generated
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Prevent static generation for this page
export function generateStaticParams() {
  return []
}

import { Suspense } from 'react'
import { Shield } from 'lucide-react'
import AdminHealthPageContent from './AdminHealthPageContent'

export default function AdminHealthPage() {
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
        </div>

        <Suspense fallback={<div className="p-6 bg-white rounded-lg shadow">Loading...</div>}>
          <AdminHealthPageContent />
        </Suspense>
      </div>
    </div>
  )
}
