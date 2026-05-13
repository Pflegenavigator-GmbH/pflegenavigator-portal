// Force dynamic rendering - no static generation for this page
export const dynamic = 'force-dynamic'
export const revalidate = 0

import BriefeContent from './BriefeContent'

export default function BriefePage() {
  return <BriefeContent />
}
