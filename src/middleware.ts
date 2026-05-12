import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Wir definieren die Middleware explizit
const intlMiddleware = createMiddleware(routing);

// Und exportieren sie als Default
export default function middleware(request: any) {
  return intlMiddleware(request);
}

export const config = {
  // Die "breite" Variante ist sicherer gegen Syntax-Fehler
  matcher: [
    // Match alle Pfade außer interne Next.js Dateien und statische Assets
    '/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|.*\\.svg).*)',
  ],
};
