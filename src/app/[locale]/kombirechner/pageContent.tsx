'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calculator, 
  ArrowRight, 
  ArrowLeft,
  Info,
  Check,
  Euro,
  Home,
  Clock,
  Users
} from 'lucide-react';
import { PFLEGEGELD_2026 } from '@/lib/aktuelle-daten-2026';

interface KombiOption {
  name: string;
  beschreibung: string;
  prozent: number;
  emoji: string;
}

const pflegegeldOptionen: KombiOption[] = [
  { name: "Pflegegeld", beschreibung: "Geld für Angehörige", prozent: 100, emoji: "💶" },
  { name: "Sachleistungen", beschreibung: "Pflegedienst", prozent: 50, emoji: "🏥" },
  { name: "Tagespflege", beschreibung: "Tagsüber betreut", prozent: 50, emoji: "☀️" },
  { name: "Kurzzeitpflege", beschreibung: "Wenige Wochen", prozent: 50, emoji: "⏱️" },
  { name: "Verhinderungspflege", beschreibung: "Urlaub vom Pflegen", prozent: 50, emoji: "🌴" },
  { name: "Nachtpflege", beschreibung: "Nachts betreut", prozent: 25, emoji: "🌙" },
];

const pflegegrade = [
  { pg: 2, bezeichnung: "Pflegegrad 2", basis: PFLEGEGELD_2026.pflegegeld.pg2 },
  { pg: 3, bezeichnung: "Pflegegrad 3", basis: PFLEGEGELD_2026.pflegegeld.pg3 },
  { pg: 4, bezeichnung: "Pflegegrad 4", basis: PFLEGEGELD_2026.pflegegeld.pg4 },
  { pg: 5, bezeichnung: "Pflegegrad 5", basis: PFLEGEGELD_2026.pflegegeld.pg5 },
];

