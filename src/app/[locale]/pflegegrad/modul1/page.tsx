"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Accessibility } from "lucide-react";
import { pflegegradRechner } from "@/lib/pflegegrad/nba-modules";

const FRAGEN = [
  {
    id: "mobilität_1",
    text: "Können Sie selbstständig aufstehen und sich fortbewegen?",
    hilfe: "Gemeint ist das Aufstehen aus Bett/Stuhl und Gehen in der Wohnung."
  },
  {
    id: "mobilität_2",
    text: "Benötigen Sie Hilfe beim Gehen oder Stehen?",
    hilfe: "Z.B. beim Gehen in der Wohnung, beim Aufstehen vom Stuhl."
  },
  {
    id: "mobilität_3",
    text: "Können Sie Treppen steigen?",
    hilfe: "Auch mit Hilfsmitteln wie Handlauf oder Gehstock."
  },
  {
    id: "mobilität_4",
    text: "Sind Sie auf einen Rollstuhl angewiesen?",
    hilfe: "Dauerhaft oder nur zeitweise."
  }
];

const BEWERTUNGEN = [
  { value: "0", label: "Keine Einschränkung", punkte: 0 },
  { value: "1", label: "Leichte Einschränkung", punkte: 25 },
  { value: "2", label: "Mittlere Einschränkung", punkte: 50 },
  { value: "3", label: "Schwere Einschränkung", punkte: 75 },
  { value: "4", label: "Völlig hilfsbedürftig", punkte: 100 }
];

export default function Modul1Page() {
  const router = useRouter();
  const [antworten, setAntworten] = useState<Record<string, string>>({});
  const [fortschritt, setFortschritt] = useState(0);

  const handleAntwort = (frageId: string, wert: string) => {
    setAntworten(prev => ({ ...prev, [frageId]: wert }));
    
    // Fortschritt berechnen
    const anzahlBeantwortet = Object.keys({ ...antworten, [frageId]: wert }).length;
    setFortschritt((anzahlBeantwortet / FRAGEN.length) * 100);
  };

  const handleWeiter = () => {
    // Berechne Modul-1-Punkte
    let gesamtPunkte = 0;
    Object.entries(antworten).forEach(([_, wert]) => {
      const bewertung = BEWERTUNGEN.find(b => b.value === wert);
      if (bewertung) gesamtPunkte += bewertung.punkte;
    });
    const durchschnitt = gesamtPunkte / Object.keys(antworten).length;
    
    // Speichern
    const modul1Ergebnis = {
      modulId: 1,
      punkte: durchschnitt,
      antworten
    };
    localStorage.setItem("modul1", JSON.stringify(modul1Ergebnis));
    
    // Weiter zu Modul 2
    router.push("/pflegegrad/modul2");
  };

  const alleBeantwortet = Object.keys(antworten).length === FRAGEN.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Accessibility className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Modul 1: Mobilität</h1>
            <p className="text-gray-600">Gewichtung: 10%</p>
          </div>
        </div>
        
        <Progress value={fortschritt} className="w-full" />
        <p className="text-sm text-gray-500 mt-2">
          Frage {Object.keys(antworten).length} von {FRAGEN.length}
        </p>
      </div>

      {/* Fragen */}
      <div className="space-y-6">
        {FRAGEN.map((frage, index) => (
          <motion.div
            key={frage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-2">
                  {frage.text}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {frage.hilfe}
                </p>
                
                <RadioGroup
                  value={antworten[frage.id] || ""}
                  onValueChange={(wert) => handleAntwort(frage.id, wert)}
                  className="space-y-2"
                >
                  {BEWERTUNGEN.map((bewertung) => (
                    <div key={bewertung.value} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={bewertung.value} 
                        id={`${frage.id}-${bewertung.value}`}
                      />
                      <Label 
                        htmlFor={`${frage.id}-${bewertung.value}`}
                        className="cursor-pointer"
                      >
                        {bewertung.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => router.push("/pflegegrad/start")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Button>
        
        <Button
          onClick={handleWeiter}
          disabled={!alleBeantwortet}
        >
          Weiter zu Modul 2
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
