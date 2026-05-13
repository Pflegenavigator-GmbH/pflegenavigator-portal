'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calculator, 
  ArrowRight, 
  ArrowLeft,
  Check,
  Info,
  Accessibility,
  Euro,
  Clock,
  Percent,
  FileText
} from 'lucide-react';
import { GDB_2026 } from '@/lib/aktuelle-daten-2026';

interface GdBOption {
  id: string;
  label: string;
  punkte: number;
  beschreibung: string;
}

const gdbBereiche: GdBOption[] = [
  { id: 'gehfaehigkeit', label: 'Gehfähigkeit', punkte: 0, beschreibung: 'Kann die Person laufen?' },
  { id: 'sehen', label: 'Sehvermögen', punkte: 0, beschreibung: 'Wie gut sieht die Person?' },
  { id: 'hoeren', label: 'Hörvermögen', punkte: 0, beschreibung: 'Wie gut hört die Person?' },
  { id: 'sprache', label: 'Sprache', punkte: 0, beschreibung: 'Kann die Person sprechen?' },
  { id: 'harnableitung', label: 'Harnableitung', punkte: 0, beschreibung: 'Kontinenz?' },
  { id: 'darmableitung', label: 'Darmableitung', punkte: 0, beschreibung: 'Kontinenz?' },
  { id: 'arme', label: 'Arme/Hände', punkte: 0, beschreibung: 'Kann die Person greifen?' },
  { id: 'schmerzen', label: 'Schmerzen', punkte: 0, beschreibung: 'Häufige starke Schmerzen?' },
  { id: 'psychisch', label: 'Psychische Einschränkungen', punkte: 0, beschreibung: 'Depression, Angst, etc.?' },
  { id: 'lernen', label: 'Lernen', punkte: 0, beschreibung: 'Kognitive Einschränkungen?' },
];

const verguenstigungen = {
  30: ['Steuerfreibetrag 2026: +€', 'Mehr-Pauschbetrag'],
  50: ['Frühpensionierung +1 Jahr', 'Steuervorteile', 'Pflegekosten absetzbar'],
  80: ['Schwerbehindertenausweis', 'Parkplatz', 'Rundfunkbeitrag befreit', 'Kostenlose Bahnfahrt'],
};

