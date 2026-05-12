import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Matcher für alle Seiten außer statische Dateien und API-Routen
  matcher: [
    // Root-Pfad
    '/',
    // Alle nicht-statischen Pfade
    '/:path((?!_next|api|static|.*\\.).*)',
  ],
};
