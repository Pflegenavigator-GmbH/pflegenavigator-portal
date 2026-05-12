'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Download,
  FileText,
  FileSpreadsheet,
  FileImage,
  Search,
  ArrowLeft,
  ArrowRight,
  File,
  Calendar,
  Filter,
  Tag
} from 'lucide-react';

// Download-Kategorien
const kategorien = [
  { id: 'alle', name: 'Alle', icon: Filter },
  { id: 'antrag', name: 'Anträge', icon: FileText },
  { id: 'checkliste', name: 'Checklisten', icon: FileSpreadsheet },
  { id: 'info', name: 'Info-Material', icon: FileImage },
  { id: 'recht', name: 'Rechtliches', icon: File }
];

// Beispiel-Downloads
const downloads = [
  {
    id: 1,
    titel: 'Pflegegrad-Antrag Muster',
    beschreibung: 'Vollständiger Antrag auf Pflegegrad mit Anleitung',
    kategorie: 'antrag',
    format: 'PDF',
    groesse: '245 KB',
    datum: '27.04.2026',
    sprachen: ['DE', 'EN', 'TR', 'UK', 'PL']
  },
  {
    id: 2,
    titel: 'Widerspruch-Vorlage',
    beschreibung: 'Musterbrief für Widerspruch bei Pflegegrad-Ablehnung',
    kategorie: 'antrag',
    format: 'PDF',
    groesse: '180 KB',
    datum: '27.04.2026',
    sprachen: ['DE', 'EN', 'TR', 'UK', 'PL', 'AR']
  },
  {
    id: 3,
    titel: 'Checkliste Pflegegrad-Begutachtung',
    beschreibung: 'Alles was Sie für den MDK-Besuch benötigen',
    kategorie: 'checkliste',
    format: 'PDF',
    groesse: '156 KB',
    datum: '26.04.2026',
    sprachen: ['DE', 'EN', 'TR']
  },
  {
    id: 4,
    titel: 'Pflege-Leistungsübersicht 2026',
    beschreibung: 'Alle Leistungen nach Pflegegrad (SGB V & XI)',
    kategorie: 'info',
    format: 'PDF',
    groesse: '420 KB',
    datum: '15.04.2026',
    sprachen: ['DE', 'EN']
  },
  {
    id: 5,
    titel: 'Nutzungsanleitung Portal',
    beschreibung: 'Schritt-für-Schritt Anleitung für PflegeNavigator',
    kategorie: 'info',
    format: 'PDF',
    groesse: '890 KB',
    datum: '27.04.2026',
    sprachen: ['DE', 'EN', 'TR', 'UK', 'PL', 'AR', 'RU']
  },
  {
    id: 6,
    titel: 'Datenschutzerklärung (zum Ausdrucken)',
    beschreibung: 'Ihre Rechte nach DSGVO im Überblick',
    kategorie: 'recht',
    format: 'PDF',
    groesse: '125 KB',
    datum: '27.04.2026',
    sprachen: ['DE', 'EN']
  },
  {
    id: 7,
    titel: 'Vorsorgevollmacht Muster',
    beschreibung: 'Vollmacht für Pflege- und Gesundheitsangelegenheiten',
    kategorie: 'recht',
    format: 'PDF',
    groesse: '195 KB',
    datum: '20.04.2026',
    sprachen: ['DE']
  },
  {
    id: 8,
    titel: 'Pflege-Tagebuch Vorlage',
    beschreibung: 'Zum Dokumentieren der Pflegeleistungen',
    kategorie: 'checkliste',
    format: 'PDF',
    groesse: '145 KB',
    datum: '26.04.2026',
    sprachen: ['DE', 'EN', 'TR']
  },
  {
    id: 9,
    titel: 'Leistungskomplexe NBA Übersicht',
    beschreibung: 'Modul 1-6 mit allen Leistungskomplexen',
    kategorie: 'info',
    format: 'PDF',
    groesse: '1.2 MB',
    datum: '15.04.2026',
    sprachen: ['DE']
  },
  {
    id: 10,
    titel: 'Betreuungsgeld-Antrag',
    beschreibung: 'Antrag für pflegende Angehörige',
    kategorie: 'antrag',
    format: 'PDF',
    groesse: '210 KB',
    datum: '25.04.2026',
    sprachen: ['DE', 'EN', 'TR']
  },
  {
    id: 11,
    titel: 'Schwerbehindertenausweis Info',
    beschreibung: 'Antrag und Vorteile des Ausweises',
    kategorie: 'info',
    format: 'PDF',
    groesse: '330 KB',
    datum: '22.04.2026',
    sprachen: ['DE', 'EN']
  },
  {
    id: 12,
    titel: 'Pflegekassen-Vergleich 2026',
    beschreibung: 'Leistungen der verschiedenen Pflegekassen',
    kategorie: 'info',
    format: 'PDF',
    groesse: '445 KB',
    datum: '18.04.2026',
    sprachen: ['DE']
  }
];

