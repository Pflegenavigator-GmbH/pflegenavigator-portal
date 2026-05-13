'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Stethoscope, 
  ClipboardList, 
  Brain, 
  FileCheck, 
  Users, 
  Calendar,
  ExternalLink,
  AlertCircle,
  Info,
  Pill,
  Shield,
  MessageCircle,
  GraduationCap,
  BookOpen,
  Smartphone
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  provider: string;
  description: string;
  features: string[];
  url: string;
  category: 'documentation' | 'ai' | 'planning' | 'safety' | 'medication' | 'communication' | 'education' | 'legal';
  isExternal: boolean;
}

const tools: Tool[] = [
  // KI-Tools
  {
    id: 'pflegegpt',
    name: 'PflegeGPT',
    provider: 'DaphOS',
    description: 'KI-Assistent für die Pflege. Erstellt Pflegepläne, fasst Pflegedokumentation zusammen und erkennt nicht erfasste Aufgaben.',
    features: [
      'Automatische Pflegeplan-Erstellung',
      'Zusammenfassung von Pflegedokumentation',
      'Erkennung nicht erfasster Aufgaben',
      'Stimmungsanalyse der Patienten'
    ],
    url: 'https://www.daphos.ai/pflegegpt/',
    category: 'ai',
    isExternal: true
  },
  {
    id: 'curasoft-ki',
    name: 'CuraSoft KI',
    provider: 'CuraSoft',
    description: 'KI-gestützte Dokumentationshilfe für Pflegedienste. Spart Zeit bei der täglichen Dokumentation.',
    features: [
      'Textvorschläge für Pflegeberichte',
      'Automatische Formulierungen',
      'SIS-konforme Dokumentation',
      'Integration mit CuraSoft'
    ],
    url: 'https://www.curasoft.de/ki/',
    category: 'ai',
    isExternal: true
  },
  {
    id: 'dexter-health',
    name: 'Dexter Health',
    provider: 'Dexter Health',
    description: 'KI-basierte Sprachdokumentation und sichere Kommunikation für Pflegeheime.',
    features: [
      'Sprachbasierte Dokumentation',
      'SIS-Assistent',
      'Schichtplanung',
      'Automatische Protokolle'
    ],
    url: 'https://www.dexter-health.com/',
    category: 'ai',
    isExternal: true
  },
  {
    id: 'viki-pro',
    name: 'ViKI pro',
    provider: 'Fraunhofer ITWM',
    description: 'KI-basierte Prozessgestaltung in der Langzeitpflege. Forschungsprojekt für effizientere Pflegeabläufe.',
    features: [
      'Prozessoptimierung durch KI',
      'Ressourcenplanung',
      'Forschungsbasiert',
      'Langzeitpflege-Fokus'
    ],
    url: 'https://www.itwm.fraunhofer.de/pflege-ki',
    category: 'ai',
    isExternal: true
  },
  // Pflegedokumentation
  {
    id: 'klarocare',
    name: 'KlaroCare',
    provider: 'KlaroCare',
    description: 'Pflegedokumentation Software mit Echtzeit-Erfassung und reduziertem Papierkram.',
    features: [
      'Echtzeit-Dokumentation',
      'Mobile App',
      'Pflegeplanung',
      'Qualitätsmanagement'
    ],
    url: 'https://klaro.care/',
    category: 'documentation',
    isExternal: true
  },
  {
    id: 'carecloud',
    name: 'CareCloud',
    provider: 'CareCloud',
    description: 'Intelligente Pflegedokumentation aus der Praxis für die Praxis.',
    features: [
      'Automatische Verknüpfungen',
      'Intelligente Menüführung',
      'Pflegeprozess-Begleitung',
      'Cloud-basiert'
    ],
    url: 'https://www.carecloud.de/',
    category: 'documentation',
    isExternal: true
  },
  {
    id: 'md-ambulant',
    name: 'MD Ambulant',
    provider: 'MediFox Dan',
    description: 'Pflegedokumentationssoftware für ambulante Pflege. Lückenlose Dokumentation.',
    features: [
      'Ambulante Pflege',
      'Betreuungsdokumentation',
      'Abrechnung',
      'Qualitätsprüfung'
    ],
    url: 'https://www.medifoxdan.de/',
    category: 'documentation',
    isExternal: true
  },
  {
    id: 'ncara',
    name: 'nCara',
    provider: 'nCara',
    description: 'Software für ambulante Pflegedienste. Fokus auf effiziente Dokumentation.',
    features: [
      'Zeitersparnis bei Dokumentation',
      'Mobile Lösung',
      'Pflegeplanung',
      'Tourenoptimierung'
    ],
    url: 'https://www.ncara.de/',
    category: 'documentation',
    isExternal: true
  },
  {
    id: 'curasoft',
    name: 'CuraSoft',
    provider: 'CuraSoft',
    description: 'Komplettpaket für digitale Verwaltung in Pflegediensten.',
    features: [
      'Digitale Verwaltung',
      'Schnelle Einarbeitung',
      'Übersichtliche Oberfläche',
      'Wenig Papierkram'
    ],
    url: 'https://www.curasoft.de/',
    category: 'documentation',
    isExternal: true
  },
  // Dienstplanung
  {
    id: 'cgm-viyu',
    name: 'CGM VIYU',
    provider: 'CGM',
    description: 'Cloud-Software für ambulante Pflegedienste. Digitale Dokumentation und Planung.',
    features: [
      'Tourenplanung',
      'Digitale Dokumentation',
      'Telematikinfrastruktur',
      'Mobile App'
    ],
    url: 'https://www.cgm.com/deu_de/loesungen/pflegedienst.html',
    category: 'planning',
    isExternal: true
  },
  {
    id: 'myneva-dm7',
    name: 'myneva.dm7',
    provider: 'myneva',
    description: 'Pflegedokumentation und Einsatzplanung in einer Plattform.',
    features: [
      'Dienstplanung',
      'Tourenplanung',
      'Abrechnung',
      'Pflegeplanung'
    ],
    url: 'https://www.myneva.eu/',
    category: 'planning',
    isExternal: true
  },
  {
    id: 'acodia-care',
    name: 'Acodia Care',
    provider: 'Acodia',
    description: 'Software für Tages- und Nachtpflege. 30 Tage kostenlos testen.',
    features: [
      'Tagespflege',
      'Nachtpflege',
      'Dokumentation',
      'Abrechnung'
    ],
    url: 'https://www.acodia.de/',
    category: 'planning',
    isExternal: true
  },
  {
    id: 'komda',
    name: 'Komda',
    provider: 'Komda Software',
    description: 'Software für Pflegedokumentation und Planung.',
    features: [
      'Pflegedokumentation',
      'Dienstplanung',
      'Qualitätsmanagement',
      'Abrechnung'
    ],
    url: 'https://komda-software.de/',
    category: 'planning',
    isExternal: true
  },
  // Notfall & Sicherheit
  {
    id: 'hausnotruf-sturz',
    name: 'Hausnotruf mit Sturzerkennung',
    provider: 'Verschiedene Anbieter',
    description: 'Notrufsysteme mit automatischer Sturzerkennung für Senioren.',
    features: [
      'Automatische Sturzerkennung',
      'Sofortige Alarmierung',
      'GPS-Ortung',
      'Wasserdicht'
    ],
    url: 'https://www.pflege-panorama.de/ratgeber/hausnotruf-mit-sturzerkennung/',
    category: 'safety',
    isExternal: true
  },
  {
    id: 'asb-schockt',
    name: 'ASB-SCHOCKT',
    provider: 'ASB',
    description: 'App für Ersthelfer bei Herz-Kreislauf-Stillstand. Lebensretter-Alarmierung.',
    features: [
      'Ersthelfer-Alarmierung',
      'Herz-Kreislauf-Stillstand',
      'GPS-gestützt',
      'Lebensretter-Netzwerk'
    ],
    url: 'https://asb-schockt.de/',
    category: 'safety',
    isExternal: true
  },
  {
    id: 'corhelper',
    name: 'Corhelper',
    provider: 'umlaut/Accenture',
    description: 'Intelligente Alarmierungs-App für Herzensretter.',
    features: [
      'Herzensretter-Alarmierung',
      'Intelligente Steuerung',
      'First Responder',
      'Rettungskette'
    ],
    url: 'https://www.corhelper.de/',
    category: 'safety',
    isExternal: true
  },
  // Medikamentenmanagement
  {
    id: 'mytherapy',
    name: 'MyTherapy',
    provider: 'SmartPatient',
    description: 'Medikamenten-App für sichere Einnahme und Dokumentation.',
    features: [
      'Erinnerungen',
      'Einnahme-Tracking',
      'Berichte für Ärzte',
      'Kostenlos'
    ],
    url: 'https://www.mytherapyapp.com/de',
    category: 'medication',
    isExternal: true
  },
  {
    id: 'mediteo',
    name: 'mediteo',
    provider: 'mediteo',
    description: 'Arzneimittel-App für pünktliche Einnahme.',
    features: [
      'Einnahmeerinnerung',
      'iOS & Android',
      'Web-App',
      'Kostenlos'
    ],
    url: 'https://mediteo.de/',
    category: 'medication',
    isExternal: true
  },
  {
    id: 'drug-pin',
    name: 'Drug-PIN',
    provider: 'Drug-PIN',
    description: 'Medikationsplan-App mit QR-Code-Scan.',
    features: [
      'QR-Code Scan',
      'Bundeseinheitlicher Medikationsplan',
      'iOS & Android',
      'Patientenfreundlich'
    ],
    url: 'https://drug-pin.de/',
    category: 'medication',
    isExternal: true
  },
  {
    id: 'cleartime',
    name: 'clearTime Care',
    provider: 'clearTime',
    description: 'Pflege-Koordination für Familien. Termine, Medikamente, Absprachen.',
    features: [
      'Terminverwaltung',
      'Medikamenten-Tracking',
      'Familien-Koordination',
      'Kostenlos'
    ],
    url: 'https://cleartime.care/',
    category: 'medication',
    isExternal: true
  },
  // Kommunikation
  {
    id: 'ti-messenger',
    name: 'TI-Messenger',
    provider: 'Gematik',
    description: 'Sichere Kommunikation in der Pflege über die Telematikinfrastruktur.',
    features: [
      'Ende-zu-Ende-Verschlüsselung',
      'TI-konform',
      'Praxis-Pflege-Kommunikation',
      'KIM-Integration'
    ],
    url: 'https://www.kompetenzzentrum-pflege.digital/digitale-anwendungen/kommunikation-im-medizinwesen-kim',
    category: 'communication',
    isExternal: true
  },
  {
    id: 'herzensapp',
    name: 'HerzensApp',
    provider: 'HerzensApp',
    description: 'Technologie für Kommunikation zwischen Familien und Pflegekräften.',
    features: [
      'Familien-Pflege-Chat',
      'Informationsaustausch',
      'Transparenz',
      'Dokumentation'
    ],
    url: 'https://herzens.app/',
    category: 'communication',
    isExternal: true
  },
  {
    id: 'pflegepur',
    name: 'PflegePur',
    provider: 'PflegePur',
    description: 'Kostenlose App für pflegende Familien. Ende-zu-Ende verschlüsselt.',
    features: [
      'Pflege-Koordination',
      'Verschlüsselt',
      'Kein App-Store nötig',
      'Kostenlos'
    ],
    url: 'https://www.pflegepur.de/zuhause',
    category: 'communication',
    isExternal: true
  },
  // Weiterbildung
  {
    id: 'mbd-online',
    name: 'MBD Online',
    provider: 'MBD',
    description: 'Online-Weiterbildung für Pflegefachkräfte. Verantwortliche Pflegefachkraft (VPF).',
    features: [
      'VPF-Weiterbildung',
      'Online-Kurse',
      'Zertifiziert',
      'Berufsbegleitend'
    ],
    url: 'https://www.mbd-online.de/',
    category: 'education',
    isExternal: true
  },
  {
    id: 'kenbi-akademie',
    name: 'Kenbi Akademie',
    provider: 'Kenbi',
    description: 'Weiterbildung im Wundmanagement und Pflegedienstleitung.',
    features: [
      'Wundmanagement',
      'Pflegedienstleitung (PDL)',
      'AZAV-zertifiziert',
      'Online-Studium'
    ],
    url: 'https://akademie.kenbi.de/',
    category: 'education',
    isExternal: true
  },
  {
    id: 'pflegexpert',
    name: 'PflegeXpert Akademie',
    provider: 'PflegeXpert',
    description: 'PDL Weiterbildung online nach § 71 SGB XI.',
    features: [
      'PDL-Zertifizierung',
      'Online-Studium',
      'Praxisnah',
      'Betreuung'
    ],
    url: 'https://www.pflegexpert-akademie.de/',
    category: 'education',
    isExternal: true
  },
  {
    id: 'hoeher-akademie',
    name: 'HÖHER Akademie',
    provider: 'HÖHER',
    description: 'Fachkraft für Leitungsaufgaben in Pflegeeinrichtungen.',
    features: [
      'Leitungsaufgaben',
      '150.000 Pflegekräfte',
      'Erfahrungswerte',
      'Zertifiziert'
    ],
    url: 'https://www.hoeher-akademie.de/',
    category: 'education',
    isExternal: true
  },
  // Leitlinien & Recht
  {
    id: 'mds-richtlinien',
    name: 'MDS-Richtlinien',
    provider: 'MDS Bund',
    description: 'Richtlinien des Medizinischen Dienstes Bund zur Pflegebegutachtung.',
    features: [
      'Pflegebegutachtung',
      'Neue Pflegebedürftigkeit',
      'MDS-Regeln',
      'Rechtssicher'
    ],
    url: 'https://www.mds-ev.de/richtlinien-publikationen/',
    category: 'legal',
    isExternal: true
  },
  {
    id: 'pflegeleitlinien-zqp',
    name: 'Pflegeleitlinien ZQP',
    provider: 'ZQP',
    description: 'Übersicht pflegerische Leitlinien und Standards. Recherche-Portal.',
    features: [
      'Leitlinien-Recherche',
      'Pflege-Standards',
      'HTA-Berichte',
      'Aktuell'
    ],
    url: 'https://lls.zqp.de/',
    category: 'legal',
    isExternal: true
  },
  {
    id: 'pflegeleistungsrechner',
    name: 'Pflege-Leistungs-Rechner',
    provider: 'Pflege-Leistungs-Rechner',
    description: 'App für transparente Verwendung der Pflegeleistungen.',
    features: [
      'Leistungs-Übersicht',
      'Transparenz',
      'Pflegeberatung',
      'Angehörigen-App'
    ],
    url: 'https://pflegeleistungsrechner.de/',
    category: 'legal',
    isExternal: true
  }
];

