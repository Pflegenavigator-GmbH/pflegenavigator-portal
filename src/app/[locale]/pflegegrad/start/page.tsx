'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, ArrowRight, Plus, ArrowLeft, KeyRound } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AvatarChat from '@/components/AvatarChat';

export default function PflegegradStartPage() {
  const router = useRouter();
  const [caseCode, setCaseCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isNewCase, setIsNewCase] = useState(false);

  // Bestehenden Fall laden
  const handleLoadCase = async () => {
    if (!caseCode.trim()) {
      setError('Bitte geben Sie einen Fallcode ein.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('case_code', caseCode.toUpperCase())
        .single();

      if (error || !data) {
        setError('Fallcode nicht gefunden. Prüfen Sie die Eingabe oder starten Sie einen neuen Fall.');
        setLoading(false);
        return;
      }

      // Speichern in localStorage für Navigation
      localStorage.setItem('pflege_case', JSON.stringify(data));
      
      // Weiter zum ersten Modul
      router.push('/pflegegrad/modul1');
    } catch (err) {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      setLoading(false);
    }
  };

  // Neuen Fall erstellen
  const handleCreateCase = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.rpc('create_case');

      if (error) throw error;

      // Speichern in localStorage
      localStorage.setItem('pflege_case', JSON.stringify(data));
      setIsNewCase(true);
    } catch (err) {
      setError('Fehler beim Erstellen eines neuen Falls. Bitte versuchen Sie es erneut.');
      setLoading(false);
    }
  };

  // Zu Modul 1 wechseln
  const handleStartQuestions = () => {
    router.push('/pflegegrad/modul1');
  };

  // Fallcode aus localStorage
  const savedCase = typeof window !== 'undefined' ? localStorage.getItem('pflege_case') : null;
  const caseData = savedCase ? JSON.parse(savedCase) : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Zurück-Link */}
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Zurück zur Startseite</span>
        </button>

        {/* Neuer Fall erstellt */}
        {isNewCase ? (
          <Card className="border-emerald-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <KeyRound className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <CardTitle>Ihr persönlicher Fallcode</CardTitle>
                  <CardDescription>Speichern Sie diesen Code gut</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-6 text-center">
                <p className="text-sm text-slate-600 mb-2">Ihr Fallcode lautet:</p>
                <p className="text-3xl font-mono font-bold text-emerald-700 tracking-wider">
                  {caseData?.case_code}
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Wichtig:</strong> Schreiben Sie sich diesen Code auf oder speichern Sie ihn. 
                  Damit können Sie später zurückkehren und Ihre Antworten bearbeiten.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleStartQuestions} className="w-full" size="lg">
                Weiter zu den Fragen
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <>
            {/* Fallcode eingeben */}
            <Card className="mb-6 border-slate-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <KeyRound className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Vorhandenen Fall laden</CardTitle>
                    <CardDescription>Haben Sie schon einen Fallcode?</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="caseCode" className="block text-sm font-medium text-slate-700 mb-2">
                    Fallcode eingeben
                  </label>
                  <Input
                    id="caseCode"
                    type="text"
                    placeholder="z.B. PG-ABC123"
                    value={caseCode}
                    onChange={(e) => setCaseCode(e.target.value.toUpperCase())}
                    className="text-center font-mono text-lg tracking-wider"
                    maxLength={10}
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleLoadCase} 
                  disabled={loading || !caseCode.trim()}
                  className="w-full"
                  size="lg"
                  variant="outline"
                >
                  {loading ? 'Wird geladen...' : 'Fall laden'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>

            {/* ODER */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gradient-to-b from-emerald-50 to-white px-4 text-sm text-slate-500">oder</span>
              </div>
            </div>

            {/* Neuer Fall */}
            <Card className="border-emerald-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Plus className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle>Neuen Fall starten</CardTitle>
                    <CardDescription>Erstellen Sie einen neuen Pflegegrad-Check</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Starten Sie eine neue Bewertung. Sie bekommen einen persönlichen Fallcode, 
                  unter dem wir Ihre Antworten speichern.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleCreateCase} 
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Wird erstellt...' : 'Neuen Fall starten'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          </>
        )}

        {/* Disclaimer Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-start gap-2 text-slate-500 text-sm">
            <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Keine Rechts- oder Medizinberatung.</strong> Diese App gibt nur eine 
              erste Orientierung. Den offiziellen Pflegegrad stellt nur der Medizinische 
              Dienst der Krankenkassen (MDK) fest.
            </p>
          </div>
        </div>

        {/* Footer mit Impressum & Datenschutz */}
        <footer className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex justify-center gap-6 text-sm text-slate-500">
            <a href="/impressum" className="hover:text-[#20b2aa]">Impressum</a>
            <span>|</span>
            <a href="/datenschutz" className="hover:text-[#20b2aa]">Datenschutz</a>
          </div>
        </footer>

        {/* Avatar Chat Assistent */}
        <AvatarChat pageContext="pflegegrad-start" />
      </div>
    </main>
  );
}
