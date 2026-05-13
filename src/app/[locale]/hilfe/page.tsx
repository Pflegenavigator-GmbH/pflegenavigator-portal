// Force dynamic rendering - no static generation for this page
export const dynamic = 'force-dynamic'
export const revalidate = 0

import pageContent from './pageContent'

export default function Page() {
  return <pageContent />
}
