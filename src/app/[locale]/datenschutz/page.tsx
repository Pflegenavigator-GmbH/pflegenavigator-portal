import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Lock, Eye, Server, User, Mail, FileText } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Datenschutzerklärung - PflegeNavigator EU',
  description: 'Informationen zum Datenschutz bei PflegeNavigator EU gUG nach DSGVO'
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#0f2744] to-[#20b2aa] rounded-2xl shadow-xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#0f2744]">Datenschutzerklärung</h1>
          <p className="text-slate-600">Ihre Daten sind bei uns sicher – DSGVO-konform</p>
        </div>

        {/* In einfacher Sprache */}
        <Card className="border-[#20b2aa]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#20b2aa]">
              <Lock className="w-5 h-5" />
              In Kürze: Was passiert mit Ihren Daten?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[#20b2aa]">✓</span>
                <span>Wir speichern nur einen <strong>Code</strong> (z.B. PF-ABC123) – keinen Namen</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#20b2aa]">✓</span>
                <span>Daten werden in der <strong>EU</strong> gespeichert (Deutschland/Frankfurt)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#20b2aa]">✓</span>
                <span>Keine Weitergabe an <strong>Werbung</strong> oder andere Firmen</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#20b2aa]">✓</span>
                <span>Sie können Ihre Daten jederzeit <strong>löschen</strong> lassen</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#20b2aa]">✓</span>
                <span>Kein <strong>Tracking</strong> von anderen Firmen (Google, Facebook)</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Verantwortlicher */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#20b2aa]" />
              Wer ist verantwortlich?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p><strong>PflegeNavigator EU gUG</strong> (haftungsbeschränkt)</p>
            <p>Vertreten durch: [Geschäftsführer Name]</p>
            <p>
              Clevver GmbH c/o PflegeNavigator EU gUG<br />
              [Straße Hausnummer]<br />
              [PLZ Bielefeld]<br />
              Deutschland
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <a href="mailto:datenschutz@pflegenavigatoreu.com" className="text-[#20b2aa] hover:underline">
                datenschutz@pflegenavigatoreu.com
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Welche Daten */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#20b2aa]" />
              Welche Daten speichern wir?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Wir speichern nur das, was <strong>wirklich nötig</strong> ist:</p>
            
            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
              <p className="font-semibold">Wenn Sie den Pflegegrad-Rechner nutzen:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Ihre Antworten zu den 6 Modulen (als Zahlen)</li>
                <li>Einen zufälligen Code (z.B. PF-ABC123) – kein Name</li>
                <li>Wann Sie den Rechner genutzt haben</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
              <p className="font-semibold">Wenn Sie sich für E-Mail-Benachrichtigungen anmelden:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Ihre E-Mail-Adresse</li>
                <li>Welche Fristen Sie erinnern wollen</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="font-semibold text-green-800">Wir speichern NICHT:</p>
              <ul className="list-disc list-inside space-y-1 text-green-700">
                <li>Ihren Namen (wenn Sie keinen angeben wollen)</li>
                <li>Ihre Krankenkassennummer</li>
                <li>Diagnosen oder sensible Gesundheitsdaten</li>
                <li>Ihre Adresse (außer Sie bestellen Flyer)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Wo gespeichert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5 text-[#20b2aa]" />
              Wo werden Daten gespeichert?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Alle Daten werden in der <strong>Europäischen Union</strong> gespeichert:</p>
            
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[#20b2aa]">🇩🇪</span>
                <span>Haupt-Server: <strong>Deutschland</strong> (Hetzner, Falkenstein)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#20b2aa]">🇩🇪</span>
                <span>Datenbank: <strong>Frankfurt</strong> (Supabase)</span>
              </li>
            </ul>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-amber-800">
                <strong>Wichtig:</strong> Wir verwenden <strong>keine</strong> Server in den USA, 
                China oder anderen Ländern außerhalb der EU. Ihre Daten bleiben in Europa.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ihre Rechte */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#20b2aa]" />
              Ihre Rechte (nach DSGVO)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Sie haben das Recht, jederzeit:</p>
            
            <div className="grid gap-4">
              {[
                { title: 'Auskunft', desc: 'Wir sagen Ihnen, welche Daten wir von Ihnen haben' },
                { title: 'Berichtigung', desc: 'Falsche Daten korrigieren lassen' },
                { title: 'Löschung', desc: 'Ihre Daten löschen lassen ("Recht auf Vergessenwerden")' },
                { title: 'Einschränkung', desc: 'Wir dürfen Daten nicht mehr nutzen' },
                { title: 'Widerspruch', desc: 'Sagen: "Ich will nicht, dass Sie meine Daten nutzen"' },
                { title: 'Datenübertragung', desc: 'Ihre Daten in einer Datei bekommen' }
              ].map((recht, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 bg-[#20b2aa] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{recht.title}</p>
                    <p className="text-sm text-slate-600">{recht.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <p>So üben Sie Ihre Rechte aus:</p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#20b2aa]" />
              Schreiben Sie an:{" "}
              <a href="mailto:datenschutz@pflegenavigatoreu.com" className="text-[#20b2aa] hover:underline">
                datenschutz@pflegenavigatoreu.com
              </a>
            </p>
            
            <p className="text-sm text-slate-600">
              Wir antworten innerhalb von <strong>30 Tagen</strong> (meist schneller).
            </p>
          </CardContent>
        </Card>

        {/* Cookies & Tracking */}
        <Card>
          <CardHeader>
            <CardTitle>Cookies und Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Wir verwenden <strong>keine</strong> Cookies von Werbefirmen wie Google oder Facebook.</p>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="font-semibold text-green-800">✓ Was wir NICHT tun:</p>
              <ul className="list-disc list-inside space-y-1 text-green-700 mt-2">
                <li>Kein Google Analytics</li>
                <li>Kein Facebook Pixel</li>
                <li>Keine Werbe-Cookies</li>
                <li>Kein Tracking über Websites hinweg</li>
              </ul>
            </div>

            <p>Wir nutzen nur ein <strong>Privatsphäre-freundliches</strong> Statistik-Tool (Umami), 
            das anonymisiert und keine persönlichen Daten speichert.</p>
          </CardContent>
        </Card>

        {/* Sicherheit */}
        <Card>
          <CardHeader>
            <CardTitle>Wie schützen wir Ihre Daten?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-[#20b2aa] font-bold">🔒</span>
                <span><strong>Verschlüsselung:</strong> Alle Daten werden verschlüsselt übertragen (HTTPS)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#20b2aa] font-bold">🛡️</span>
                <span><strong>Zugriffsschutz:</strong> Nur Sie (mit Ihrem Code) können Ihre Daten sehen</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#20b2aa] font-bold">🇪🇺</span>
                <span><strong>EU-Server:</strong> Daten bleiben in der Europäischen Union</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#20b2aa] font-bold">🚫</span>
                <span><strong>Keine Weitergabe:</strong> Wir verkaufen Ihre Daten nicht</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#20b2aa] font-bold">🗑️</span>
                <span><strong>Löschung:</strong> Daten werden nach 3 Jahren inaktivität automatisch gelöscht</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Änderungen */}
        <Card>
          <CardHeader>
            <CardTitle>Änderungen dieser Erklärung</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Wir können diese Datenschutzerklärung anpassen, wenn sich unsere Dienste ändern 
              oder neue Gesetze dazu kommen. Bei wichtigen Änderungen informieren wir Sie per E-Mail 
              (wenn Sie uns Ihre Adresse gegeben haben) oder zeigen einen Hinweis im Portal.
            </p>
            <p className="text-sm text-slate-500 mt-4"><strong>Stand:</strong> 27. April 2026</p>
          </CardContent>
        </Card>

        {/* Kontakt Datenschutz */}
        <Card className="border-[#20b2aa]">
          <CardHeader>
            <CardTitle className="text-[#20b2aa]">Fragen zum Datenschutz?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Wenn Sie Fragen haben oder Ihre Rechte ausüben wollen:</p>
            
            <div className="flex items-center gap-3 p-4 bg-[#20b2aa]/10 rounded-lg">
              <Mail className="w-5 h-5 text-[#20b2aa]" />
              <a href="mailto:datenschutz@pflegenavigatoreu.com" className="text-[#20b2aa] font-semibold hover:underline">
                datenschutz@pflegenavigatoreu.com
              </a>
            </div>

            <p className="text-sm text-slate-600">
              Oder wenden Sie sich an die <strong>Datenschutzbehörde</strong>:<br />
              Landesbeauftragte für Datenschutz und Informationsfreiheit NRW<br />
              Kavalleriestraße 2-4, 40213 Düsseldorf<br />
              <a href="https://www.ldi.nrw.de" target="_blank" rel="noopener noreferrer" className="text-[#20b2aa] hover:underline">
                www.ldi.nrw.de
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Zurück */}
        <div className="flex justify-center">
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border border-[#20b2aa] text-[#20b2aa] hover:bg-[#20b2aa] hover:text-white h-10 px-4 py-2 transition-colors"
          >
            ← Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
