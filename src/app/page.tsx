import { redirect } from 'next/navigation';
import { defaultLocale } from '@/lib/i18n/config';

// This page redirects to the default locale
// The middleware handles locale detection
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
