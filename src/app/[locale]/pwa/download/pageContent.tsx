'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import QRCode to avoid SSR issues
const QRCode = dynamic(
  () => import('qrcode'),
  { ssr: false }
);

export default function PWADownloadPage() {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop' | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Only run on client
    if (typeof window === 'undefined') return;
    
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // Generate QR code for current URL
    const generateQR = async () => {
      try {
        const { default: QR } = await import('qrcode');
        const url = window.location.origin;
        const dataUrl = await QR.toDataURL(url, {
          width: 300,
          margin: 2,
          color: {
            dark: '#0f2744',
            light: '#ffffff'
          }
        });
        setQrCodeDataUrl(dataUrl);
      } catch (err) {
        console.error('QR generation failed:', err);
      }
    };

    generateQR();
  }, []);

  const handleInstall = async () => {
    if (typeof window === 'undefined') return;
    // @ts-expect-error - beforeinstallprompt is not in standard types
    const deferredPrompt = window.deferredPrompt;
    
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('PWA installed');
      }
    }
  };

  // Return loading state during SSR
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-[#0f2744] rounded-2xl shadow-xl">
            <svg viewBox="0 0 100 100" className="w-16 h-16">
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
          <h1 className="text-4xl font-bold text-[#0f2744] mb-3">
            PflegeNavigator EU App
          </h1>
          <p className="text-gray-500">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-[#0f2744] rounded-2xl shadow-xl">
            <svg viewBox="0 0 100 100" className="w-16 h-16">
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
          
          <h1 className="text-4xl font-bold text-[#0f2744] mb-3">
            PflegeNavigator EU App
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Installiere die App für schnellen Zugriff – auch offline.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* QR Code Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#0f2744] mb-4 flex items-center gap-3">
              <svg className="w-6 h-6 text-[#0066cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              QR-Code scannen
            </h2>
            
            <p className="text-gray-600 mb-6">
              Scanne den Code mit deiner Kamera-App, um die Website zu öffnen und die App zu installieren.
            </p>
            
            <div className="flex justify-center">
              {qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt="QR-Code zur Installation" 
                  className="rounded-xl shadow-md"
                  width={300}
                  height={300}
                />
              ) : (
                <div className="w-[300px] h-[300px] bg-gray-100 rounded-xl flex items-center justify-center">
                  <span className="text-gray-400">Generiere QR-Code...</span>
                </div>
              )}
            </div>
          </div>

          {/* Installation Instructions */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {platform === 'ios' && (
              <div>
                <h2 className="text-2xl font-bold text-[#0f2744] mb-4 flex items-center gap-3">
                  <svg className="w-6 h-6 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.22-1.97 1.08-3.11-1.05.05-2.31.7-3.06 1.53C10.26 2.86 9.73 4.04 9.89 5.18c1.14.09 2.29-.77 3.11-1.68z"/>
                  </svg>
                  Installation auf iPhone/iPad
                </h2>
                
                <ol className="space-y-4 text-gray-700">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#0066cc] text-white rounded-full flex items-center justify-center font-bold">1</span>
                    <div>
                      <strong>Teilen</strong>-Taste im Safari-Menü unten tippen
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#0066cc] text-white rounded-full flex items-center justify-center font-bold">2</span>
                    <div>
                      <strong>"Zum Home-Bildschirm"</strong> auswählen
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#0066cc] text-white rounded-full flex items-center justify-center font-bold">3</span>
                    <div>
                      <strong>Hinzufügen</strong> im Popup bestätigen
                    </div>
                  </li>
                </ol>
              </div>
            )}

            {platform === 'android' && (
              <div>
                <h2 className="text-2xl font-bold text-[#0f2744] mb-4 flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
                  </svg>
                  Installation auf Android
                </h2>
                
                <ol className="space-y-4 text-gray-700">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#0066cc] text-white rounded-full flex items-center justify-center font-bold">1</span>
                    <div>
                      Chrome-Menü (⋮) oben rechts öffnen
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#0066cc] text-white rounded-full flex items-center justify-center font-bold">2</span>
                    <div>
                      <strong>"Zum Startbildschirm hinzufügen"</strong> tippen
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#0066cc] text-white rounded-full flex items-center justify-center font-bold">3</span>
                    <div>
                      Im Dialog auf <strong>Installieren</strong> klicken
                    </div>
                  </li>
                </ol>
              </div>
            )}

            {platform === 'desktop' && (
              <div>
                <h2 className="text-2xl font-bold text-[#0f2744] mb-4 flex items-center gap-3">
                  <svg className="w-6 h-6 text-[#0066cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Desktop-Installation
                </h2>
                
                <p className="text-gray-700 mb-6">
                  Scanne den QR-Code mit deinem Smartphone, um die App dort zu installieren, 
                  oder installiere sie direkt in Chrome:
                </p>
                
                <ol className="space-y-4 text-gray-700">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#0066cc] text-white rounded-full flex items-center justify-center font-bold">1</span>
                    <div>
                      Chrome-Menü (⋮) → <strong>"App installieren"</strong>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#0066cc] text-white rounded-full flex items-center justify-center font-bold">2</span>
                    <div>
                      Im Dialog auf <strong>"Installieren"</strong> klicken
                    </div>
                  </li>
                </ol>
                
                <button 
                  onClick={handleInstall}
                  className="mt-6 w-full py-4 bg-[#0066cc] text-white rounded-xl font-semibold hover:bg-[#0052a3] transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Jetzt installieren
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-[#20b2aa]/10 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#20b2aa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-[#0f2744] mb-2">Schneller Zugriff</h3>
            <p className="text-gray-600 text-sm">Starte die App direkt vom Home-Bildschirm – ohne Browser.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-[#0066cc]/10 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#0066cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.138" />
              </svg>
            </div>
            <h3 className="font-semibold text-[#0f2744] mb-2">Offline-Nutzung</h3>
            <p className="text-gray-600 text-sm">Nutze die App auch ohne Internet – wichtige Infos sind immer verfügbar.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-[#0f2744] mb-2">Sicher & Privat</h3>
            <p className="text-gray-600 text-sm">Alle Daten bleiben auf deinem Gerät. Keine Tracking-Cookies.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
