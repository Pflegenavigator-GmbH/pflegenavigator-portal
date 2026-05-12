'use client';

import { useEffect, useState } from 'react';
import { usePWA } from './PWARegister';

export default function PWAInstallPrompt() {
  const { isInstallable, isInstalled, promptInstall } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Prüfe ob bereits dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Zeige Prompt nach kurzer Verzögerung
    if (isInstallable) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const handleInstall = async () => {
    await promptInstall();
    setIsVisible(false);
  };

  // Nicht anzeigen wenn bereits installiert oder dismissed
  if (isInstalled || isDismissed || !isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 bg-[#0f2744] rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-8 h-8">
              <circle cx="50" cy="50" r="38" fill="#0f2744" stroke="white" strokeWidth="2"/>
              <circle cx="50" cy="12" r="4" fill="#20b2aa"/>
              <text x="50" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">N</text>
              <g transform="translate(50, 50) rotate(-45)">
                <polygon points="0,-28 -5,0 5,0" fill="#20b2aa"/>
                <polygon points="0,28 -5,0 5,0" fill="white"/>
                <circle cx="0" cy="0" r="4" fill="#0f2744" stroke="white" strokeWidth="1.5"/>
              </g>
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[#0f2744] mb-1">
              PflegeNavigator App installieren
            </h3>
            <p className="text-sm text-gray-600">
              Für schnellen Zugriff auf Ihrem Home-Bildschirm – auch offline nutzbar.
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Schließen"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleInstall}
            className="flex-1 py-2.5 px-4 bg-[#0066cc] text-white rounded-xl font-medium hover:bg-[#0052a3] transition-colors text-sm"
          >
            Jetzt installieren
          </button>
          <button
            onClick={handleDismiss}
            className="py-2.5 px-4 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors text-sm"
          >
            Später
          </button>
        </div>
      </div>
    </div>
  );
}
