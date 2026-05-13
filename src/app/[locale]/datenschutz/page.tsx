// Force dynamic rendering - no static generation for this page
export const dynamic = 'force-dynamic'
export const revalidate = 0

import DatenschutzContent from './DatenschutzContent'

export default function DatenschutzPage() {
  return <DatenschutzContent />
}
