'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  Check,
  Info,
  Clock,
  FileText,
  Euro,
  Percent
} from 'lucide-react';

const opfergruppen = [
  { 
    id: 'gewalt', 
    label: 'Gewaltopfer (Körperverletzung)', 
    beschreibung: 'Körperliche Angriffe, Misshandlung',
    punkte: 30 
  },
  { 
    id: 'hinterbliebene', 
    label: 'Hinterbliebene', 
    beschreibung: 'Ehepartner, Kinder, Eltern',
    punkte: 25 
  },
  { 
    id: 'zeugen', 
    label: 'Zeuge belastender Tat', 
    beschreibung: 'Psychische Belastung durch Zeugenaussage',
    punkte: 20 
  },
  { 
    id: 'sexuell', 
    label: 'Sexueller Missbrauch', 
    beschreibung: 'Opfer sexueller Gewalt',
    punkte: 35 
  },
  { 
    id: 'haeuslich', 
    label: 'Häusliche Gewalt', 
    beschreibung: 'Gewalt im häuslichen Bereich',
    punkte: 30 
  },
];

const folgen = [
  { id: 'koerperlich', label: 'Körperliche Verletzung', punkte: 20 },
  { id: 'psychisch', label: 'Psychische Beeinträchtigung', punkte: 25 },
  { id: 'beruf', label: 'Berufsunfähigkeit', punkte: 30 },
  { id: 'dauerhaft', label: 'Dauerhafte Schäden', punkte: 35 },
  { id: 'tod', label: 'Tod des Opfers', punkte: 50 },
];

