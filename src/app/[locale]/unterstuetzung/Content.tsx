"use client";

import { useState, Suspense, lazy } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Phone, 
  MapPin, 
  Search, 
  Star,
  Users,
  GraduationCap,
  Heart,
  AlertCircle,
  LifeBuoy,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Euro,
  Clock,
  Calendar
} from "lucide-react";

// AvatarChat dynamisch laden
const AvatarChat = lazy(() => import("@/components/AvatarChat"));

// Pflegedienst-Daten
const pflegedienste = [
  { id: 1, name: "Seniorenhilfe München", bewertung: 4.5, stadt: "München", telefon: "089-123456" },
  { id: 2, name: "PflegeTeam Berlin", bewertung: 4.2, stadt: "Berlin", telefon: "030-654321" },
  { id: 3, name: "Ambulante Pflege Hamburg", bewertung: 4.7, stadt: "Hamburg", telefon: "040-789012" },
  { id: 4, name: "Pflegestützpunkt Köln", bewertung: 4.3, stadt: "Köln", telefon: "0221-345678" },
];

// Pflegekurs-Anbieter
const kursAnbieter = [
  { 
    id: 1, 
    name: "Deutsches Rotes Kreuz", 
    ort: "Deutschlandweit", 
    kosten: "0 € (gefördert)",
    dauer: "6 Monate",
    telefon: "0800-123456"
  },
  { 
    id: 2, 
    name: "Johanniter", 
    ort: "Deutschlandweit", 
    kosten: "0 € (gefördert)",
    dauer: "6 Monate",
    telefon: "0800-654321"
  },
  { 
    id: 3, 
    name: "Malteser", 
    ort: "Deutschlandweit", 
    kosten: "0 € (gefördert)",
    dauer: "6 Monate",
    telefon: "0800-789012"
  },
];

// Pflegestützpunkte
const stuetzpunkte = [
  { id: 1, stadt: "München", adresse: "Stachus 1, 80331 München", telefon: "089-12345678" },
  { id: 2, stadt: "Berlin", adresse: "Alexanderplatz 1, 10178 Berlin", telefon: "030-87654321" },
  { id: 3, stadt: "Hamburg", adresse: "Rathausmarkt 1, 20095 Hamburg", telefon: "040-98765432" },
];

// Notfallkontakte
const notfallKontakte = [
  { nummer: "112", name: "Feuerwehr & Rettung", beschreibung: "Immer bei Gefahr" },
  { nummer: "116 117", name: "Ärztlicher Bereitschaftsdienst", beschreibung: "Wenn Arztpraxis zu hat" },
  { nummer: "0800 222 22 22", name: "Telefonseelsorge", beschreibung: "Kostenlose Hilfe bei Sorgen" },
];

