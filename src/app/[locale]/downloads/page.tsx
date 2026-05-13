// Force dynamic rendering - no static generation for this page
export const dynamic = 'force-dynamic'
export const revalidate = 0

import DownloadsContent from './DownloadsContent'

export default function DownloadsPage() {
  return <DownloadsContent />
}