export default function SGBXIVRechnerPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [auswahl, setAuswahl] = useState({
    gruppe: '',
    folgen: [] as string[],
    zeitraum: '',
  });
  const [ergebnis, setErgebnis] = useState<{
    punkte: number;
    basis: string;
    schmerzensgeld: string;
    rente: string;
    wahrscheinlichkeit: string;
  } | null>(null);

  const calculate = () => {
    let punkte = 0;
    const gruppe = opfergruppen.find(g => g.id === auswahl.gruppe);
    if (gruppe) punkte += gruppe.punkte;
    
    auswahl.folgen.forEach(f => {
      const folge = folgen.find(fo => fo.id === f);
      if (folge) punkte += folge.punkte;
    });

    let basis = 'Gering';
    if (punkte >= 60) basis = 'Hoch';
    else if (punkte >= 40) basis = 'Mittel';

    let schmerzensgeld = '500 - 5.000 €';
    if (punkte >= 80) schmerzensgeld = '10.000 - 50.000 €';
    else if (punkte >= 60) schmerzensgeld = '5.000 - 25.000 €';
    else if (punkte >= 40) schmerzensgeld = '2.500 - 10.000 €';

    let rente = 'Keine';
    if (punkte >= 70) rente = '400 - 800 €/Monat';
    else if (punkte >= 50) rente = '300 - 600 €/Monat';

    let wahrscheinlichkeit = 'Gering';
    if (punkte >= 60) wahrscheinlichkeit = 'Hoch';
    else if (punkte >= 40) wahrscheinlichkeit = 'Mittel';

    setErgebnis({ punkte, basis, schmerzensgeld, rente, wahrscheinlichkeit });
    setStep(3);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-600 rounded-2xl shadow-xl mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#0f2744] mb-4">
            Opferentschädigung (SGB XIV)
          </h1>
          <p className="text-xl text-slate-600">
            Prüfen Sie Ihren Anspruch nach dem Sozialgesetzbuch XIV
          </p>
        </div>

        {/* Warnung */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="font-bold text-amber-800">Wichtige Hinweise</h2>
            <ul className="text-sm text-amber-700 mt-2 space-y-1 list-disc list-inside">
              <li>Frist: Antrag innerhalb von 3 Jahren nach der Tat</li>
              <li>Anzeige: Die Tat muss bei der Polizei angezeigt sein</li>
              <li>Rechner: Nur Orientierung, kein verbindliches Ergebnis</li>
            </ul>
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Wer sind Sie?</CardTitle>
              <CardDescription>
                Wählen Sie die passende Opfergruppe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {opfergruppen.map((gruppe) => (
                  <button
                    key={gruppe.id}
                    onClick={() => setAuswahl({ ...auswahl, gruppe: gruppe.id })}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      auswahl.gruppe === gruppe.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        auswahl.gruppe === gruppe.id
                          ? 'bg-purple-500 border-purple-500'
                          : 'border-slate-300'
                      }`}>
                        {auswahl.gruppe === gruppe.id && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <p className="font-semibold">{gruppe.label}</p>
                        <p className="text-sm text-slate-500">{gruppe.beschreibung}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <Button 
                onClick={() => setStep(2)}
                disabled={!auswahl.gruppe}
                className="w-full"
              >
                Weiter <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Welche Folgen hat die Tat?</CardTitle>
              <CardDescription>
                Mehrere Antworten möglich
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-3">
                {folgen.map((folge) => (
                  <button
                    key={folge.id}
                    onClick={() => {
                      if (auswahl.folgen.includes(folge.id)) {
                        setAuswahl({ 
                          ...auswahl, 
                          folgen: auswahl.folgen.filter(f => f !== folge.id) 
                        });
                      } else {
                        setAuswahl({ 
                          ...auswahl, 
                          folgen: [...auswahl.folgen, folge.id] 
                        });
                      }
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      auswahl.folgen.includes(folge.id)
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        auswahl.folgen.includes(folge.id)
                          ? 'bg-purple-500 border-purple-500'
                          : 'border-slate-300'
                      }`}>
                        {auswahl.folgen.includes(folge.id) && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <span>{folge.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" /> Zurück
                </Button>
                <Button 
                  onClick={calculate}
                  disabled={auswahl.folgen.length === 0}
                  className="flex-1"
                >
                  Ergebnis berechnen
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && ergebnis && (
          <>
            <Card className="border-purple-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>Ihr Ergebnis</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Wahrscheinlichkeit */}
                <div className={`text-center p-6 rounded-xl ${
                  ergebnis.wahrscheinlichkeit === 'Hoch' 
                    ? 'bg-green-50' 
                    : ergebnis.wahrscheinlichkeit === 'Mittel'
                      ? 'bg-yellow-50'
                      : 'bg-red-50'
                }`}>
                  <p className="text-sm mb-2">Geschätzte Erfolgschance</p>
                  <div className={`text-4xl font-bold ${
                    ergebnis.wahrscheinlichkeit === 'Hoch' 
                      ? 'text-green-600' 
                      : ergebnis.wahrscheinlichkeit === 'Mittel'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  }`}>
                    {ergebnis.wahrscheinlichkeit}
                  </div>
                </div>

                {/* Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Euro className="w-5 h-5 text-purple-500" />
                      <p className="font-semibold">Schmerzensgeld</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{ergebnis.schmerzensgeld}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-purple-500" />
                      <p className="font-semibold">Rente</p>
                    </div>
                    <p className="text-lg font-bold text-purple-600">{ergebnis.rente}</p>
                  </div>
                </div>

                {/* Hinweis */}
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-amber-800">
                    <strong>Wichtig:</strong> Dies ist nur eine Orientierungshilfe. 
                    Nur das <strong>Landesamt für Opferentschädigung</strong> kann verbindlich 
                    über Ihren Anspruch entscheiden.
                  </p>
                </div>

                {/* Weitere Leistungen */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Weitere mögliche Leistungen:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Behandlungskosten (100%)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Verdienstausfall</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Rentenanspruch bei dauerhaften Schäden</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Hinterbliebenenrente bei Todesfällen</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Nächste Schritte */}
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <Card className="bg-purple-50 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => router.push('/brief-generator?typ=opferentschadigung')}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-purple-600" />
                    <div>
                      <CardTitle className="text-lg">Antrag erstellen</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm mb-3">
                    Automatischen Antrag ans Landesamt generieren
                  </p>
                  <Button className="w-full">
                    Brief erstellen <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Info className="w-8 h-8 text-slate-600" />
                    <div>
                      <CardTitle className="text-lg">Weitere Infos</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><strong>Antragsfrist:</strong> 3 Jahre nach Tat</p>
                  <p><strong>Kosten:</strong> Kostenlos</p>
                  <p><strong>Voraussetzung:</strong> Anzeige bei Polizei</p>
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => window.open('https://www.justiz.nrw.de', '_blank')}
                  >
                    Landesamt suchen
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Button 
              variant="outline" 
              onClick={() => setStep(1)}
              className="w-full mt-6"
            >
              <ArrowLeft className="mr-2 w-4 h-4" /> Neue Berechnung
            </Button>
          </>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t text-center">
          <p className="text-sm text-slate-500">
            © 2026 PflegeNavigator EU gUG - Keine Rechtsberatung
          </p>
        </footer>
      </div>
    </main>
  );
}