export default function DownloadsPage() {
  const router = useRouter();
  const [suchbegriff, setSuchbegriff] = useState('');
  const [aktiveKategorie, setAktiveKategorie] = useState('alle');

  const gefilterteDownloads = downloads.filter(download => {
    const passtKategorie = aktiveKategorie === 'alle' || download.kategorie === aktiveKategorie;
    const passtSuche = suchbegriff === '' || 
      download.titel.toLowerCase().includes(suchbegriff.toLowerCase()) ||
      download.beschreibung.toLowerCase().includes(suchbegriff.toLowerCase());
    return passtKategorie && passtSuche;
  });

  const handleDownload = (downloadId: number) => {
    // Simulierter Download
    alert(`Download wird gestartet...\n(Demo: Datei #${downloadId})`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#20b2aa] to-[#3ddbd0] rounded-2xl shadow-xl mb-6">
            <Download className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#0f2744] mb-4">
            Download-Center
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Alle wichtigen Formulare, Anträge und Informationen zum Download
          </p>
        </div>

        {/* Statistiken */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {kategorien.slice(1).map((kat) => {
            const count = downloads.filter(d => d.kategorie === kat.id).length;
            return (
              <Card key={kat.id} className="text-center">
                <CardContent className="pt-6">
                  <kat.icon className="w-8 h-8 mx-auto text-[#20b2aa] mb-2" />
                  <p className="text-2xl font-bold text-[#0f2744]">{count}</p>
                  <p className="text-sm text-slate-600">{kat.name}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Suchleiste */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <Input
              type="text"
              placeholder="Downloads durchsuchen..."
              value={suchbegriff}
              onChange={(e) => setSuchbegriff(e.target.value)}
              className="pl-14 py-6 text-lg rounded-2xl border-2 border-slate-200 focus:border-[#20b2aa]"
            />
          </div>
        </div>

        {/* Kategorie-Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {kategorien.map((kat) => (
            <Button
              key={kat.id}
              variant={aktiveKategorie === kat.id ? 'default' : 'outline'}
              onClick={() => setAktiveKategorie(kat.id)}
              className={aktiveKategorie === kat.id ? 'bg-[#20b2aa]' : ''}
            >
              <kat.icon className="w-4 h-4 mr-2" />
              {kat.name}
            </Button>
          ))}
        </div>

        {/* Downloads-Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {gefilterteDownloads.map((download) => (
            <Card 
              key={download.id}
              className="hover:shadow-lg transition-shadow group"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">
                        {download.format}
                      </span>
                      <span className="text-xs text-slate-400">{download.groesse}</span>
                    </div>
                    <CardTitle className="text-lg group-hover:text-[#20b2aa] transition-colors">
                      {download.titel}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {download.beschreibung}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Sprachen */}
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-slate-400" />
                  <div className="flex flex-wrap gap-1">
                    {download.sprachen.map((lang) => (
                      <span 
                        key={lang}
                        className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Datum */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>Aktualisiert: {download.datum}</span>
                </div>

                {/* Download-Button */}
                <Button 
                  className="w-full"
                  onClick={() => handleDownload(download.id)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Herunterladen
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Keine Ergebnisse */}
        {gefilterteDownloads.length === 0 && (
          <div className="text-center py-12">
            <File className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              Keine Downloads gefunden
            </h3>
            <p className="text-slate-500">
              Versuchen Sie es mit einem anderen Suchbegriff oder Filter
            </p>
          </div>
        )}

        {/* Hinweis */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Hinweis zu den Dokumenten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 mb-2">
              Alle Downloads stehen kostenlos zur Verfügung. Die Dokumente werden 
              regelmäßig aktualisiert, um aktuelle Rechtslagen und Formulare zu berücksichtigen.
            </p>
            <p className="text-blue-600 text-sm">
              Mehrsprachige Dokumente werden laufend ergänzt. Falls Sie eine Übersetzung 
              in Ihrer Sprache vermissen, kontaktieren Sie uns unter{' '}
              <a href="mailto:info@pflegenavigatoreu.com" className="underline">
                info@pflegenavigatoreu.com
              </a>
            </p>
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
