'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft,
  Clock,
  MapPin,
  Shield,
  Heart,
  Stethoscope,
  Users,
  FileText,
  ExternalLink
} from 'lucide-react';

const notfallNummern = [
  {
    kategorie: "Rettung & Notarzt",
    nummer: "112",
    beschreibung: "Notruf – Rettungsdienst, Feuerwehr, Polizei",
    icon: AlertTriangle,
    farbe: "bg-red-500",
    wichtig: true
  },
  {
    kategorie: "Ärztlicher Bereitschaftsdienst",
    nummer: "116 117",
    beschreibung: "Wenn der Hausarzt nicht erreichbar ist",
    icon: Stethoscope,
    farbe: "bg-blue-500",
    wichtig: true
  },
  {
    kategorie: "Giftnotruf",
    nummer: "030 19240",
    beschreibung: "Bei Vergiftungen – 24h erreichbar",
    icon: Shield,
    farbe: "bg-purple-500",
    wichtig: false
  }
];

const pflegeHotlines = [
  {
    name: "Pflegehotline des Bundes",
    nummer: "030 20 45 28 28",
    zeiten: "Mo-Fr: 9-18 Uhr",
    kostenlos: true,
    beschreibung: "Beratung zu Pflegegraden, Leistungen, Anträgen"
  },
  {
    name: "MDK Pflegeberatung",
    nummer: "0800 101 77 00",
    zeiten: "Mo-Fr: 8-20 Uhr",
    kostenlos: true,
    beschreibung: "Medizinischer Dienst – Pflegegrad-Fragen"
  },
  {
    name: "Pflegekasse-Notfallnummer",
    nummer: "[Aus Versicherungskarte]",
    zeiten: "24h (bei Notwendigkeit)",
    kostenlos: true,
    beschreibung: "Pflegebedarf sofort – AOK, BARMER, etc."
  }
];

const beratungsstellen = [
  {
    name: "Pflegestützpunkt",
    beschreibung: "Persönliche Beratung vor Ort",
    link: "https://www.pflegestuetzpunkte.org",
    icon: MapPin
  },
  {
    name: "Verbraucherzentrale",
    beschreibung: "Rechtsberatung zu Pflege",
    link: "https://www.verbraucherzentrale.de",
    icon: FileText
  },
  {
    name: "Senioren-Union",
    beschreibung: "Hilfe bei Behördengängen",
    link: "https://www.seniorenunion.de",
    icon: Users
  }
];

export default function NotfallkontaktPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500 rounded-2xl shadow-xl mb-6">
            <Phone className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#0f2744] mb-4">
            Notfall & Hilfe
          </h1>
          <p className="text-xl text-slate-600">
            Wichtige Nummern und Kontakte für Pflege-Notfälle
          </p>
        </div>

        {/* Wichtige Nummern */}
        <Card className="border-red-200 bg-red-50 mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <CardTitle className="text-red-800">Wichtige Notrufnummern</CardTitle>
                <CardDescription className="text-red-700">
                  Immer erreichbar – 24 Stunden, 365 Tage
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {notfallNummern.map((notfall, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-xl ${notfall.farbe} text-white`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <notfall.icon className="w-6 h-6" />
                    <span className="font-semibold">{notfall.kategorie}</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">{notfall.nummer}</div>
                  <p className="text-sm opacity-90">{notfall.beschreibung}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pflege-Hotlines */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-[#20b2aa]" />
              <div>
                <CardTitle>Pflege-Spezial-Hotlines</CardTitle>
                <CardDescription>
                  Professionelle Beratung zu Pflegethemen
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pflegeHotlines.map((hotline, index) => (
                <div 
                  key={index}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-[#0f2744]">{hotline.name}</h3>
                      <p className="text-slate-600 text-sm mt-1">{hotline.beschreibung}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {hotline.zeiten}
                        </span>
                        {hotline.kostenlos && (
                          <span className="text-green-600 font-medium">Kostenlos</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#20b2aa]">
                        {hotline.nummer}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Beratungsstellen */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-[#20b2aa]" />
              <div>
                <CardTitle>Beratungsstellen vor Ort</CardTitle>
                <CardDescription>
                  Persönliche Hilfe in Ihrer Nähe
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {beratungsstellen.map((stelle, index) => (
                <div 
                  key={index}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-[#20b2aa] transition-colors cursor-pointer"
                  onClick={() => window.open(stelle.link, '_blank')}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#20b2aa] rounded-lg flex items-center justify-center">
                      <stelle.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-[#0f2744]">{stelle.name}</h3>
                  </div>
                  <p className="text-sm text-slate-600">{stelle.beschreibung}</p>
                  <div className="flex items-center gap-1 mt-2 text-[#20b2aa] text-sm">
                    <ExternalLink className="w-4 h-4" />
                    <span>Zur Website</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Wichtiger Hinweis */}
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <CardTitle className="text-amber-800">Wichtiger Hinweis</CardTitle>
                <CardDescription className="text-amber-700">
                  PflegeNavigator EU ist kein Notdienst
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-amber-800">
              Bei medizinischen Notfällen wählen Sie immer die <strong>112</strong> oder 
              den <strong>ärztlichen Bereitschaftsdienst 116 117</strong>. PflegeNavigator EU 
              bietet keine medizinische Beratung und keinen Notfalldienst.
            </p>
            <p className="text-amber-700 mt-4 text-sm">
              Bei Fragen zu Pflegegraden, Anträgen oder Widersprüchen erreichen Sie uns 
              unter <strong>info@pflegenavigatoreu.com</strong> – Antwort innerhalb von 24 Stunden.
            </p>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-center mt-10">
          <Button 
            variant="outline" 
            onClick={() => router.push('/')}
            size="lg"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Zurück zur Startseite
          </Button>
        </div>
      </div>
    </main>
  );
}
