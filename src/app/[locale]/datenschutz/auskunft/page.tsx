// Force dynamic rendering - no static generation for this page
export const dynamic = 'force-dynamic'
export const revalidate = 0

import DatenschutzAuskunftContent from './DatenschutzAuskunftContent'

export default function DatenschutzAuskunftPage() {
  return <DatenschutzAuskunftContent />
}