export default function UnterstuetzungPage() {
  const [suchOrt, setSuchOrt] = useState("");
  const [expandedKurs, setExpandedKurs] = useState<number | null>(null);
  const [expandedAngehoerige, setExpandedAngehoerige] = useState(false);

  const gefilterteDienste = pflegedienste.filter(d => 
    d.stadt.toLowerCase().includes(suchOrt.toLowerCase()) ||
    suchOrt === ""
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0f2744] text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Unterstützung & Netzwerk</h1>
          <p className="text-[#20b2aa] mt-2">
            Hilfe finden · Kurse · Beratung · Notfallkontakte
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Avatar-Assistent */}
        <section className="lg:grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            {/* Pflegedienst suchen */}
            <Card>
              <CardHeader className="bg-[#0f2744] text-white">
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-6 h-6 text-[#20b2aa]" />
                  Pflegedienst suchen & bewerten
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Finden Sie einen guten Pflegedienst in Ihrer Nähe
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Stadt eingeben (z.B. München)"
                    value={suchOrt}
                    onChange={(e) => setSuchOrt(e.target.value)}
                  />
                  <Button className="bg-[#20b2aa] hover:bg-[#1a9994]">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {gefilterteDienste.map((dienst) => (
                    <div 
                      key={dienst.id} 
                      className="border rounded-lg p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-[#0f2744]">{dienst.name}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {dienst.stadt}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {dienst.telefon}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-5 h-5 fill-current" />
                          <span className="font-bold">{dienst.bewertung}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <p className="text-sm text-gray-500 mt-4">
                  Bewertungen von anderen Nutzern helfen Ihnen bei der Auswahl.
                </p>
              </CardContent>
            </Card>

            {/* Pflegekurse §45 */}
            <Card>
              <CardHeader className="bg-[#0f2744] text-white">
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-[#20b2aa]" />
                  Pflegekurse nach § 45 SGB XI
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Kostenlose Kurse für Pflege-Anfänger
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-[#20b2aa]/10 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-[#0f2744] mb-2">Was ist das?</h3>
                  <p className="text-sm">
                    Wer neu pflegt, muss einen Kurs machen. Der Kurs hilft Ihnen bei der Pflege. 
                    Die Pflegekasse bezahlt den Kurs. Er dauert etwa 6 Monate.
                  </p>
                </div>

                <div className="space-y-3">
                  {kursAnbieter.map((anbieter) => (
                    <div key={anbieter.id} className="border rounded-lg overflow-hidden">
                      <button
                        className="w-full p-4 flex justify-between items-center hover:bg-gray-50 text-left"
                        onClick={() => setExpandedKurs(expandedKurs === anbieter.id ? null : anbieter.id)}
                      >
                        <span className="font-semibold text-[#0f2744]">{anbieter.name}</span>
                        {expandedKurs === anbieter.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                      {expandedKurs === anbieter.id && (
                        <div className="p-4 bg-gray-50 border-t">
                          <div className="space-y-2 text-sm">
                            <p className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              {anbieter.ort}
                            </p>
                            <p className="flex items-center gap-2">
                              <Euro className="w-4 h-4 text-gray-500" />
                              {anbieter.kosten}
                            </p>
                            <p className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              Dauer: {anbieter.dauer}
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-500" />
                              {anbieter.telefon}
                            </p>
                            <Button className="mt-3 w-full bg-[#20b2aa] hover:bg-[#1a9994]">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Anbieter anrufen
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pflegeunterstützungsgeld §44a */}
            <Card>
              <CardHeader className="bg-[#0f2744] text-white">
                <CardTitle className="flex items-center gap-2">
                  <Euro className="w-6 h-6 text-[#20b2aa]" />
                  Pflegeunterstützungsgeld § 44a
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Geld für pflegende Angehörige
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Das bekommen Sie</h3>
                  <p className="text-sm text-green-700 mb-3">
                    Wenn Sie Angehörige pflegen, können Sie Geld bekommen. Das ist das Pflegeunterstützungsgeld.
                  </p>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      Bis zu 240 Euro pro Monat
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      Zusätzlich zum Pflegegeld
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      Ohne Antrag direkt von der Pflegekasse
                    </li>
                  </ul>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Fragen Sie Ihre Pflegekasse. Die zahlt das Geld automatisch.
                </p>
              </CardContent>
            </Card>

            {/* Angehörigen-Leistungen */}
            <Card>
              <CardHeader className="bg-[#0f2744] text-white">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-[#20b2aa]" />
                  Angehörigen-Leistungen
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Entlastung, Beratung und Gruppen
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <button
                    className="w-full p-4 border rounded-lg text-left hover:bg-gray-50 flex justify-between items-center"
                    onClick={() => setExpandedAngehoerige(!expandedAngehoerige)}
                  >
                    <span className="font-semibold text-[#0f2744]">Alle Leistungen anzeigen</span>
                    {expandedAngehoerige ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  
                  {expandedAngehoerige && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                          <LifeBuoy className="w-5 h-5" />
                          Entlastung (Verhinderungspflege)
                        </h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Jemand anderes pflegt für Sie. Sie können Pause machen. 
                          Bis zu 42 Tage pro Jahr möglich.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-semibold text-purple-800 flex items-center gap-2">
                          <MessageCircle className="w-5 h-5" />
                          Beratung
                        </h4>
                        <p className="text-sm text-purple-700 mt-1">
                          Profis beraten Sie kostenlos. Sie helfen bei Fragen und Problemen.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <h4 className="font-semibold text-orange-800 flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Selbsthilfegruppen
                        </h4>
                        <p className="text-sm text-orange-700 mt-1">
                          Treffen Sie andere Pflegende. Austauschen hilft. 
                          Sie sind nicht allein.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pflegestützpunkte & Beratung */}
            <Card>
              <CardHeader className="bg-[#0f2744] text-white">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-[#20b2aa]" />
                  Pflegestützpunkte & Beratungsstellen
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Persönliche Hilfe vor Ort
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {stuetzpunkte.map((stelle) => (
                    <div key={stelle.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-[#0f2744]">{stelle.stadt}</h4>
                      <p className="text-sm text-gray-600 mt-1">{stelle.adresse}</p>
                      <a 
                        href={`tel:${stelle.telefon}`}
                        className="inline-flex items-center gap-2 mt-2 text-[#20b2aa] hover:underline"
                      >
                        <Phone className="w-4 h-4" />
                        {stelle.telefon}
                      </a>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Pflegestützpunkte sind kostenlos und neutral. Sie helfen bei allen Fragen.
                </p>
              </CardContent>
            </Card>

            {/* Notfallkontakte */}
            <Card className="border-red-200">
              <CardHeader className="bg-red-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-6 h-6" />
                  Notfallkontakte
                </CardTitle>
                <CardDescription className="text-red-100">
                  Wichtige Nummern für den Notfall
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {notfallKontakte.map((kontakt, index) => (
                    <a
                      key={index}
                      href={`tel:${kontakt.nummer.replace(/\s/g, "")}`}
                      className="p-4 bg-red-50 rounded-lg hover:bg-red-100 transition text-center"
                    >
                      <p className="text-2xl font-bold text-red-600">{kontakt.nummer}</p>
                      <p className="font-semibold text-red-800 mt-1">{kontakt.name}</p>
                      <p className="text-xs text-red-600 mt-1">{kontakt.beschreibung}</p>
                    </a>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Speichern Sie diese Nummern in Ihrem Handy!
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar mit Avatar */}
          <div className="mt-8 lg:mt-0">
            <div className="sticky top-4">
              <Card>
                <CardHeader className="bg-[#20b2aa] text-white">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageCircle className="w-5 h-5" />
                    Haben Sie Fragen?
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[500px]">
                    <Suspense fallback={<div className="h-full bg-gray-100 animate-pulse flex items-center justify-center">Lädt...</div>}>
                      <AvatarChat 
                        topic="unterstuetzung"
                        initialMessage="Hallo! Ich helfe Ihnen bei Fragen zu Pflegediensten, Kursen oder Notfallkontakten. Was möchten Sie wissen?"
                        showVoiceHints={true}
                      />
                    </Suspense>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-4 p-4 bg-white rounded-lg border text-sm text-gray-600">
                <p className="font-semibold text-[#0f2744] mb-2">Schnelle Fragen:</p>
                <ul className="space-y-1">
                  <li>• "Wie finde ich einen Pflegedienst?"</li>
                  <li>• "Was ist der Pflegekurs §45?"</li>
                  <li>• "Wie melde ich mich zum Kurs an?"</li>
                  <li>• "Was ist Pflegeunterstützungsgeld?"</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 pt-8 border-t">
          <p>PflegeNavigator EU gUG bietet keine Rechtsberatung.</p>
          <p className="mt-1">Informationen von 2026 · Alle Angaben ohne Gewähr</p>
        </footer>
      </main>
    </div>
  );
}