export default function GdBRechnerPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [ausgewaehlt, setAusgewaehlt] = useState<string[]>([]);
  const [ergebnis, setErgebnis] = useState<{
    punkte: number;
    gdb: number;
    verguenstigungen: string[];
  } | null>(null);

  const toggleBereich = (id: string) => {
    if (ausgewaehlt.includes(id)) {
      setAusgewaehlt(ausgewaehlt.filter(b => b !== id));
    } else {
      setAusgewaehlt([...ausgewaehlt, id]);
    }
  };

  const berechneGdB = () => {
    // Vereinfachte Berechnung: Je Bereich ca. 10-30 Punkte
    const punkte = ausgewaehlt.length * 25;
    
    let gdb = 0;
    if (punkte >= 80) gdb = 80;
    else if (punkte >= 50) gdb = 50;
    else if (punkte >= 30) gdb = 30;
    else if (punkte >= 20) gdb = 20;
    else gdb = 10;

    let verg: string[] = [];
    if (gdb >= 80) verg = verguenstigungen[80];
    else if (gdb >= 50) verg = verguenstigungen[50];
    else if (gdb >= 30) verg = verguenstigungen[30];

    setErgebnis({ punkte, gdb, verguenstigungen: verg });
    setStep(3);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-2xl shadow-xl mb-6">
            <Accessibility className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#0f2744] mb-4">
            GdB-Rechner
          </h1>
          <p className="text-xl text-slate-600">
            Grad der Behinderung einschätzen
          </p>
        </div>

        {/* Schritt 1: Einführung */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                Was ist der GdB?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700">
                Der <strong>Grad der Behinderung (GdB)</strong> zeigt, wie stark eine Person 
                durch Krankheit oder Behinderung eingeschränkt ist. Er liegt zwischen 
                <strong>20 und 100</strong>.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="font-semibold text-green-800 mb-2">GdB 30-40</p>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>✓ Steuerfreibetrag</li>
                    <li>✓ Mehr-Pauschbetrag</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="font-semibold text-blue-800 mb-2">GdB 50</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>✓ Früher in Rente</li>
                    <li>✓ Mehr Hinzuverdienst</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 md:col-span-2">
                  <p className="font-semibold text-purple-800 mb-2">GdB 80+ (Schwerbehindert)</p>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>✓ Schwerbehindertenausweis</li>
                    <li>✓ Parkplatz</li>
                    <li>✓ Befreiung Rundfunkbeitrag</li>
                    <li>✓ Kostenlose Bahnfahrt</li>
                  </ul>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Hinweis:</strong> Dieser Rechner gibt nur eine erste Einschätzung. 
                  Nur das <strong>Versorgungsamt</strong> stellt den GdB verbindlich fest.
                </p>
              </div>

              <Button 
                onClick={() => setStep(2)}
                className="w-full"
                size="lg"
              >
                Rechner starten <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Schritt 2: Bereiche auswählen */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Welche Einschränkungen bestehen?</CardTitle>
              <CardDescription>
                Wählen Sie alle zutreffenden Bereiche aus
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-3">
                {gdbBereiche.map((bereich) => (
                  <button
                    key={bereich.id}
                    onClick={() => toggleBereich(bereich.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      ausgewaehlt.includes(bereich.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        ausgewaehlt.includes(bereich.id)
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-slate-300'
                      }`}>
                        {ausgewaehlt.includes(bereich.id) && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <p className="font-medium">{bereich.label}</p>
                        <p className="text-sm text-slate-500">{bereich.beschreibung}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Ausgewählt: {ausgewaehlt.length} Bereiche</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setAusgewaehlt([])}
                  disabled={ausgewaehlt.length === 0}
                >
                  Zurücksetzen
                </Button>
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
                  onClick={berechneGdB}
                  disabled={ausgewaehlt.length === 0}
                  className="flex-1"
                >
                  Ergebnis berechnen
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Schritt 3: Ergebnis */}
        {step === 3 && ergebnis && (
          <>
            <Card className="border-blue-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>Ihr Ergebnis</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* GdB Anzeige */}
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <p className="text-sm text-blue-600 mb-2">Geschätzter GdB</p>
                  <div className="text-6xl font-bold text-blue-600">
                    {ergebnis.gdb}
                  </div>
                  <p className="text-blue-500 mt-2">
                    (ca. {ergebnis.punkte} Punkte im System)
                  </p>
                </div>

                {/* Vergünstigungen */}
                {ergebnis.verguenstigungen.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Percent className="w-5 h-5 text-green-500" />
                      Mögliche Vergünstigungen
                    </h3>
                    <div className="grid gap-2">
                      {ergebnis.verguenstigungen.map((verg, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>{verg}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hinweis */}
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-amber-800">
                    <strong>Wichtig:</strong> Dies ist nur eine Orientierungshilfe. 
                    Der offizielle GdB wird vom <strong>Versorgungsamt</strong> festgestellt. 
                    Antragstellung empfohlen!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Nächste Schritte */}
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => router.push('/brief-generator?typ=versorgungsamt')}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Antrag schreiben</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm">
                    Automatischen Brief ans Versorgungsamt generieren
                  </p>
                  <Button className="w-full mt-3">
                    Brief erstellen <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Info className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Weitere Infos</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><strong>Frist:</strong> Antrag 6 Monate vor Rentenbeginn</p>
                  <p><strong>Kosten:</strong> Kostenlos</p>
                  <p><strong>Gültigkeit:</strong> Meist 5 Jahre</p>
                  <Button 
                    variant="outline" 
                    className="w-full mt-3"
                    onClick={() => window.open('https://www.versorgungsamt.de', '_blank')}
                  >
                    Versorgungsamt suchen
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Zurück */}
            <div className="flex justify-center mt-6">
              <Button 
                variant="outline" 
                onClick={() => setStep(2)}
                size="lg"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Neue Berechnung
              </Button>
            </div>
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
