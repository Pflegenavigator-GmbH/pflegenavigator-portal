import type { Metadata, Viewport } from "next";

/**
 * ROOT LAYOUT - Minimal & Production-Ready
 * 
 * Regel: Nur EIN echtes Root Layout mit <html> + <body>
 * Alles andere kommt in [locale]/layout.tsx
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/layout
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
      <body>{children}</body>
    </html>
  );
}
