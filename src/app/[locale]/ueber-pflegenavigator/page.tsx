'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Globe, 
  Shield, 
  Clock, 
  Users, 
  Award, 
  ArrowRight, 
  CheckCircle2,
  Smartphone,
  FileText,
  MessageCircle,
  QrCode,
  Sparkles,
  Euro
} from 'lucide-react';

const funktionen = [
  {
    icon: Calculator,
    title: "Pflegegrad-Rechner",
    description: "Berechnen Sie Ihren Pflegegrad in 6 einfachen Modulen. Basierend auf SGB XI und MDK-Kriterien.",
    highlight: "15 Minuten • 29€ Beta"
  },
  {
    icon: FileText,
    title: "Widerspruchs-Generator",
    description: "Erstellen Sie professionelle Widerspruchsschreiben gegen Pflegegrad-Bescheide automatisch.",
    highlight: "PDF-Download • Rechtssicher"
  },
  {
    icon: MessageCircle,
    title: "Avatar-Chat mit Sprache",
    description: "Stellen Sie Fragen an unseren virtuellen Assistenten – per Text oder Spracheingabe.",
    highlight: "Kokoro TTS • 35 Sprachen"
  },
  {
    icon: QrCode,
    title: "QR-Code System",
    description: "Teilen Sie Ihren Fall via QR-Code mit Angehörigen oder Pflegekräften.",
    highlight: "Sofortiger Zugriff • Sicher"
  },
  {
    icon: Clock,
    title: "Pflege-Tagebuch",
    description: "Dokumentieren Sie Pflegeleistungen, Medikamente und Verläufe digital.",
    highlight: "Chronologisch • Exportfähig"
  },
  {
    icon: Smartphone,
    title: "Multi-Rechner",
    description: "GdB-Rechner, SGB XIV-Rechner, Kombi-Rechner – alles in einem Portal.",
    highlight: "Aktuelle Beträge 2026"
  }
];

const vorteile = [
  { icon: Shield, text: "DSGVO-konform", subtext: "EU-Server, keine Datenweitergabe" },
  { icon: Globe, text: "35 Sprachen", subtext: "Inkl. Arabisch, Türkisch, Russisch" },
  { icon: Clock, text: "24/7 Verfügbar", subtext: "Keine Wartezeiten" },
  { icon: Users, text: "Für alle", subtext: "Pflegebedürftige, Angehörige, Fachkräfte" },
  { icon: Award, text: "Professionell", subtext: "Aktuelle Gesetze & Beträge" },
  { icon: Euro, text: "Fair gepreist", subtext: "29€ Beta, später Kassenleistung" }
];

const zielgruppen = [
  {
    title: "Pflegebedürftige",
    description: "Selbstständig Ihren Pflegegrad berechnen, Anträge vorbereiten, Rechte kennenlernen.",
    icon: Heart
  },
  {
    title: "Angehörige",
    description: "Unterstützung bei der Organisation, Zugriff auf gemeinsame Fälle via QR-Code.",
    icon: Users
  },
  {
    title: "Pflegefachkräfte",
    description: "Schnelle Einschätzung für Patienten, professionelle Briefe erstellen.",
    icon: Award
  },
  {
    title: "Pflegestützpunkte",
    description: "Beratungsunterstützung in 35 Sprachen, dokumentierte Gesprächsgrundlagen.",
    icon: Globe
  }
];

const soFunktionierts = [
  { step: "1", title: "Fall erstellen", desc: "Generieren Sie einen anonymen Fall-Code (z.B. PF-A3F7B2)" },
  { step: "2", title: "Fragen beantworten", desc: "Durchlaufen Sie 6 Module à 5 Minuten" },
  { step: "3", title: "Ergebnis erhalten", desc: "Einschätzung Ihres Pflegegrads mit Begründung" },
  { step: "4", title: "Nächste Schritte", desc: "Widerspruch einlegen, Antrag vorbereiten oder teilen" }
];

export default function UeberPflegeNavigatorPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-[#0f2744] text-white py-20 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#20b2aa]/20 rounded-full text-[#20b2aa] text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Innovation im Sozialrecht
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Was ist <span className="text-[#20b2aa]">PflegeNavigator</span> EU?
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Ihr digitaler Wegweiser durch den Pflegegrad-Dschungel. 
            Berechnen, dokumentieren, widersprechen – alles an einem Ort, 
            in 35 Sprachen, DSGVO-konform.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => router.push('/pflegegrad/start')}
              className="bg-[#20b2aa] hover:bg-[#1a9891]"
            >
              Jetzt Pflegegrad berechnen
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => router.push('#preis')}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Preise ansehen
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-white/10">
            {[
              { value: "35+", label: "Sprachen" },
              { value: "15min", label: "Pro Berechnung" },
              { value: "29€", label: "Beta-Zugang" },
              { value: "DSGVO", label: "Konform" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-[#20b2aa]">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preisgestaltung - NEU */}
      <section id="preis" className="py-16 px-4 bg-[#20b2aa]/10">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#0f2744] mb-4">
              Transparente Preisgestaltung
            </h2>
            <p className="text-slate-600">
              Keine versteckten Kosten. Kein Abo. Fair und ehrlich.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-[#20b2aa]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#20b2aa]">
                  <Sparkles className="w-5 h-5" />
                  Beta-Phase (jetzt)
                </CardTitle>
                <CardDescription>
                  Für Early Adopter und Testende
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-[#0f2744] mb-2">29€</div>
                <p className="text-slate-600 mb-4">Einmalig, 12 Monate Zugang</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Alle 6 Pflegegrad-Module
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Widerspruchs-Generator
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Pflege-Tagebuch
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    QR-Code System
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    35 Sprachen
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#0f2744] text-white border-[#0f2744]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#20b2aa]">
                  <Award className="w-5 h-5" />
                  Nach DiPA-Zulassung
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Für alle Pflegebedürftigen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-2">0€</div>
                <p className="text-slate-300 mb-4">Für Sie kostenlos</p>
                <div className="bg-white/10 p-3 rounded-lg mb-4">
                  <p className="text-sm text-[#20b2aa] font-medium">
                    Die Krankenkasse übernimmt bis zu 70€/Monat (40€ DiPA + 30€ ergänzende Leistungen ab 2026)
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#20b2aa]" />
                    Selbe Features wie Beta
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#20b2aa]" />
                    Keine Kosten für Sie
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#20b2aa]" />
                    Kassenleistung nach §40a SGB XI (ab Zulassung)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#20b2aa]" />
                    Dauerhafter Zugang
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Hinweis:</strong> Die DiPA-Zulassung (Digitale Pflegeanwendung nach §40a SGB XI) ist beim BfArM beantragt. Nach offizieller Zulassung übernimmt die Pflegekasse bis zu 70€/Monat (40€ für die DiPA + 30€ für ergänzende Unterstützungsleistungen ab 2026). Aktuell (Stand April 2026) sind noch keine DiPAs offiziell zugelassen. Beta-Tester helfen uns, die Anwendung für die Zulassung vorzubereiten.
            </p>
          </div>
        </div>
      </section>

      {/* Das Problem */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0f2744] mb-4">
              Das Problem mit dem Pflegegrad
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Millionen Menschen in Deutschland benötigen Pflege – aber der Weg zum Pflegegrad 
              ist kompliziert, bürokratisch und oft ungerecht.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Komplex", desc: "SGB XI, MDK, Punktesystem – wer soll das verstehen?" },
              { title: "Zeitaufwendig", desc: "Monate Wartezeit auf Termine und Entscheidungen" },
              { title: "Ungerecht", desc: "Zu niedrige Pflegegrade trotz erheblicher Einschränkungen" }
            ].map((item, i) => (
              <Card key={i} className="bg-red-50 border-red-100">
                <CardHeader>
                  <CardTitle className="text-red-800 text-lg">{item.title}</CardTitle>
                  <CardDescription className="text-red-600">{item.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <ArrowRight className="w-8 h-8 text-[#20b2aa] mx-auto rotate-90" />
          </div>

          <div className="text-center mt-8">
            <h3 className="text-2xl font-bold text-[#0f2744] mb-2">
              Unsere Lösung
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              PflegeNavigator EU macht den Pflegegrad transparent, berechenbar und 
              für jeden zugänglich – unabhängig von Sprache, Bildung oder technischen Kenntnissen.
            </p>
          </div>
        </div>
      </section>

      {/* Funktionen */}
      <section id="funktionen" className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0f2744] mb-4">
              Was kann das Portal?
            </h2>
            <p className="text-slate-600">
              Alles, was Sie für Ihre Pflegegrad-Bewertung brauchen – an einem Ort.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {funktionen.map((fkt, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-[#0f2744] rounded-xl group-hover:bg-[#20b2aa] transition-colors">
                      <fkt.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-[#20b2aa] bg-[#20b2aa]/10 px-2 py-1 rounded-full">
                      {fkt.highlight}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{fkt.title}</CardTitle>
                  <CardDescription>{fkt.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* So funktioniert's */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0f2744] mb-4">
              So funktioniert's
            </h2>
            <p className="text-slate-600">
              In 4 einfachen Schritten zu Ihrer Pflegegrad-Einschätzung
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {soFunktionierts.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-[#20b2aa] rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-bold text-[#0f2744] mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vorteile */}
      <section className="py-16 px-4 bg-[#0f2744] text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Warum PflegeNavigator EU?
            </h2>
            <p className="text-slate-300">
              Entwickelt mit und für Pflegebedürftige.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {vorteile.map((vorteil, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                <div className="p-2 bg-[#20b2aa] rounded-lg flex-shrink-0">
                  <vorteil.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">{vorteil.text}</h3>
                  <p className="text-sm text-slate-400">{vorteil.subtext}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zielgruppen */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0f2744] mb-4">
              Für wen ist das Portal?
            </h2>
            <p className="text-slate-600">
              Jeder, der mit Pflege zu tun hat – egal auf welcher Seite.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {zielgruppen.map((ziel, i) => (
              <Card key={i} className="flex items-start gap-4 p-6">
                <div className="p-3 bg-[#20b2aa]/10 rounded-xl flex-shrink-0">
                  <ziel.icon className="w-6 h-6 text-[#20b2aa]" />
                </div>
                <div>
                  <CardTitle className="text-lg mb-2">{ziel.title}</CardTitle>
                  <CardDescription>{ziel.description}</CardDescription>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technik & Datenschutz */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0f2744] mb-4">
              Technik & Datenschutz
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#20b2aa]" />
                  DSGVO-konform
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  EU-Server (Frankfurt)
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Keine Tracking-Cookies
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Anonyme Fall-Codes
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Keine Datenweitergabe
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Selbst-Hosting möglich
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-[#20b2aa]" />
                  Modernste Technologie
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Next.js 16 & React 19
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  PostgreSQL Datenbank
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  KI-Sprachausgabe (Kokoro)
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  QR-Code Integration
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Mobile-First Design
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Über uns */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-[#0f2744] mb-6">
            Über uns
          </h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            PflegeNavigator EU wurde von <strong>Franz Held</strong> gegründet – 
            aus persönlicher Erfahrung mit dem deutschen Pflegesystem. 
            Unser Ziel: Pflegegrad-Einschätzungen für alle zugänglich machen, 
            unabhängig von Sprache, Herkunft oder technischen Kenntnissen.
          </p>
          <div className="bg-slate-50 p-6 rounded-xl inline-block">
            <p className="text-sm text-slate-600 mb-2">
              <strong>PflegeNavigator EU gUG (haftungsbeschränkt)</strong>
            </p>
            <p className="text-sm text-slate-500">
              Heeper Straße 205<br />
              33607 Bielefeld<br />
              info@pflegenavigatoreu.com
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-[#0f2744] to-[#1a3a5c] text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Bereit, Ihren Pflegegrad zu berechnen?
          </h2>
          <p className="text-slate-300 mb-8">
            Beta-Zugang für 29€ – später bis zu 70€ Kassenleistung (40€ DiPA + 30€ Unterstützung).
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => router.push('/pflegegrad/start')}
              className="bg-[#20b2aa] hover:bg-[#1a9891]"
            >
              Jetzt starten
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => router.push('/hilfe')}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Mehr erfahren
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

// Calculator Icon
function Calculator(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
    </svg>
  );
}
