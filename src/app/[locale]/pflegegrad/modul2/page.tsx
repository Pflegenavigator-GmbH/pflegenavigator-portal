"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Brain } from "lucide-react";

const FRAGEN = [
  {
    id: "kognition_1",
    text: "Wissen Sie immer, wo Sie sind (Orientierung)?",
    hilfe: "Können Sie sich in der Wohnung, im Ort zurechtfinden?"
  },
  {
    id: "kognition_2",
    text: "Können Sie sich an aktuelle Ereignisse erinnern?",
    hilfe: "Was haben Sie heute gegessen? Wer war heute zu Besuch?"
  },
  {
    id: "kognition_3",
    text: "Können Sie komplexe Entscheidungen treffen?",
    hilfe: "Z.B. Finanzielles, Ärztliches, Wohnen."
  },
  {
    id: "kognition_4",
    text: "Verstehen Sie Gespräche und können antworten?",
    hilfe: "Folgen Sie Gesprächen? Können Sie sich ausdrücken?"
  },
  {
    id: "kognition_5",
    text: "Können Sie lesen und schreiben?",
    hilfe: "Briefe lesen, Einkaufszettel schreiben."
  }
];

const BEWERTUNGEN = [
  { value: "0", label: "Keine Einschränkung", punkte: 0 },
  { value: "1", label: "Leichte Einschränkung", punkte: 25 },
  { value: "2", label: "Mittlere Einschränkung", punkte: 50 },
  { value: "3", label: "Schwere Einschränkung", punkte: 75 },
  { value: "4", label: "Völlig hilfsbedürftig", punkte: 100 }
];

export default function Modul2Page() {
  const router = useRouter();
  const [antworten, setAntworten] = useState<Record<string, string>>({});

  const handleAntwort = (frageId: string, wert: string) => {
    setAntworten(prev => ({ ...prev, [frageId]: wert }));
  };

  const handleWeiter = () => {
    let gesamtPunkte = 0;
    Object.entries(antworten).forEach(([_, wert]) => {
      const bewertung = BEWERTUNGEN.find(b => b.value === wert);
      if (bewertung) gesamtPunkte += bewertung.punkte;
    });
    const durchschnitt = gesamtPunkte / Object.keys(antworten).length;
    
    localStorage.setItem("modul2", JSON.stringify({
      modulId: 2,
      punkte: durchschnitt,
      antworten
    }));
    
    router.push("/pflegegrad/modul3");
  };

  const fortschritt = (Object.keys(antworten).length / FRAGEN.length) * 100;
  const alleBeantwortet = Object.keys(antworten).length === FRAGEN.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Modul 2: Kognition & Kommunikation</h1>
            <p className="text-gray-600">Gewichtung: 15% (Oder Modul 3, je nachdem was höher ist)</p>
          </div>
        </div>
        
        <Progress value={fortschritt} className="w-full" />
      </div>

      <div className="space-y-6">
        {FRAGEN.map((frage, index) => (
          <motion.div
            key={frage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-2">{frage.text}</h3>
                <p className="text-sm text-gray-500 mb-4">{frage.hilfe}</p>
                
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
                      <Label htmlFor={`${frage.id}-${bewertung.value}`}>
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

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => router.push("/pflegegrad/modul1")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Button>
        <Button onClick={handleWeiter} disabled={!alleBeantwortet}>
          Weiter zu Modul 3
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
