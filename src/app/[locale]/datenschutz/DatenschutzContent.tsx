import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Lock, Eye, Server, User, Mail, FileText } from 'lucide-react'
import Link from 'next/link'

export default function DatenschutzContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#0f2744] to-[#20b2aa] rounded-2xl shadow-xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#0f2744]">Datenschutzerklärung</h1>
          <p className="text-slate-600">Ihre Daten sind bei uns sicher – DSGVO-konform</p>
        </div>

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
                <span>Kein <strong>Tracking</strong> von anderen Firmen</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#20b2aa]" />
              Wer ist verantwortlich?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p><strong>PflegeNavigator EU gUG</strong></p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <a href="mailto:datenschutz@pflegenavigatoreu.com" className="text-[#20b2aa] hover:underline">
                datenschutz@pflegenavigatoreu.com
              </a>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#20b2aa]" />
              Welche Daten speichern wir?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Wir speichern nur das, was <strong>wirklich nötig</strong> ist.</p>
            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
              <p className="font-semibold">Bei Nutzung des Pflegegrad-Rechners:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Antworten zu den 6 Modulen (als Zahlen)</li>
                <li>Zufälliger Code (z.B. PF-ABC123)</li>
                <li>Nutzungsdatum</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="font-semibold text-green-800">Wir speichern NICHT:</p>
              <ul className="list-disc list-inside space-y-1 text-green-700">
                <li>Ihren Namen</li>
                <li>Krankenkassennummer</li>
                <li>Sensible Gesundheitsdaten</li>
                <li>Ihre Adresse</li>
              </ul>
            </div>
          </CardContent>
        </Card>

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
                <span>🇩🇪</span>
                <span>Haupt-Server: <strong>Deutschland</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span>🇩🇪</span>
                <span>Datenbank: <strong>Frankfurt</strong> (Supabase)</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#20b2aa]" />
              Ihre Rechte (nach DSGVO)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Sie haben das Recht auf: Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Datenübertragung.</p>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#20b2aa]" />
              <a href="mailto:datenschutz@pflegenavigatoreu.com" className="text-[#20b2aa] hover:underline">
                datenschutz@pflegenavigatoreu.com
              </a>
            </div>
            <p className="text-sm text-slate-600">Wir antworten innerhalb von <strong>30 Tagen</strong>.</p>
          </CardContent>
        </Card>

        <div className="flex justify-center pt-4">
          <Link href="/">
            <button className="px-6 py-3 bg-[#20b2aa] text-white rounded-lg hover:bg-[#1a998f] transition">
              Zurück zur Startseite
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