export default function PflegekraeftePage() {
  const router = useRouter();

  const categoryLabels: Record<string, string> = {
    documentation: 'Pflegedokumentation',
    ai: 'KI-Tools',
    planning: 'Dienstplanung',
    safety: 'Notfall & Sicherheit',
    medication: 'Medikamentenmanagement',
    communication: 'Kommunikation',
    education: 'Weiterbildung',
    legal: 'Leitlinien & Recht'
  };

  const categoryColors: Record<string, string> = {
    documentation: 'bg-blue-500',
    ai: 'bg-amber-500',
    planning: 'bg-green-500',
    safety: 'bg-red-500',
    medication: 'bg-purple-500',
    communication: 'bg-cyan-500',
    education: 'bg-orange-500',
    legal: 'bg-slate-500'
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    documentation: <ClipboardList className="w-8 h-8 text-blue-400" />,
    ai: <Brain className="w-8 h-8 text-amber-400" />,
    planning: <Calendar className="w-8 h-8 text-green-400" />,
    safety: <Shield className="w-8 h-8 text-red-400" />,
    medication: <Pill className="w-8 h-8 text-purple-400" />,
    communication: <MessageCircle className="w-8 h-8 text-cyan-400" />,
    education: <GraduationCap className="w-8 h-8 text-orange-400" />,
    legal: <BookOpen className="w-8 h-8 text-slate-400" />
  };

  // Gruppiere Tools nach Kategorie
  const toolsByCategory = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f2744] to-[#1a365d] py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="text-blue-300 hover:text-white mb-4"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Startseite
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#20b2aa] to-[#3ddbd0] rounded-2xl flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Für Pflegekräfte & Pflegedienste
              </h1>
              <p className="text-blue-200 text-lg">
                {tools.length}+ Tools und Ressourcen für den professionellen Pflege-Alltag
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-8 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-amber-200 text-sm">
            <strong>Externe Tools:</strong> Die folgenden Tools werden von Drittanbietern bereitgestellt. 
            PflegeNavigator EU übernimmt keine Haftung für deren Inhalt oder Datenschutzpraktiken. 
            Bitte prüfen Sie die jeweiligen AGB und Datenschutzbestimmungen vor Nutzung.
          </div>
        </div>

        {/* Kategorie-Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <a
              key={key}
              href={`#${key}`}
              className={`px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors`}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Tools by Category */}
        {Object.entries(toolsByCategory).map(([category, categoryTools]) => (
          <section key={category} id={category} className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              {categoryIcons[category]}
              {categoryLabels[category]}
              <span className="text-sm font-normal text-blue-300">
                ({categoryTools.length} Tools)
              </span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTools.map((tool) => (
                <Card 
                  key={tool.id} 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-all"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <CardTitle className="text-lg text-white leading-tight">
                          {tool.name}
                        </CardTitle>
                        <p className="text-blue-300 text-xs mt-1">
                          von {tool.provider}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium text-white ${categoryColors[category]}`}>
                        {categoryLabels[category].split(' ')[0]}
                      </span>
                    </div>
                    
                    <CardDescription className="text-blue-200 text-sm line-clamp-3">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-1.5 mb-4">
                      {tool.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-blue-300 text-xs">
                          <FileCheck className="w-3.5 h-3.5 text-[#20b2aa] flex-shrink-0" />
                          <span className="line-clamp-1">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full bg-[#20b2aa]/80 hover:bg-[#20b2aa] text-white text-sm py-2 h-auto"
                      onClick={() => window.open(tool.url, '_blank', 'noopener,noreferrer')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Zu {tool.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}

        {/* Mobile-App Hinweis */}
        <div className="bg-gradient-to-r from-[#20b2aa]/20 to-[#3ddbd0]/20 border border-[#20b2aa]/30 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <Smartphone className="w-10 h-10 text-[#20b2aa] flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                PflegeNavigator App in Entwicklung
              </h3>
              <p className="text-blue-200 text-sm mb-3">
                Bald verfügbar: Mobile App für Pflegekräfte mit direkter Maßnahmen-Eintragung 
                und Patienten-Zugriff. Pflegedienste können Pflege-Maßnahmen dokumentieren 
                – Pflegebedürftige können alles in Echtzeit abrufen.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-white/10 rounded text-xs text-blue-200">
                  PWA (kostenlos)
                </span>
                <span className="px-2 py-1 bg-white/10 rounded text-xs text-blue-200">
                  Android APK
                </span>
                <span className="px-2 py-1 bg-white/10 rounded text-xs text-blue-200">
                  iOS (geplant)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hinweise */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#20b2aa]" />
            Hinweise zur Nutzung
          </h2>
          <ul className="space-y-2 text-blue-200 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[#20b2aa]">•</span>
              Externe Tools erfordern in der Regel eine separate Registrierung beim jeweiligen Anbieter.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#20b2aa]">•</span>
              Prüfen Sie vor der Nutzung, ob die Tools für Ihren spezifischen Pflegekontext zugelassen sind.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#20b2aa]">•</span>
              Bei Fragen zu DiPA-Konformität oder BfArM-Anforderungen wenden Sie sich an Ihre IT-Abteilung.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#20b2aa]">•</span>
              PflegeNavigator EU empfiehlt keine spezifischen Tools – die Auflistung dient der Information.
            </li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10"
            onClick={() => router.push('/pflegegrad/start')}
          >
            Pflegegrad prüfen
          </Button>
          <Button 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10"
            onClick={() => router.push('/widerspruch')}
          >
            Widerspruch einlegen
          </Button>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/20 pt-6 mt-12">
          <div className="flex justify-center gap-6 text-sm text-blue-400">
            <a href="/impressum" className="hover:text-white transition-colors">Impressum</a>
            <span>•</span>
            <a href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
