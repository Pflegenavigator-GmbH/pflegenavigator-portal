import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Mail, Phone, Globe, Shield, FileText, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Impressum - PflegeNavigator EU',
  description: 'Impressum und rechtliche Angaben der PflegeNavigator EU gUG'
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#0f2744] to-[#20b2aa] rounded-2xl shadow-xl">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#0f2744]">Impressum</h1>
          <p className="text-slate-600">Rechtliche Angaben nach § 5 TMG</p>
        </div>

        {/* Angaben nach TMG */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#20b2aa]" />
              Angaben nach § 5 TMG
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="font-semibold text-lg">PflegeNavigator EU gUG</p>
              <p className="text-slate-600">(haftungsbeschränkt)</p>
              <p>Geschäftsführer: [Name eintragen]</p>
              <p>Amtsgericht: [Handelsregister eintragen]</p>
              <p>HRB: [Nummer eintragen]</p>
              <p>USt-IdNr.: [Nummer eintragen]</p>
            </div>

            <div className="h-px bg-gray-200 my-4" />

            <div className="space-y-2">
              <p className="font-semibold">Postanschrift:</p>
              <p>Clevver GmbH c/o PflegeNavigator EU gUG</p>
              <p>[Straße Hausnummer]</p>
              <p>[PLZ Bielefeld]</p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4" />
                E-Mail:
              </p>
              <a href="mailto:info@pflegenavigatoreu.com" className="text-[#20b2aa] hover:underline">
                info@pflegenavigatoreu.com
              </a>
            </div>

            <div className="space-y-2">
              <p className="font-semibold flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Website:
              </p>
              <a href="https://pflegenavigatoreu.com" className="text-[#20b2aa] hover:underline">
                https://pflegenavigatoreu.com
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Vertretungsberechtigt */}
        <Card>
          <CardHeader>
            <CardTitle>Vertretungsberechtigte</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Geschäftsführer: [Name eintragen]</p>
            <p className="text-sm text-slate-500 mt-2">
              Diese Person ist vertretungsberechtigt für die PflegeNavigator EU gUG.
            </p>
          </CardContent>
        </Card>

        {/* Haftungsausschluss */}
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="w-5 h-5" />
              Wichtiger Hinweis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-amber-800">
            <p>
              <strong>Keine Rechtsberatung:</strong> PflegeNavigator EU gUG bietet keine Rechtsberatung, 
              keine medizinische Beratung und keine verbindliche Auskunft über Leistungsansprüche. 
              Die Auswertungen sind Orientierungshilfen.
            </p>
            <p>
              <strong>Keine Garantie:</strong> Verbindliche Entscheidungen treffen ausschließlich 
              die zuständigen Stellen (Medizinischer Dienst, Pflegekassen, Rentenversicherung, etc.).
            </p>
          </CardContent>
        </Card>

        {/* Streitschlichtung */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#20b2aa]" />
              Streitschlichtung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-[#20b2aa] hover:underline ml-1">
                https://ec.europa.eu/consumers/odr
              </a>
            </p>
            <p>
              Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht bereit oder verpflichtet, 
              an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </CardContent>
        </Card>

        {/* Haftung für Inhalte */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#20b2aa]" />
              Haftung für Inhalte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde 
              Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige 
              Tätigkeit hinweisen.
            </p>
            <p>
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den 
              allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch 
              erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei 
              Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>
          </CardContent>
        </Card>

        {/* Haftung für Links */}
        <Card>
          <CardHeader>
            <CardTitle>Haftung für Links</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
              Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
              Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber 
              der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf 
              mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der 
              Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten 
              ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei 
              Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
          </CardContent>
        </Card>

        {/* Urheberrecht */}
        <Card>
          <CardHeader>
            <CardTitle>Urheberrecht</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
              dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
              der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung 
              des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den 
              privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht 
              vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden 
              Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung 
              aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von 
              Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
            </p>
          </CardContent>
        </Card>

        {/* Zurück Button */}
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
