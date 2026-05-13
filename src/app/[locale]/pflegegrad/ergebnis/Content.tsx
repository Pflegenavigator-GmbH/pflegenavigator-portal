"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Share2, FileText, AlertCircle, CheckCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ErgebnisData {
  pflegegrad: number;
  gesamtpunkte: number;
  ampel: "gruen" | "gelb" | "rot";
  pufferPunkte: number;
  modulErgebnisse: {
    modulId: number;
    name: string;
    rohpunkte: number;
    gewichtetePunkte: number;
  }[];
  empfehlungen: string[];
}

export default function ErgebnisPage() {
  const [ergebnis, setErgebnis] = useState<ErgebnisData | null>(null);

  useEffect(() => {
    // Lade Ergebnis aus localStorage oder API
    const gespeichert = localStorage.getItem("pflegegrad-ergebnis");
    if (gespeichert) {
      setErgebnis(JSON.parse(gespeichert));
    }
  }, []);

  if (!ergebnis) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Kein Ergebnis vorhanden</h1>
        <p className="text-gray-600 mb-6">Bitte führen Sie zuerst die Pflegegrad-Berechnung durch.</p>
        <Button onClick={() => window.location.href = "/pflegegrad/start"}>
          Zur Berechnung
        </Button>
      </div>
    );
  }

  const ampelFarben = {
    gruen: { bg: "bg-green-100", text: "text-green-800", border: "border-green-500", icon: CheckCircle },
    gelb: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-500", icon: AlertCircle },
    rot: { bg: "bg-red-100", text: "text-red-800", border: "border-red-500", icon: AlertCircle },
  };

  const ampelStil = ampelFarben[ergebnis.ampel];
  const AmpelIcon = ampelStil.icon;

  const downloadPDF = () => {
    // PDF-Generierung
    window.open("/api/pflegegrad/pdf?data=" + encodeURIComponent(JSON.stringify(ergebnis)), "_blank");
  };

  const shareErgebnis = () => {
    if (navigator.share) {
      navigator.share({
        title: "Mein Pflegegrad-Ergebnis",
        text: `Ich habe Pflegegrad ${ergebnis.pflegegrad} erreicht!`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ihr Ergebnis</h1>
        <p className="text-gray-600">Basierend auf Ihren Angaben nach dem NBA-System</p>
      </motion.div>

      {/* Ampel-Karte */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className={`mb-6 border-2 ${ampelStil.border}`}>
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-4">
              <div className={`w-24 h-24 rounded-full ${ampelStil.bg} flex items-center justify-center`}>
                <AmpelIcon className={`w-12 h-12 ${ampelStil.text}`} />
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                {ergebnis.pflegegrad === 0 ? "Kein Pflegegrad" : `Pflegegrad ${ergebnis.pflegegrad}`}
              </h2>
              <p className={`text-lg font-medium ${ampelStil.text}`}>
                {ergebnis.ampel === "gruen" && "Sicher über der Schwelle"}
                {ergebnis.ampel === "gelb" && "Knapp über der Schwelle"}
                {ergebnis.ampel === "rot" && "Unter der Schwelle"}
              </p>
              <p className="text-gray-600 mt-2">
                {ergebnis.gesamtpunkte.toFixed(1)} Punkte gesamt
                {ergebnis.pufferPunkte > 0 && ` (+${ergebnis.pufferPunkte.toFixed(1)} Puffer)`}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modul-Ergebnisse */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Modul-Ergebnisse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ergebnis.modulErgebnisse
              .filter(m => m.modulId !== 6) // Modul 6 nicht für Pflegegrad
              .map((modul, index) => (
              <div key={modul.modulId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{modul.name}</p>
                  <p className="text-sm text-gray-600">{NBA_MODULE.find(m => m.id === modul.modulId)?.beschreibung}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{modul.gewichtetePunkte.toFixed(1)}</p>
                  <p className="text-sm text-gray-500">von {modul.rohpunkte} × Gewichtung</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Hinweis:</strong> Von Modul 2 und 3 zählt nur der höhere Wert. 
              Modul 6 (Alltagsgestaltung) fließt nicht in die Pflegegrad-Berechnung ein.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Empfehlungen */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Empfehlungen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {ergebnis.empfehlungen.map((empfehlung, index) => (
              <li key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800">{empfehlung}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Nächste Schritte */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Nächste Schritte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={downloadPDF} className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              PDF herunterladen
            </Button>
            <Button variant="outline" onClick={shareErgebnis} className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Teilen
            </Button>
            <Button onClick={() => window.location.href = "/briefe"} className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Brief erstellen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 text-center mt-8">
        Dies ist eine Orientierungsberechnung. Der offizielle Pflegegrad wird vom Medizinischen Dienst (MDK) festgestellt. 
        PflegeNavigator EU gUG bietet keine Rechtsberatung.
      </p>
    </div>
  );
}

// NBA-Module Definition für die Anzeige
const NBA_MODULE = [
  { id: 1, name: "Mobilität", beschreibung: "Fähigkeit, sich im Raum zu bewegen" },
  { id: 2, name: "Kognition & Kommunikation", beschreibung: "Orientierung, Erinnern, Entscheiden" },
  { id: 3, name: "Verhaltensweisen & Psyche", beschreibungung: "Umgang mit belastendem Verhalten" },
  { id: 4, name: "Selbstversorgung", beschreibung: "Körperpflege, Essen, Toilette (40% Gewichtung)" },
  { id: 5, name: "Krankheitsbewältigung", beschreibung: "Medikamente, Therapien" },
  { id: 6, name: "Alltagsgestaltung", beschreibung: "Haushalt (nicht für Pflegegrad)" },
];
