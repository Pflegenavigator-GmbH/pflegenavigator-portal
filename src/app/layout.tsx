import type { Metadata, Viewport } from "next";
import { UmamiAnalytics } from "@/components/Analytics";

/**
 * ROOT LAYOUT - Production-Ready Nested Layout Pattern
 * 
 * Dies ist das EINZIGE Layout mit <html> und <body>.
 * [locale]/layout.tsx rendert nur den App-Chrome (Header/Footer).
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates#nesting-layouts
 */

export const metadata: Metadata = {
  title: "PflegeNavigator EU - Pflegegrad einfach berechnen",
  description: "15 Minuten. Von zu Hause. Kostenlos. Ihre Pflegegrad-Einschätzung mit sofortigem Ergebnis. In 35 Sprachen verfügbar.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f2744",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <UmamiAnalytics />
        <meta name="theme-color" content="#0066cc" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PflegeNav" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
