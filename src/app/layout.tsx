import type { Metadata, Viewport } from "next";

// This is a root layout that redirects via middleware
// The actual locale layout is in [locale]/layout.tsx

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
  // Middleware redirects to /{locale}, so this only renders briefly
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
