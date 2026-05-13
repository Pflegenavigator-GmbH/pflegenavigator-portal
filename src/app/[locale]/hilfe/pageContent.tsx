'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  HelpCircle, 
  ArrowRight, 
  MessageCircle, 
  FileText, 
  Calculator,
  Users,
  Phone,
  Search,
  Lightbulb
} from 'lucide-react';

const haeufigeFragen = [
  {
    frage: "Was ist ein Pflegegrad?",
    antwort: "Der Pflegegrad zeigt, wie viel Pflege jemand braucht. Es gibt 5 Stufen (1 bis 5). Je höher, desto mehr Hilfe wird gebraucht."
  },
  {
    frage: "Wie lange dauert ein Antrag?",
    antwort: "Der Medizinische Dienst (MDK) hat bis zu 25 Werktage Zeit. Meist kommt der Bescheid nach 2-4 Wochen."
  },
  {
    frage: "Was ist der Unterschied zu Pflegestützpunkten?",
    antwort: "Pflegestützpunkte beraten persönlich, haben aber oft 2-6 Wochen Wartezeit. Wir sind sofort da - online und kostenlos."
  },
  {
    frage: "Kann ich einen Widerspruch einlegen?",
    antwort: "Ja! Wenn Sie mit dem Bescheid nicht einverstanden sind, haben Sie 1 Monat Zeit für einen Widerspruch."
  },
  {
    frage: "Was kostet der PflegeNavigator?",
    antwort: "Die Beta-Version ist kostenlos. Später kostet der vollständige Service 29 Euro einmalig."
  }
];

const themen = [
  { 
    icon: Calculator, 
    title: "Pflegegrad-Rechner", 
    desc: "Finden Sie heraus, welcher Pflegegrad möglich ist",
    link: "/pflegegrad/start",
    color: "bg-[#20b2aa]"
  },
  { 
    icon: FileText, 
    title: "Widerspruch", 
    desc: "Legen Sie Widerspruch gegen einen Bescheid ein",
    link: "/widerspruch",
    color: "bg-amber-500"
  },
  { 
    icon: MessageCircle, 
    title: "Avatar-Assistent", 
    desc: "Stellen Sie Fragen an unseren KI-Assistenten",
    link: "/avatar-chat",
    color: "bg-purple-500"
  },
  { 
    icon: Users, 
    title: "Unterstützung", 
    desc: "Pflegedienste, Kurse und Beratungsstellen finden",
    link: "/unterstuetzung",
    color: "bg-blue-500"
  },
  { 
    icon: Phone, 
    title: "Hotlines", 
    desc: "Telefonische Hilfe für Pflegefragen",
    link: "#hotlines",
    color: "bg-green-500"
  },
  { 
    icon: Lightbulb, 
    title: "Pflegetipps", 
    desc: "Praktische Tipps für Pflegende Angehörige",
    link: "/tipps",
    color: "bg-pink-500"
  }
];

export default function HilfePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const filteredFaqs = haeufigeFragen.filter(faq => 
    faq.frage.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.antwort.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl mb-6">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#0f2744] mb-4">Hilfe & Beratung</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Finden Sie Antworten oder lassen Sie sich von unserem Assistenten beraten
          </p>
        </div>

        {/* Suchfeld */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <Input
              type="text"
              placeholder="Stellen Sie eine Frage..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-lg rounded-2xl border-2 border-slate-200 focus:border-purple-500"
            />
          </div>
        </div>

        {/* Themen-Grid */}
        <h2 className="text-2xl font-bold text-[#0f2744] mb-6">Themen</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {themen.map((thema, index) => (
            <Card 
              key={index}
              className="cursor-pointer hover:shadow-lg transition-shadow group"
              onClick={() => router.push(thema.link)}
            >
              <CardHeader>
                <div className={`w-12 h-12 ${thema.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <thema.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{thema.title}</CardTitle>
                <CardDescription>{thema.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full group-hover:bg-slate-50">
                  Mehr erfahren <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Häufige Fragen */}
        <h2 className="text-2xl font-bold text-[#0f2744] mb-6">Häufige Fragen</h2>
        <div className="space-y-4 mb-12">
          {filteredFaqs.map((faq, index) => (
            <Card 
              key={index}
              className={`cursor-pointer transition-all ${expandedFaq === index ? 'ring-2 ring-purple-500' : ''}`}
              onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
            >
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{faq.frage}</span>
                  <span className="text-slate-400">{expandedFaq === index ? '−' : '+'}</span>
                </CardTitle>
              </CardHeader>
              {expandedFaq === index && (
                <CardContent className="pt-0">
                  <p className="text-slate-600">{faq.antwort}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Avatar-Assistent CTA */}
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white mb-12">
          <CardHeader>
            <div className="flex items-center gap-4">
              <MessageCircle className="w-12 h-12" />
              <div>
                <CardTitle className="text-2xl text-white">Noch Fragen?</CardTitle>
                <CardDescription className="text-purple-100">
                  Unser Avatar-Assistent hilft Ihnen rund um die Uhr
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => router.push('/pflegegrad/start')}
              className="w-full md:w-auto"
            >
              Zum Pflegegrad-Rechner <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Hotlines */}
        <div id="hotlines" className="mb-12">
          <h2 className="text-2xl font-bold text-[#0f2744] mb-6">Telefonische Hilfe</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Pflegehotline des Bundes</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600 mb-2">030 20 45 28 28</p>
                <p className="text-slate-600">Montag bis Freitag: 9-18 Uhr</p>
                <p className="text-sm text-slate-500 mt-2">Kostenlos aus dem deutschen Festnetz</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Pflegestützpunkt-Finder</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">Finden Sie Pflegestützpunkte in Ihrer Nähe:</p>
                <Button variant="outline" onClick={() => window.open('https://www.pflegestuetzpunkte.org', '_blank')}>
                  Pflegestützpunkte suchen <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Zurück */}
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => router.push('/')} size="lg">
            ← Zurück zur Startseite
          </Button>
        </div>
      </div>
    </main>
  );
}