export default function KombiRechnerPage() {
  const router = useRouter();
  const [selectedPG, setSelectedPG] = useState(3);
  const [gewaehlteOptionen, setGewaehlteOptionen] = useState<string[]>(["Pflegegeld"]);
  const [showInfo, setShowInfo] = useState(true);

  const basisBetrag = pflegegrade.find(p => p.pg === selectedPG)?.basis || 599;
  const maxBetrag = 1848; // §38 Höchstbetrag

  const berechneSumme = () => {
    let summe = 0;
    gewaehlteOptionen.forEach(optionName => {
      const option = pflegegeldOptionen.find(o => o.name === optionName);
      if (option) {
        summe += basisBetrag * (option.prozent / 100);
      }
    });
    return summe;
  };

  const aktuelleSumme = berechneSumme();
  const restBudget = Math.max(0, maxBetrag - aktuelleSumme);
  const ueberschritten = aktuelleSumme > maxBetrag;

  const toggleOption = (name: string) => {
    if (gewaehlteOptionen.includes(name)) {
      // Pflegegeld muss immer mindestens eine Option bleiben
      if (gewaehlteOptionen.length > 1) {
        setGewaehlteOptionen(gewaehlteOptionen.filter(o => o !== name));
      }
    } else {
      setGewaehlteOptionen([...gewaehlteOptionen, name]);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f2744] to-[#1a365d] py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#20b2aa] rounded-2xl shadow-xl mb-6">
            <Calculator className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Kombinations-Rechner §38
          </h1>
          <p className="text-xl text-blue-200">
            Pflegegeld + Sachleistungen clever kombinieren
          </p>
        </div>

        {/* Info-Box (einmalig) */}
        {showInfo && (
          <Card className="bg-amber-50 border-amber-200 mb-8">
            <CardHeader>
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <CardTitle className="text-lg text-amber-800">
                    Was ist die Kombinationsleistung?
                  </CardTitle>
                  <CardDescription className="text-amber-700 mt-2">
                    Ab Pflegegrad 2 können Sie Pflegegeld und Sachleistungen (Pflegedienst) 
                    mischen. Wichtig: Der Höchstbetrag ist begrenzt. Dieser Rechner zeigt Ihnen,
                    wie Sie optimal kombinieren.
                  </CardDescription>
                </div>
                <button 
                  onClick={() => setShowInfo(false)}
                  className="text-amber-400 hover:text-amber-600"
                >
                  ✕
                </button>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Pflegegrad Auswahl */}
        <Card className="bg-white/10 border-white/20 text-white mb-8">
          <CardHeader>
            <CardTitle className="text-white">Welcher Pflegegrad?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {pflegegrade.map((pg) => (
                <button
                  key={pg.pg}
                  onClick={() => setSelectedPG(pg.pg)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedPG === pg.pg
                      ? 'border-[#20b2aa] bg-[#20b2aa]/20'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="text-2xl font-bold">{pg.pg}</div>
                  <div className="text-sm opacity-80">{pg.bezeichnung}</div>
                  <div className="text-xs mt-1 opacity-60">
                    Basis: {pg.basis}€
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Optionen */}
        <Card className="bg-white mb-8">
          <CardHeader>
            <CardTitle>Wählen Sie Ihre Leistungen</CardTitle>
            <CardDescription>
              Klicken Sie auf die Optionen, die Sie nutzen möchten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {pflegegeldOptionen.map((option) => (
                <button
                  key={option.name}
                  onClick={() => toggleOption(option.name)}
                  disabled={option.name === "Pflegegeld" && gewaehlteOptionen.length === 1}
                  className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                    gewaehlteOptionen.includes(option.name)
                      ? 'border-[#20b2aa] bg-[#20b2aa]/5'
                      : 'border-slate-200 hover:border-slate-300'
                  } ${option.name === "Pflegegeld" && gewaehlteOptionen.length === 1 ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{option.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-[#0f2744]">{option.name}</div>
                      <div className="text-sm text-slate-600">{option.beschreibung}</div>
                      <div className="text-sm font-medium text-[#20b2aa] mt-1">
                        {option.prozent === 100 ? 'Voll (100%)' : `Teil (${option.prozent}%)`}
                      </div>
                    </div>
                    {gewaehlteOptionen.includes(option.name) && (
                      <div className="w-6 h-6 bg-[#20b2aa] rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ergebnis */}
        <Card className={`${ueberschritten ? 'bg-red-50 border-red-200' : 'bg-white'} mb-8`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Euro className="w-6 h-6" />
              Ihre Berechnung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summe */}
            <div className="text-center">
              <div className={`text-5xl font-bold ${ueberschritten ? 'text-red-600' : 'text-[#0f2744]'}`}>
                {aktuelleSumme.toFixed(2)} €
              </div>
              <div className="text-slate-500 mt-2">
                von maximal {maxBetrag} € möglich
              </div>
            </div>

            {/* Fortschrittsbalken */}
            <div className="w-full bg-slate-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full transition-all ${
                  ueberschritten ? 'bg-red-500' : 'bg-[#20b2aa]'
                }`}
                style={{ width: `${Math.min(100, (aktuelleSumme / maxBetrag) * 100)}%` }}
              />
            </div>

            {/* Status */}
            {ueberschritten ? (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
                <strong>⚠️ Zu viel ausgewählt!</strong><br />
                Sie haben {(aktuelleSumme - maxBetrag).toFixed(2)} € zu viel gewählt. 
                Bitte reduzieren Sie eine Option.
              </div>
            ) : restBudget > 0 ? (
              <div className="bg-blue-50 text-blue-700 p-4 rounded-lg">
                <strong>💡 Tipp:</strong> Sie haben noch {restBudget.toFixed(2)} € übrig. 
                Sie könnten noch mehr Sachleistungen (Pflegedienst) nutzen.
              </div>
            ) : (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center">
                <strong>✅ Optimal!</strong> Sie nutzen das volle Budget aus.
              </div>
            )}

            {/* Details */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Ihre Auswahl:</h4>
              <ul className="space-y-2">
                {gewaehlteOptionen.map((name) => {
                  const option = pflegegeldOptionen.find(o => o.name === name);
                  const betrag = option ? basisBetrag * (option.prozent / 100) : 0;
                  return (
                    <li key={name} className="flex justify-between text-sm">
                      <span>{option?.emoji} {name}</span>
                      <span className="font-medium">{betrag.toFixed(2)} €</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Tipps */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <Home className="w-8 h-8 text-[#20b2aa] mb-2" />
              <CardTitle className="text-lg text-white">Mehr Pflegedienst?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-200 text-sm">
                Wenn Sie mehr Pflege brauchen, nutzen Sie auch die Sachleistungen. 
                Der Pflegedienst kommt zu Ihnen nach Hause.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <Clock className="w-8 h-8 text-[#20b2aa] mb-2" />
              <CardTitle className="text-lg text-white">Verhinderungspflege</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-200 text-sm">
                Für Ihren Urlaub: Bis zu 42 Tage im Jahr kann jemand anderes pflegen. 
                Die Pflegekasse zahlt.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <Users className="w-8 h-8 text-[#20b2aa] mb-2" />
              <CardTitle className="text-lg text-white">Tagespflege</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-200 text-sm">
                Tagsüber betreut, abends zu Hause. Ideal für Familien, 
                die tagsüber arbeiten.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => router.push('/pflegegrad/ergebnis')}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Zurück zum Ergebnis
          </Button>

          <Button 
            onClick={() => router.push('/unterstuetzung')}
            className="bg-[#20b2aa] hover:bg-[#3ddbd0]"
          >
            Pflegedienste finden
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* Disclaimer */}
        <footer className="mt-12 pt-6 border-t border-white/20 text-center">
          <p className="text-blue-300 text-sm">
            <strong>Hinweis:</strong> Diese Berechnung ist eine Orientierungshilfe. 
            Die genauen Beträge hängen von Ihrer Pflegekasse ab.
          </p>
        </footer>
      </div>
    </main>
  );
}
