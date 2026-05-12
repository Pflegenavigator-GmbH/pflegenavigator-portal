'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Newspaper, 
  ArrowRight, 
  ArrowLeft,
  Search,
  Calendar,
  ExternalLink,
  FileText,
  Download,
  Mail,
  Globe
} from 'lucide-react';

// Beispiel-Pressemitteilungen (werden später dynamisch geladen)
const beispielMeldungen = [
  {
    id: 1,
    datum: "27. April 2026",
    titel: "PflegeNavigator EU startet Beta-Phase",
    unterzeile: "Neues Portal macht Pflegegrad-Rechner für alle zugänglich",
    kategorie: "Produktlaunch",
    zusammenfassung: "Das Portal bietet kostenlose Pflegegrad-Berechnung, Widerspruchs-Generatoren und 35 Sprachen."
  },
  {
    id: 2,
    datum: "15. April 2026",
    titel: "Pflegereform 2026: Was ändert sich wirklich?",
    unterzeile: "Analyse der neuen BEEP-Gesetze für Pflegebedürftige",
    kategorie: "Recht",
    zusammenfassung: "Kürzere Abrechnungsfristen, weniger Bürokratie, mehr digitale Angebote."
  }
];

const kategorien = ["Alle", "Produktlaunch", "Recht", "Kooperation", "Statistik", "Migration"];

export default function PresseportalPage() {
  const router = useRouter();
  const [suchbegriff, setSuchbegriff] = useState('');
  const [aktiveKategorie, setAktiveKategorie] = useState('Alle');

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#0f2744] rounded-2xl shadow-xl mb-6">
            <Newspaper className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#0f2744] mb-4">
            Presseportal
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Aktuelle Informationen, Pressemitteilungen und Medienmaterialien
          </p>
        </div>

        {/* Kontakt-Box */}
        <Card className="bg-[#0f2744] text-white mb-10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Mail className="w-8 h-8 text-[#20b2aa]" />
              <div>
                <CardTitle className="text-white">Pressekontakt</CardTitle>
                <CardDescription className="text-blue-200">
                  Für Journalisten, Blogger und Medienvertreter
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Presseanfragen</h3>
                <p className="text-blue-200 mb-2">
                  <strong>E-Mail:</strong> info@pflegenavigatoreu.com
                </p>
                <p className="text-blue-200 mb-2">
                  <strong>Web:</strong> pflegenavigatoreu.com
                </p>
                <p className="text-blue-200">
                  <strong>Adresse:</strong> Heeper Straße 205, 33607 Bielefeld
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Schnell-Infos</h3>
                <ul className="space-y-1 text-blue-200 text-sm">
                  <li>• Gegründet: 2026</li>
                  <li>• Sitz: Bielefeld</li>
                  <li>• Schwerpunkt: Pflege-Navigation</li>
                  <li>• 35 Sprachen verfügbar</li>
                  <li>• DSGVO-konform & EU-basiert</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suchleiste */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <Input
              type="text"
              placeholder="Pressemitteilungen durchsuchen..."
              value={suchbegriff}
              onChange={(e) => setSuchbegriff(e.target.value)}
              className="pl-14 py-6 text-lg rounded-2xl border-2 border-slate-200 focus:border-[#20b2aa]"
            />
          </div>
        </div>

        {/* Kategorien */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {kategorien.map((kat) => (
            <Button
              key={kat}
              variant={aktiveKategorie === kat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAktiveKategorie(kat)}
              className={aktiveKategorie === kat ? 'bg-[#20b2aa]' : ''}
            >
              {kat}
            </Button>
          ))}
        </div>

        {/* Pressemitteilungen */}
        <div className="space-y-6 mb-12">
          <h2 className="text-2xl font-bold text-[#0f2744] flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Aktuelle Pressemitteilungen
          </h2>

          {beispielMeldungen.map((meldung) => (
            <Card 
              key={meldung.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                      <Calendar className="w-4 h-4" />
                      {meldung.datum}
                      <span className="mx-2">•</span>
                      <span className="bg-slate-100 px-2 py-1 rounded text-xs">
                        {meldung.kategorie}
                      </span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-[#20b2aa] transition-colors">
                      {meldung.titel}
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                      {meldung.unterzeile}
                    </CardDescription>
                    <p className="text-slate-600 mt-3">
                      {meldung.zusammenfassung}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="flex-shrink-0"
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}

          {/* Mehr anzeigen */}
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => alert('Archiv wird geladen...')}
          >
            Alle Pressemitteilungen anzeigen
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* Medienmaterialien */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Globe className="w-8 h-8 text-[#20b2aa]" />
              <div>
                <CardTitle>Medienmaterialien</CardTitle>
                <CardDescription>
                  Logos, Bilder und Infografiken zum Download
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: "Logo (PNG)", size: "500 KB", format: "PNG" },
                { name: "Logo (Vektor)", size: "200 KB", format: "SVG" },
                { name: "Factsheet Pflegegrad", size: "1.2 MB", format: "PDF" },
                { name: "Sprecher-Foto", size: "2.1 MB", format: "JPG" },
                { name: "Screenshot Portal", size: "800 KB", format: "PNG" },
                { name: "Infografik NBA", size: "1.5 MB", format: "PDF" }
              ].map((material, index) => (
                <div 
                  key={index}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-[#20b2aa] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded">
                      {material.format}
                    </span>
                  </div>
                  <p className="font-medium text-sm">{material.name}</p>
                  <p className="text-xs text-slate-500">{material.size}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Folgen Sie uns</CardTitle>
            <CardDescription>
              Aktuelle Updates auch auf Social Media
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="outline" 
                onClick={() => window.open('https://instagram.com/pflegenavigator', '_blank')}
              >
                Instagram
                <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('https://facebook.com/pflegenavigator', '_blank')}
              >
                Facebook
                <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('https://tiktok.com/@pflegenavigator', '_blank')}
              >
                TikTok
                <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('https://linkedin.com/company/pflegenavigator', '_blank')}
              >
                LinkedIn
                <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t text-center">
          <Button 
            variant="outline" 
            onClick={() => router.push('/')}
            size="lg"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Zurück zur Startseite
          </Button>
        </footer>
      </div>
    </main>
  );
}
