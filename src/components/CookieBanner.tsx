'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cookie, X, Info, ChevronDown, ChevronUp } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Prüfen ob User bereits zugestimmt hat
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-timestamp', new Date().toISOString());
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl z-50">
      <Card className="border-0 shadow-none">
        <CardContent className="p-4 md:p-6">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Cookie className="w-6 h-6 text-blue-600" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Datenschutz-Einstellungen</h3>
                    <p className="text-slate-600 mb-4">
                      Wir verwenden nur technisch notwendige Cookies und ein 
                      datenschutzfreundliches Analyse-Tool (Umami). 
                      Keine Werbung, kein Tracking über Websites hinweg.
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={handleAccept}
                      >
                        Akzeptieren
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleDecline}
                      >
                        Nur notwendige
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-slate-500"
                      >
                        {showDetails ? (
                          <><ChevronUp className="w-4 h-4 mr-1" /> Weniger</>
                        ) : (
                          <><ChevronDown className="w-4 h-4 mr-1" /> Details</>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleDecline}
                    className="flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Details */}
                {showDetails && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="w-4 h-4 text-green-500" />
                          <span className="font-medium">Technisch notwendig</span>
                          <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Immer aktiv</span>
                        </div>
                        <p className="text-sm text-slate-600">
                          Für die Grundfunktionen des Portals nötig (z.B. Speichern Ihres Fallcodes).
                        </p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">Analyse (Umami)</span>
                          <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Opt-in</span>
                        </div>
                        <p className="text-sm text-slate-600">
                          Datenschutzfreundliche, anonymisierte Statistik. 
                          Keine persönlichen Daten, keine Weitergabe.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-slate-500">
                      <p>
                        <strong>Wichtig:</strong> Wir verwenden <em>keine</em> Cookies von Google, 
                        Facebook oder anderen Werbenetzwerken. 
                        <a href="/datenschutz" className="text-blue-600 hover:underline">Mehr in unserer Datenschutzerklärung</a>.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
