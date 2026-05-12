'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shield, ArrowRight, ArrowLeft, Home, AlertCircle, Info } from 'lucide-react';
import { saveAnswers } from '@/lib/supabase';
import AvatarChat from '@/components/AvatarChat';
import KokoroVoice from '@/components/KokoroVoice';

interface ModuleAnswers {
  haushalt?: string;
  einkaufen?: string;
  kochen?: string;
  finanzen?: string;
  entscheidungen?: string;
}

export default function Modul6Page() {
  const router = useRouter();
  const [answers, setAnswers] = useState<ModuleAnswers>({});
  const [saving, setSaving] = useState(false);
  const [caseData, setCaseData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('pflege_case');
    if (saved) {
      setCaseData(JSON.parse(saved));
    } else {
      router.push('/pflegegrad/start');
    }
    
    // Lade gespeicherte Antworten falls vorhanden
    const savedAnswers = localStorage.getItem('modul6');
    if (savedAnswers) {
      try {
        const parsed = JSON.parse(savedAnswers);
        if (parsed.antworten) {
          setAnswers(parsed.antworten);
        }
      } catch (e) {
        console.error('Fehler beim Laden:', e);
      }
    }
  }, [router]);

  const isComplete = answers.haushalt && answers.einkaufen && answers.kochen && answers.finanzen && answers.entscheidungen;

  const handleAnswerChange = (question: keyof ModuleAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [question]: value }));
  };

  const handleSaveAndNext = async () => {
    if (!isComplete || !caseData) return;

    setSaving(true);
    try {
      // Speichern in Supabase
      await saveAnswers(
        caseData.id,
        6,
        'Alltagsgestaltung',
        answers
      );
      
      // Speichern in localStorage für Widerspruch-Kontext
      const modul6Ergebnis = {
        modulId: 6,
        name: 'Alltagsgestaltung',
        gewichtung: 0,
        antworten: answers
      };
      localStorage.setItem('modul6', JSON.stringify(modul6Ergebnis));
      
      router.push('/pflegegrad/ergebnis');
    } catch (err) {
      console.error('Fehler beim Speichern:', err);
      // Trotzdem localStorage speichern
      const modul6Ergebnis = {
        modulId: 6,
        name: 'Alltagsgestaltung',
        gewichtung: 0,
        antworten: answers
      };
      localStorage.setItem('modul6', JSON.stringify(modul6Ergebnis));
      router.push('/pflegegrad/ergebnis');
    }
  };

  const handleBack = () => {
    router.push('/pflegegrad/modul5');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Fortschritt */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Modul 6 von 6</span>
            <span>Alltagsgestaltung</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-slate-500 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        <button onClick={handleBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Zurück</span>
        </button>

        <Card className="border-slate-200 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Home className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <CardTitle>Modul 6: Alltagsgestaltung</CardTitle>
                <CardDescription>Gewichtung: 0% (nicht für Pflegegrad-Berechnung)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hinweis-Box */}
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-800 font-medium">
                    Wichtiger Hinweis
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    Dieses Modul fließt <strong>nicht</strong> in die Pflegegrad-Berechnung ein, 
                    ist aber wichtig für eine vollständige Einschätzung – besonders bei einem 
                    möglichen <strong>Widerspruch</strong> gegen den Bescheid.
                  </p>
                </div>
              </div>
            </div>

            {/* Frage 1: Haushalt */}
            <div>
              <h3 className="font-medium text-slate-900 mb-3">
                1. Wer macht den Haushalt (putzen, Staub wischen, Wäsche waschen)?
              </h3>
              <RadioGroup value={answers.haushalt || ''} onValueChange={(v) => handleAnswerChange('haushalt', v)}>
                <RadioGroupItem value="selbst" id="q1-1">
                  <span className="font-medium">Die Person allein</span>
                  <span className="text-sm text-slate-500 block">Putzt und wäscht selbstständig</span>
                </RadioGroupItem>
                <RadioGroupItem value="teilweise" id="q1-2">
                  <span className="font-medium">Mit Unterstützung</span>
                  <span className="text-sm text-slate-500 block">Leichte Arbeiten selbst, schwere mit Hilfe (z.B. Staubsaugen)</span>
                </RadioGroupItem>
                <RadioGroupItem value="nicht" id="q1-3">
                  <span className="font-medium">Andere machen alles</span>
                  <span className="text-sm text-slate-500 block">Haushalt wird komplett übernommen</span>
                </RadioGroupItem>
              </RadioGroup>
            </div>

            {/* Frage 2: Einkaufen */}
            <div>
              <h3 className="font-medium text-slate-900 mb-3">
                2. Kann die Person alleine einkaufen gehen?
              </h3>
              <RadioGroup value={answers.einkaufen || ''} onValueChange={(v) => handleAnswerChange('einkaufen', v)}>
                <RadioGroupItem value="ja" id="q2-1">
                  <span className="font-medium">Ja, vollständig</span>
                  <span className="text-sm text-slate-500 block">Geht selbst in Geschäfte, trägt Einkäufe</span>
                </RadioGroupItem>
                <RadioGroupItem value="online_begleitung" id="q2-2">
                  <span className="font-medium">Nur Online oder mit Begleitung</span>
                  <span className="text-sm text-slate-500 block">Kann nicht mehr selbst in Geschäfte gehen</span>
                </RadioGroupItem>
                <RadioGroupItem value="nicht" id="q2-3">
                  <span className="font-medium">Nicht allein möglich</span>
                  <span className="text-sm text-slate-500 block">Wird komplett mit Lebensmitteln versorgt</span>
                </RadioGroupItem>
              </RadioGroup>
            </div>

            {/* Frage 3: Kochen */}
            <div>
              <h3 className="font-medium text-slate-900 mb-3">
                3. Kann die Person selbstständig kochen und sich verpflegen?
              </h3>
              <RadioGroup value={answers.kochen || ''} onValueChange={(v) => handleAnswerChange('kochen', v)}>
                <RadioGroupItem value="selbst" id="q3-1">
                  <span className="font-medium">Ja, alleine</span>
                  <span className="text-sm text-slate-500 block">Plant Mahlzeiten, kocht selbst, räumt auf</span>
                </RadioGroupItem>
                <RadioGroupItem value="teilweise" id="q3-2">
                  <span className="font-medium">Mit Unterstützung</span>
                  <span className="text-sm text-slate-500 block">Muss erinnert werden oder braucht Hilfe beim Zubereiten</span>
                </RadioGroupItem>
                <RadioGroupItem value="nicht" id="q3-3">
                  <span className="font-medium">Nicht allein</span>
                  <span className="text-sm text-slate-500 block">Essen wird vollständig zubereitet oder geliefert</span>
                </RadioGroupItem>
              </RadioGroup>
            </div>

            {/* Frage 4: Finanzen */}
            <div>
              <h3 className="font-medium text-slate-900 mb-3">
                4. Kann die Person ihre Finanzen alleine regeln?
              </h3>
              <RadioGroup value={answers.finanzen || ''} onValueChange={(v) => handleAnswerChange('finanzen', v)}>
                <RadioGroupItem value="voll" id="q4-1">
                  <span className="font-medium">Vollständig selbstständig</span>
                  <span className="text-sm text-slate-500 block">Überweisungen, Rechnungen, Bargeld, Online-Banking</span>
                </RadioGroupItem>
                <RadioGroupItem value="teilweise" id="q4-2">
                  <span className="font-medium">Mit Hilfe</span>
                  <span className="text-sm text-slate-500 block">Braucht Unterstützung bei Überweisungen oder komplexen Angelegenheiten</span>
                </RadioGroupItem>
                <RadioGroupItem value="nicht" id="q4-3">
                  <span className="font-medium">Nicht allein</span>
                  <span className="text-sm text-slate-500 block">Betreuung der Finanzen nötig (z.B. durch Angehörige oder Bevollmächtigten)</span>
                </RadioGroupItem>
              </RadioGroup>
            </div>

            {/* Frage 5: Entscheidungen */}
            <div>
              <h3 className="font-medium text-slate-900 mb-3">
                5. Kann die Person selbstständig wichtige Entscheidungen treffen?
              </h3>
              <RadioGroup value={answers.entscheidungen || ''} onValueChange={(v) => handleAnswerChange('entscheidungen', v)}>
                <RadioGroupItem value="selbst" id="q5-1">
                  <span className="font-medium">Ja, eigenverantwortlich</span>
                  <span className="text-sm text-slate-500 block">Kann komplexe Entscheidungen selbst treffen (Ärzte, Verträge, Termine)</span>
                </RadioGroupItem>
                <RadioGroupItem value="beratung" id="q5-2">
                  <span className="font-medium">Mit Beratung</span>
                  <span className="text-sm text-slate-500 block">Möchte mit Angehörigen besprechen, entscheidet dann selbst</span>
                </RadioGroupItem>
                <RadioGroupItem value="nicht" id="q5-3">
                  <span className="font-medium">Nicht allein möglich</span>
                  <span className="text-sm text-slate-500 block">Benötigt Entscheidungshilfe oder Vertretung bei wichtigen Angelegenheiten</span>
                </RadioGroupItem>
              </RadioGroup>
            </div>

            {/* Widerspruch-Kontext Hinweis */}
            <div className="p-4 bg-slate-100 rounded-lg border border-slate-300 mt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-700">
                    <strong>Wichtig für Widersprüche:</strong> Auch wenn diese Bereiche nicht direkt 
                    in den Pflegegrad einfließen, können sie bei der Beurteilung der Gesamtsituation 
                    relevant sein – besonders wenn sich die Einschränkungen in den letzten Monaten 
                    verschlechtert haben.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Zurück zu Modul 5
            </Button>
            <Button 
              onClick={handleSaveAndNext} 
              disabled={!isComplete || saving}
              className="flex-1 bg-slate-600 hover:bg-slate-700"
            >
              {saving ? 'Speichern...' : 'Weiter zum Ergebnis'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>

        <footer className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-start gap-2 text-slate-500 text-sm">
            <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Keine Rechts- oder Medizinberatung.</strong> Diese App gibt nur eine erste Orientierung.
            </p>
          </div>
        </footer>

        {/* Sprachsteuerung */}
        <KokoroVoice 
          onCommand={(cmd) => {
            if (cmd === 'weiter' && isComplete) handleSaveAndNext();
            if (cmd === 'zurueck') handleBack();
          }}
        />
      </div>
    </main>
  );
}
