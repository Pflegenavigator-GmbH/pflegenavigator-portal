'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Briefcase,
  Calculator,
  ArrowRight,
  ArrowLeft,
  Euro,
  Info,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield,
  Heart
} from 'lucide-react';

interface EmRenteErgebnis {
  renteBetrag: number;
  zulageBetrag: number;
  gesamtBetrag: number;
  pflegegrad: number;
  qualifiziert: boolean;
}

export default function EmRenteRechner() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    geburtsjahr: '',
    eintrittsdatum: '',
    pflegegrad: '',
    pflegestufe: '',
    arbeitsjahre: '',
    durchschnittsgehalt: ''
  });
  const [ergebnis, setErgebnis] = useState<EmRenteErgebnis | null>(null);

  const berechneEmRente = () => {
    // Vereinfachte Berechnung basierend auf Pflegegrad
    const pflegegrad = parseInt(formData.pflegegrad) || 0;
    const arbeitsjahre = parseInt(formData.arbeitsjahre) || 0;
    const gehalt = parseFloat(formData.durchschnittsgehalt) || 0;
    
    // Rentenpunkte pro Jahr (ca. 1 Punkt bei Durchschnittsgehalt)
    const rentenpunkte = Math.min(arbeitsjahre * (gehalt / 45358), 45); // Max 45 Punkte
    const aktuellerRentenwert = 39.32; // 2026 ca.
    
    let renteBasis = rentenpunkte * aktuellerRentenwert;
    
    // Pflegezulage basierend auf Pflegegrad
    const pflegeZulagen: Record<number, number> = {
      1: 0,      // Keine Zulage
      2: 0,      // Keine Zulage  
      3: 201.06, // Krankenpflege zählt
      4: 302.65,
      5: 403.53
    };
    
    const zulage = pflegeZulagen[pflegegrad] || 0;
    
    // Qualifikation: Mindestens Pflegegrad 3 oder 5+ Jahre Pflege
    const qualifiziert = pflegegrad >= 3 || (pflegegrad >= 1 && arbeitsjahre >= 5);
    
    setErgebnis({
      renteBetrag: Math.round(renteBasis * 100) / 100,
      zulageBetrag: zulage,
      gesamtBetrag: Math.round((renteBasis + zulage) * 100) / 100,
      pflegegrad,
      qualifiziert
    });
    setStep(4);
  };

  const generiereBrief = () => {
    router.push('/briefe?type=em-rente');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl mb-6">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#0f2744] mb-4">
            EM-Rente Rechner
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Berechnen Sie Ihre mögliche Erwerbsminderungsrente mit Pflegezulage
          </p>
        </div>

        {/* Info-Box */}
        <Alert className="mb-8 bg-blue-50 border-blue-200">
          <Info className="w-5 h-5 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Die EM-Rente kann bei Pflegebedürftigkeit (ab Pflegegrad 3) erhöht werden. 
            Die Pflege-Personal-Zulage wird zusätzlich zur Rente gezahlt.
          </AlertDescription>
        </Alert>

        {/* Step 1: Grunddaten */}
        {step === 1 && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <CardTitle>Grunddaten</CardTitle>
                  <CardDescription>Allgemeine Informationen</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="geburtsjahr">Geburtsjahr</Label>
                  <Input
                    id="geburtsjahr"
                    type="number"
                    placeholder="z.B. 1965"
                    value={formData.geburtsjahr}
                    onChange={(e) => setFormData({...formData, geburtsjahr: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eintrittsdatum">Eintrittsdatum Pflegebedürftigkeit</Label>
                  <Input
                    id="eintrittsdatum"
                    type="date"
                    value={formData.eintrittsdatum}
                    onChange={(e) => setFormData({...formData, eintrittsdatum: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setStep(2)}>
                  Weiter <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Pflegebedürftigkeit */}
        {step === 2 && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#20b2aa] rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <CardTitle>Pflegebedürftigkeit</CardTitle>
                  <CardDescription>Aktueller Pflegegrad</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="pflegegrad">Pflegegrad</Label>
                  <select
                    id="pflegegrad"
                    className="w-full p-2 border rounded-md"
                    value={formData.pflegegrad}
                    onChange={(e) => setFormData({...formData, pflegegrad: e.target.value})}
                  >
                    <option value="">Bitte wählen</option>
                    <option value="1">Pflegegrad 1</option>
                    <option value="2">Pflegegrad 2</option>
                    <option value="3">Pflegegrad 3</option>
                    <option value="4">Pflegegrad 4</option>
                    <option value="5">Pflegegrad 5</option>
                    <option value="0">Noch kein Pflegegrad</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pflegestufe">Pflegestufe (alt, falls vorhanden)</Label>
                  <select
                    id="pflegestufe"
                    className="w-full p-2 border rounded-md"
                    value={formData.pflegestufe}
                    onChange={(e) => setFormData({...formData, pflegestufe: e.target.value})}
                  >
                    <option value="">Keine alte Pflegestufe</option>
                    <option value="0">Pflegestufe 0</option>
                    <option value="1">Pflegestufe I</option>
                    <option value="2">Pflegestufe II</option>
                    <option value="3">Pflegestufe III</option>
                    <option value="h">Härtefall</option>
                  </select>
                </div>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    <strong>Wichtig:</strong> Ab Pflegegrad 3 wird die Pflege-Personal-Zulage 
                    zur EM-Rente hinzugezahlt. Bei niedrigeren Graden nur unter bestimmten Bedingungen.
                  </p>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 w-4 h-4" /> Zurück
                </Button>
                <Button onClick={() => setStep(3)}>
                  Weiter <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Berufsdaten */}
        {step === 3 && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <CardTitle>Berufliche Daten</CardTitle>
                  <CardDescription>Für Rentenberechnung</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="arbeitsjahre">Anzahl Arbeitsjahre</Label>
                  <Input
                    id="arbeitsjahre"
                    type="number"
                    placeholder="z.B. 25"
                    value={formData.arbeitsjahre}
                    onChange={(e) => setFormData({...formData, arbeitsjahre: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="durchschnittsgehalt">Durchschnittliches Jahresgehalt (€)</Label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="durchschnittsgehalt"
                      type="number"
                      className="pl-10"
                      placeholder="z.B. 45000"
                      value={formData.durchschnittsgehalt}
                      onChange={(e) => setFormData({...formData, durchschnittsgehalt: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600">
                  <strong>Hinweis:</strong> Dies ist eine vereinfachte Schätzung. 
                  Die tatsächliche Rentenhöhe hängt von vielen Faktoren ab und wird 
                  vom Rentenversicherungsträger berechnet.
                </p>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 w-4 h-4" /> Zurück
                </Button>
                <Button onClick={berechneEmRente} className="bg-[#20b2aa]">
                  <Calculator className="mr-2 w-4 h-4" /> Berechnen
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Ergebnis */}
        {step === 4 && ergebnis && (
          <>
            <Card className="mb-8 border-[#20b2aa]">
              <CardHeader className="bg-gradient-to-r from-[#20b2aa]/10 to-[#20b2aa]/5">
                <div className="flex items-center gap-3">
                  <Calculator className="w-8 h-8 text-[#20b2aa]" />
                  <div>
                    <CardTitle>Ihre geschätzte EM-Rente</CardTitle>
                    <CardDescription>Berechnung basierend auf Ihren Angaben</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {ergebnis.qualifiziert ? (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Sie qualifizieren sich für die EM-Rente mit Pflegezulage!
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      Sie erreichen möglicherweise nicht die Voraussetzungen für die volle EM-Rente. 
                      Prüfen Sie mit dem Arzt Ihre Leistungsfähigkeit.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-sm text-slate-600 mb-1">Basisrente (geschätzt)</p>
                      <p className="text-3xl font-bold text-[#0f2744]">
                        {ergebnis.renteBetrag.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'})}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-sm text-slate-600 mb-1">Pflegezulage</p>
                      <p className="text-3xl font-bold text-[#20b2aa]">
                        {ergebnis.zulageBetrag.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'})}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-[#0f2744] text-white">
                    <CardContent className="pt-6 text-center">
                      <p className="text-sm text-blue-200 mb-1">Gesamtergebnis</p>
                      <p className="text-3xl font-bold text-white">
                        {ergebnis.gesamtBetrag.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'})}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Monatliche Zahlung (12x pro Jahr)</span>
                </div>
              </CardContent>
            </Card>

            {/* Aktionen */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={generiereBrief}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div>
                      <CardTitle>Antrag generieren</CardTitle>
                      <CardDescription>Musterbrief für Rentenantrag</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Erstellen Sie einen vollständigen Antrag auf Erwerbsminderungsrente 
                    mit allen notwendigen Angaben.
                  </p>
                  <Button className="w-full">
                    Brief erstellen <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Heart className="w-8 h-8 text-[#20b2aa]" />
                    <div>
                      <CardTitle>Weitere Hilfe</CardTitle>
                      <CardDescription>Professionelle Beratung</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Die Deutsche Rentenversicherung berät Sie kostenlos zu allen 
                    Fragen rund um die EM-Rente.
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => window.open('https://www.deutsche-rentenversicherung.de', '_blank')}>
                    Zur Rentenversicherung <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center mt-8">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Neue Berechnung
              </Button>
            </div>
          </>
        )}

        {/* Footer Disclaimer */}
        <footer className="mt-12 pt-6 border-t">
          <div className="flex items-start gap-3 text-slate-500 text-sm">
            <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>
              Dies ist eine unverbindliche Schätzung. Die tatsächliche Rentenhöhe 
              wird von der Deutschen Rentenversicherung berechnet. Bei Fragen wenden 
              Sie sich an die Rentenberatung unter der kostenlosen Nummer 0800 1000 480 80.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
