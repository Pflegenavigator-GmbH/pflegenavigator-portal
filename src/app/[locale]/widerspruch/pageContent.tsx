'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  ArrowRight, 
  AlertCircle, 
  Clock, 
  Check,
  Info,
  ArrowLeft,
  Download,
  Calendar,
  Save,
  Trash2,
  Bell
} from 'lucide-react';
import { 
  WiderspruchDaten, 
  WiderspruchFrist,
  WiderspruchTyp,
  berechneFrist,
  formatiereFristInfo,
  generiereWiderspruchBrief,
  generiereCheckliste,
  generiereNaechsteSchritte,
  speichereWiderspruch,
  ladeWidersprueche,
  loescheWiderspruch,
  erstelleWiderspruch
} from '@/lib/widerspruch';
import { generateWiderspruchPDF, downloadPDF } from '@/lib/briefe/widerspruch-pdf';
import { Label } from '@/components/ui/label';

interface GespeicherterWiderspruch extends WiderspruchDaten {
  frist: WiderspruchFrist;
}

export default function WiderspruchPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('neu');
  const [gespeicherte, setGespeicherte] = useState<GespeicherterWiderspruch[]>([]);
  
  // Formular-States
  const [typ, setTyp] = useState<WiderspruchTyp>('pflegegrad');
  const [bescheidDatum, setBescheidDatum] = useState('');
  const [versicherterName, setVersicherterName] = useState('');
  const [pflegekasse, setPflegekasse] = useState('');
  const [versicherungsnummer, setVersicherungsnummer] = useState('');
  const [anschrift, setAnschrift] = useState('');
  const [begruendung, setBegruendung] = useState('');
  
  // Ergebnis-States
  const [frist, setFrist] = useState<WiderspruchFrist | null>(null);
  const [briefText, setBriefText] = useState('');
  const [showErgebnis, setShowErgebnis] = useState(false);
  
  // Lade gespeicherte Widersprüche beim Start
  useEffect(() => {
    const gespeichert = ladeWidersprueche();
    const mitFristen = gespeichert.map((w: WiderspruchDaten) => ({
      ...w,
      frist: berechneFrist(new Date(w.bescheidDatum), w.typ)
    }));
    setGespeicherte(mitFristen);
  }, []);
  
  // Berechne Frist bei Datumsänderung
  const berechneFristManuell = () => {
    if (!bescheidDatum) return;
    
    const datum = new Date(bescheidDatum);
    const berechneteFrist = berechneFrist(datum, typ);
    setFrist(berechneteFrist);
    
    // Generiere Brief
    const daten: WiderspruchDaten = {
      typ,
      bescheidDatum,
      versicherterName,
      pflegekasse,
      versicherungsnummer,
      anschrift,
      begruendung
    };
    
    const brief = generiereWiderspruchBrief(daten, berechneteFrist);
    setBriefText(brief);
    setShowErgebnis(true);
  };
  
  // PDF Download
  const handlePDFDownload = async () => {
    if (!frist) return;
    
    const daten: WiderspruchDaten = {
      typ,
      bescheidDatum,
      versicherterName,
      pflegekasse,
      versicherungsnummer,
      anschrift,
      begruendung
    };
    
    try {
      const pdfBytes = await generateWiderspruchPDF({ daten, frist });
      const filename = `Widerspruch-${versicherterName.replace(/\s+/g, '_') || 'Brief'}-${new Date().toISOString().split('T')[0]}.pdf`;
      downloadPDF(pdfBytes, filename);
    } catch (error) {
      console.error('Fehler beim PDF-Download:', error);
      alert('PDF konnte nicht erstellt werden. Bitte versuchen Sie es erneut.');
    }
  };
  
  // Speichere Widerspruch
  const handleSpeichern = () => {
    const daten: WiderspruchDaten = {
      typ,
      bescheidDatum,
      versicherterName,
      pflegekasse,
      versicherungsnummer,
      anschrift,
      begruendung
    };
    speichereWiderspruch(daten);
    
    // Aktualisiere Liste
    const neuGespeichert = ladeWidersprueche();
    const mitFristen = neuGespeichert.map((w: WiderspruchDaten) => ({
      ...w,
      frist: berechneFrist(new Date(w.bescheidDatum), w.typ)
    }));
    setGespeicherte(mitFristen);
    
    alert('Widerspruch wurde gespeichert!');
  };
  
  // Lösche Widerspruch
  const handleLoeschen = (id: string) => {
    loescheWiderspruch(id);
    setGespeicherte(gespeicherte.filter(w => w.id !== id));
  };
  
  // Ampel-Farbe
  const getAmpelFarbe = (status: string) => {
    switch (status) {
      case 'gruen': return 'bg-green-500';
      case 'gelb': return 'bg-yellow-500';
      case 'rot': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Formatierung für Anzeige
  const getAmpelText = (status: string) => {
    switch (status) {
      case 'gruen': return '🟢 Mehr als 14 Tage Zeit';
      case 'gelb': return '🟡 7-14 Tage Zeit';
      case 'rot': return '🔴 Weniger als 7 Tage!';
      case 'abgelaufen': return '⚫ Frist abgelaufen';
      default: return '';
    }
  };
  
  const checkliste = frist ? generiereCheckliste({ typ, bescheidDatum, versicherterName, pflegekasse, versicherungsnummer, anschrift, begruendung }) : [];
  const naechsteSchritte = frist ? generiereNaechsteSchritte(frist) : [];

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500 rounded-2xl shadow-xl mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#0f2744] mb-4">Widerspruch einlegen</h1>
          <p className="text-xl text-slate-600">
            Mit automatischer Fristenberechnung nach §78 SGB X
          </p>
        </div>

        {/* Gesetzes-Hinweis */}
        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Wichtige Fristen</AlertTitle>
          <AlertDescription className="text-blue-700">
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>§ 78 SGB X:</strong> Widerspruchsfrist beträgt 1 Monat nach Zugang</li>
              <li><strong>§ 84 SGG:</strong> Klagefrist beträgt 1 Monat nach Widerspruchsbescheid</li>
              <li>Frist endet automatisch am nächsten Werktag bei Feiertagen/Wochenenden</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="neu">Neuer Widerspruch</TabsTrigger>
            <TabsTrigger value="gespeichert">
              Gespeicherte ({gespeicherte.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab: Neuer Widerspruch */}
          <TabsContent value="neu" className="space-y-6">
            {/* Eingabemaske */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  Widerspruchsdaten eingeben
                </CardTitle>
                <CardDescription>
                  Geben Sie die Daten Ihres Bescheids ein, um die Frist zu berechnen.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Widerspruchstyp */}
                <div className="space-y-2">
                  <Label>Widerspruch gegen:</Label>
                  <Select value={typ} onValueChange={(v: string) => setTyp(v as WiderspruchTyp)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pflegegrad">Pflegegrad-Bescheid (§ 78 SGB X)</SelectItem>
                      <SelectItem value="mdk-gutachten">MDK-Gutachten (§ 78 SGB X)</SelectItem>
                      <SelectItem value="klage">Klage beim Sozialgericht (§ 84 SGG)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bescheiddatum */}
                <div className="space-y-2">
                  <Label htmlFor="bescheidDatum">
                    Datum des Bescheid-Zugangs *
                  </Label>
                  <Input
                    id="bescheidDatum"
                    type="date"
                    value={bescheidDatum}
                    onChange={(e) => setBescheidDatum(e.target.value)}
                    required
                  />
                  <p className="text-sm text-slate-500">
                    Tag, an dem der Bescheid bei Ihnen eingegangen ist
                  </p>
                </div>

                {/* Persönliche Daten */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name des Versicherten *</Label>
                    <Input
                      id="name"
                      value={versicherterName}
                      onChange={(e) => setVersicherterName(e.target.value)}
                      placeholder="Max Mustermann"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pflegekasse">Pflegekasse *</Label>
                    <Input
                      id="pflegekasse"
                      value={pflegekasse}
                      onChange={(e) => setPflegekasse(e.target.value)}
                      placeholder="z.B. AOK Bayern"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="versicherungsnummer">Versicherungsnummer</Label>
                  <Input
                    id="versicherungsnummer"
                    value={versicherungsnummer}
                    onChange={(e) => setVersicherungsnummer(e.target.value)}
                    placeholder="12 34567890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="anschrift">Ihre Anschrift</Label>
                  <Textarea
                    id="anschrift"
                    value={anschrift}
                    onChange={(e) => setAnschrift(e.target.value)}
                    placeholder="Musterstraße 123\n12345 Musterstadt"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="begruendung">Begründung des Widerspruchs</Label>
                  <Textarea
                    id="begruendung"
                    value={begruendung}
                    onChange={(e) => setBegruendung(e.target.value)}
                    placeholder="Beschreiben Sie, warum Sie mit dem Bescheid nicht einverstanden sind..."
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={berechneFristManuell}
                  disabled={!bescheidDatum || !versicherterName || !pflegekasse}
                  className="w-full"
                  size="lg"
                >
                  <Clock className="mr-2 w-4 h-4" />
                  Frist berechnen & Brief erstellen
                </Button>
              </CardContent>
            </Card>

            {/* Ergebnis-Anzeige */}
            {showErgebnis && frist && (
              <>
                {/* Ampel-Status */}
                <Card className={`border-l-4 ${
                  frist.ampelStatus === 'gruen' ? 'border-l-green-500' :
                  frist.ampelStatus === 'gelb' ? 'border-l-yellow-500' :
                  frist.ampelStatus === 'rot' ? 'border-l-red-500' : 'border-l-gray-500'
                }`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Frist-Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${getAmpelFarbe(frist.ampelStatus)}`} />
                        <span className="text-lg font-medium">
                          {getAmpelText(frist.ampelStatus)}
                        </span>
                      </div>
                      
                      <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                        <p><strong>Gesetz:</strong> {frist.gesetz}</p>
                        <p><strong>Bescheid-Datum:</strong> {new Date(frist.bescheidDatum).toLocaleDateString('de-DE')}</p>
                        <p><strong>Fristende:</strong> {new Date(frist.fristEnde).toLocaleDateString('de-DE')}</p>
                        {frist.fristEnde.getTime() !== frist.fristEndeWerktag.getTime() && (
                          <p className="text-amber-600">
                            <strong>Wirksames Fristende (Werktag):</strong> {new Date(frist.fristEndeWerktag).toLocaleDateString('de-DE')}
                          </p>
                        )}
                        <p className="text-lg font-bold">
                          {frist.verbleibendeTage > 0 
                            ? `Noch ${frist.verbleibendeTage} Tage Zeit`
                            : 'Frist ist abgelaufen!'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Widerspruchsbrief */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-500" />
                      Ihr Widerspruchsbrief
                    </CardTitle>
                    <CardDescription>
                      Der Brief wurde automatisch generiert. Sie können ihn vor dem Download noch bearbeiten.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={briefText}
                      onChange={(e) => setBriefText(e.target.value)}
                      rows={20}
                      className="font-mono text-sm"
                    />
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={handlePDFDownload} className="flex-1" size="lg">
                      <Download className="mr-2 w-4 h-4" />
                      Als PDF herunterladen
                    </Button>
                    <Button onClick={handleSpeichern} variant="outline" className="flex-1" size="lg">
                      <Save className="mr-2 w-4 h-4" />
                      Speichern
                    </Button>
                  </CardFooter>
                </Card>

                {/* Checkliste */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      Checkliste
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {checkliste.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-slate-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Nächste Schritte */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowRight className="w-5 h-5 text-blue-500" />
                      Nächste Schritte
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-2 list-decimal list-inside">
                      {naechsteSchritte.map((schritt, index) => (
                        <li key={index} className="text-slate-600">{schritt}</li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Tab: Gespeicherte Widersprüche */}
          <TabsContent value="gespeichert" className="space-y-6">
            {gespeicherte.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">
                    Noch keine Widersprüche gespeichert.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('neu')} 
                    variant="outline" 
                    className="mt-4"
                  >
                    Ersten Widerspruch erstellen
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {gespeicherte.map((w) => (
                  <Card key={w.id} className={`border-l-4 ${
                    w.frist.ampelStatus === 'gruen' ? 'border-l-green-500' :
                    w.frist.ampelStatus === 'gelb' ? 'border-l-yellow-500' :
                    w.frist.ampelStatus === 'rot' ? 'border-l-red-500' : 'border-l-gray-500'
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{w.versicherterName}</CardTitle>
                          <CardDescription>{w.pflegekasse}</CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => w.id && handleLoeschen(w.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Bescheid vom:</span>
                          <span>{new Date(w.bescheidDatum).toLocaleDateString('de-DE')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Frist bis:</span>
                          <span className={
                            w.frist.ampelStatus === 'rot' ? 'text-red-600 font-bold' :
                            w.frist.ampelStatus === 'gelb' ? 'text-yellow-600 font-bold' :
                            'text-green-600 font-bold'
                          }>
                            {new Date(w.frist.fristEndeWerktag).toLocaleDateString('de-DE')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Verbleibend:</span>
                          <span className={
                            w.frist.ampelStatus === 'rot' ? 'text-red-600 font-bold' :
                            w.frist.ampelStatus === 'gelb' ? 'text-yellow-600 font-bold' :
                            'text-green-600 font-bold'
                          }>
                            {w.frist.verbleibendeTage} Tage
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Typ:</span>
                          <span className="text-slate-600">
                            {w.typ === 'pflegegrad' ? 'Pflegegrad' :
                             w.typ === 'mdk-gutachten' ? 'MDK-Gutachten' : 'Klage'}
                          </span>
                        </div>
                      </div>
                      
                      {w.frist.ampelStatus === 'rot' && (
                        <Alert className="mt-4 border-red-200 bg-red-50">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-700">
                            Frist läuft bald ab! Sofort handeln!
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Zurück Button */}
        <div className="flex justify-center mt-8">
          <Button variant="outline" onClick={() => router.push('/')} size="lg">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Zurück zur Startseite
          </Button>
        </div>

        {/* Disclaimer */}
        <Card className="bg-slate-50 mt-8">
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600 text-center">
              <strong>Hinweis:</strong> Der generierte Widerspruch ist ein Muster. 
              Wir übernehmen keine Haftung für den Erfolg. Bei Unsicherheit konsultieren Sie einen 
              Rechtsanwalt oder die Verbraucherzentrale.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
