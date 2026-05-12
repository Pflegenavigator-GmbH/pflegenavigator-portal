'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  Mail,
  User,
  Calendar,
  Database,
  Check,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function DatenschutzAuskunftPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fallcode: '',
    email: '',
    bestaetigung: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Hier würde die API-Anfrage erfolgen
    // await fetch('/api/datenschutz/auskunft', ...)
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#0f2744] mb-2">
            Datenauskunft beantragen
          </h1>
          <p className="text-slate-600">
            Nach Art. 15 DSGVO haben Sie das Recht, Auskunft über Ihre Daten zu erhalten
          </p>
        </div>

        {!submitted ? (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= 1 ? 'bg-[#20b2aa] text-white' : 'bg-slate-200'
                }`}>
                  1
                </div>
                <div className="flex-1 h-1 bg-slate-200 rounded">
                  <div className={`h-1 bg-[#20b2aa] rounded transition-all ${
                    step >= 2 ? 'w-full' : 'w-0'
                  }`} />
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= 2 ? 'bg-[#20b2aa] text-white' : 'bg-slate-200'
                }`}>
                  2
                </div>
              </div>
              <CardTitle>Schritt {step} von 2</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 ? (
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
                        <p className="text-sm text-slate-500 mt-2">
                          Den Code finden Sie in Ihrer Bestätigungs-E-Mail oder im Portal
                        </p>
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
                ) : (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          E-Mail-Adresse für die Antwort
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="ihre@email.de"
                        />
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.bestaetigung}
                            onChange={(e) => setFormData({ ...formData, bestaetigung: e.target.checked })}
                            className="mt-1"
                          />
                          <span className="text-sm text-slate-600">
                            Ich bestätige, dass ich die betroffene Person bin oder 
                            vertretungsberechtigt (Vollmacht liegt vor). Die Daten werden 
                            ausschließlich zur Identifikation verwendet.
                          </span>
                        </label>
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
                        type="submit"
                        className="flex-1"
                        disabled={!formData.email || !formData.bestaetigung}
                      >
                        Auskunft beantragen
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
                  <CardTitle className="text-green-800">Antrag eingegangen!</CardTitle>
                  <CardDescription className="text-green-700">
                    Wir bearbeiten Ihren Antrag innerhalb von 30 Tagen
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-green-700">
                <Mail className="w-5 h-5" />
                <span>Bestätigung gesendet an: {formData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-green-700">
                <Clock className="w-5 h-5" />
                <span>Bearbeitungszeit: bis zu 30 Tage</span>
              </div>
              
              <div className="border-t border-green-200 pt-4 mt-4">
                <h4 className="font-semibold text-green-800 mb-2">Was passiert jetzt?</h4>
                <ul className="space-y-2 text-green-700 text-sm">
                  <li>• Wir prüfen Ihre Identität anhand des Fallcodes</li>
                  <li>• Sie erhalten eine vollständige Liste Ihrer Daten</li>
                  <li>• Alle Daten werden Ihnen übersichtlich dargestellt</li>
                  <li>• Bei Fragen: datenschutz@pflegenavigatoreu.com</li>
                </ul>
              </div>

              <Link href="/datenschutz">
                <Button variant="outline" className="w-full mt-4">
                  Zurück zur Datenschutz-Seite
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Info-Box */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Ihre Rechte nach DSGVO
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-blue-700">
            <p><strong>Art. 15:</strong> Auskunft über gespeicherte Daten</p>
            <p><strong>Art. 16:</strong> Berichtigung falscher Daten</p>
            <p><strong>Art. 17:</strong> Löschung („Vergessenwerden")</p>
            <p><strong>Art. 18:</strong> Einschränkung der Verarbeitung</p>
            <p><strong>Art. 20:</strong> Datenübertragbarkeit</p>
            
            <div className="border-t border-blue-200 pt-4 mt-4">
              <p className="text-sm">
                Weitere Informationen finden Sie auf der 
                <Link href="/datenschutz" className="underline">Datenschutz-Seite</Link> oder 
                kontaktieren Sie uns direkt:{' '}
                <a href="mailto:datenschutz@pflegenavigatoreu.com" className="underline">
                  datenschutz@pflegenavigatoreu.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
