// Force dynamic rendering - no static generation for this page
export const dynamic = 'force-dynamic'
export const revalidate = 0

import DatenLoeschenContent from './DatenLoeschenContent'

export default function DatenLoeschenPage() {
  return <DatenLoeschenContent />
}
