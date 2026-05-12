'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Trash2, 
  AlertTriangle,
  ArrowRight, 
  ArrowLeft,
  Check,
  Clock,
  Shield,
  Lock
} from 'lucide-react';
import Link from 'next/link';

export default function DatenLoeschenPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fallcode: '',
    email: '',
    grund: '',
    bestaetigung: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // API-Anfrage würde hier erfolgen
    // await fetch('/api/datenschutz/loeschen', ...)
  };

  const loeschgruende = [
    { id: 'nicht-mehr', label: 'Ich brauche den Fall nicht mehr' },
    { id: 'falsch', label: 'Daten sind falsch / veraltet' },
    { id: 'unsicher', label: 'Ich habe Datenschutz-Bedenken' },
    { id: 'anderes', label: 'Anderer Grund' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Warn-Header */}
        <div className="bg-red-100 border border-red-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="font-bold text-red-800">Achtung: Löschung ist endgültig!</h2>
            <p className="text-red-700 text-sm mt-1">
              Gelöschte Daten können nicht wiederhergestellt werden. 
              Exportieren Sie zuerst Ihre Daten, falls Sie diese noch brauchen.
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-xl mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#0f2744] mb-2">
            Daten löschen lassen
          </h1>
          <p className="text-slate-600">
            Ihr „Recht auf Vergessenwerden" nach Art. 17 DSGVO
          </p>
        </div>

        {!submitted ? (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      step >= s ? 'bg-red-500 text-white' : 'bg-slate-200'
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
              <CardTitle>Schritt {step} von 3</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Ihr Fallcode (z.B. PF-ABC123)
                        </label>
                        <Input
                          type="text"
                          value={formData.fallcode}
                          onChange={(e) => setFormData({ ...formData, fallcode: e.target.value.toUpperCase() })}
                          placeholder="PF-..."
                          className="text-center tracking-wider"
                        />
                      </div>
                    </div>

                    <Button 
                      type="button"
                      className="w-full"
                      disabled={!formData.fallcode}
                      onClick={() => setStep(2)}
                    >
                      Weiter <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="space-y-4">
                      <label className="block text-sm font-medium mb-2">
                        Warum möchten Sie die Daten löschen?
                      </label>
                      <div className="space-y-2">
                        {loeschgruende.map((grund) => (
                          <label
                            key={grund.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                              formData.grund === grund.id
                                ? 'border-red-500 bg-red-50'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="grund"
                              value={grund.id}
                              checked={formData.grund === grund.id}
                              onChange={(e) => setFormData({ ...formData, grund: e.target.value })}
                              className="text-red-500"
                            />
                            <span>{grund.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                      >
                        <ArrowLeft className="mr-2 w-4 h-4" /> Zurück
                      </Button>
                      <Button 
                        type="button"
                        className="flex-1"
                        disabled={!formData.grund}
                        onClick={() => setStep(3)}
                      >
                        Weiter <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          E-Mail-Adresse für Bestätigung
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="ihre@email.de"
                        />
                      </div>

                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.bestaetigung}
                            onChange={(e) => setFormData({ ...formData, bestaetigung: e.target.checked })}
                            className="mt-1"
                          />
                          <div className="text-sm text-red-700">
                            <strong>Ich verstehe:</strong>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                              <li>Alle meine Daten werden endgültig gelöscht</li>
                              <li>Dies kann nicht rückgängig gemacht werden</li>
                              <li>Ich bin die betroffene Person oder vertretungsberechtigt</li>
                            </ul>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setStep(2)}
                      >
                        <ArrowLeft className="mr-2 w-4 h-4" /> Zurück
                      </Button>
                      <Button 
                        type="submit"
                        className="flex-1 bg-red-500 hover:bg-red-600"
                        disabled={!formData.email || !formData.bestaetigung}
                      >
                        <Trash2 className="mr-2 w-4 h-4" />
                        Daten endgültig löschen
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-green-800">Löschantrag eingegangen!</CardTitle>
                  <CardDescription className="text-green-700">
                    Wir bearbeiten Ihren Antrag umgehend
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-green-700">
                <Clock className="w-5 h-5" />
                <span>Bearbeitung: bis zu 30 Tage (meist schneller)</span>
              </div>
              <div className="flex items-center gap-3 text-green-700">
                <Shield className="w-5 h-5" />
                <span>Sie erhalten eine Bestätigung per E-Mail</span>
              </div>
              <div className="flex items-center gap-3 text-green-700">
                <Lock className="w-5 h-5" />
                <span>Alle Daten werden sicher und vollständig entfernt</span>
              </div>

              <div className="border-t border-green-200 pt-4 mt-4">
                <p className="text-green-800 font-semibold mb-2">Was passiert jetzt?</p>
                <ol className="space-y-2 text-green-700 text-sm list-decimal list-inside">
                  <li>Wir prüfen Ihre Identität anhand des Fallcodes</li>
                  <li>Wir überprüfen, ob rechtliche Aufbewahrungspflichten bestehen</li>
                  <li>Falls keine Pflichten bestehen: Sofortige Löschung</li>
                  <li>Sie erhalten eine schriftliche Bestätigung</li>
                </ol>
              </div>

              <div className="flex gap-3 mt-4">
                <Link href="/datenschutz" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Zurück zum Datenschutz
                  </Button>
                </Link>
                <Button 
                  onClick={() => router.push('/')}
                  className="flex-1"
                >
                  Zur Startseite
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alternative: Export */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              Nicht sicher?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Vielleicht möchten Sie Ihre Daten lieber exportieren, bevor Sie sie löschen?
            </p>
            <div className="flex gap-3">
              <Link href="/datenschutz/auskunft" className="flex-1">
                <Button variant="outline" className="w-full">
                  Datenauskunft beantragen
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
