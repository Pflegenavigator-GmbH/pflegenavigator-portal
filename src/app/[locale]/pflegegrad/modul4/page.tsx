"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

const FRAGEN = [
  {
    id: "selbstversorgung_1",
    text: "Können Sie sich selbstständig waschen und duschen?",
    hilfe: "Ganzkörperwäsche, Haare waschen, Handtuchtrocknen."
  },
  {
    id: "selbstversorgung_2",
    text: "Benötigen Sie Hilfe bei der Körperpflege (Zähne, Rasieren)?",
    hilfe: "Zähneputzen, Rasieren, Nagelpflege, Kämmen."
  },
  {
    id: "selbstversorgung_3",
    text: "Können Sie selbstständig essen und trinken?",
    hilfe: "Essen zum Mund führen, trinken, Kauen und Schlucken."
  },
  {
    id: "selbstversorgung_4",
    text: "Können Sie Toilette/Klo selbstständig nutzen?",
    hilfe: "Aufstehen, An- und Auskleiden, Saubermachen, Waschen."
  },
  {
    id: "selbstversorgung_5",
    text: "Benötigen Sie Hilfe beim An- und Auskleiden?",
    hilfe: "Oberbekleidung, Unterwäsche, Socken, Schuhe, Knöpfe, Reißverschlüsse."
  },
  {
    id: "selbstversorgung_6",
    text: "Können Sie Inkontinenz/Management selbstständig?",
    hilfe: "Windeln wechseln, Vorlagen wechseln, bei Unfällen helfen."
  },
  {
    id: "selbstversorgung_7",
    text: "Brauchen Sie Überwachung beim Essen/Trinken?",
    hilfe: "Aspiration, Einnahme sicherstellen, ausreichende Flüssigkeit."
  }
];

const BEWERTUNGEN = [
  { value: "0", label: "Keine Einschränkung", punkte: 0 },
  { value: "1", label: "Leichte Einschränkung", punkte: 25 },
  { value: "2", label: "Mittlere Einschränkung", punkte: 50 },
  { value: "3", label: "Schwere Einschränkung", punkte: 75 },
  { value: "4", label: "Völlig hilfsbedürftig", punkte: 100 }
];

export default function Modul4Page() {
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
    
    localStorage.setItem("modul4", JSON.stringify({
      modulId: 4,
      punkte: durchschnitt,
      antworten
    }));
    
    router.push("/pflegegrad/modul5");
  };

  const fortschritt = (Object.keys(antworten).length / FRAGEN.length) * 100;
  const alleBeantwortet = Object.keys(antworten).length === FRAGEN.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Sparkles className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Modul 4: Selbstversorgung</h1>
            <p className="text-emerald-700 font-semibold">Gewichtung: 40% – Wichtigste Kategorie!</p>
          </div>
        </div>
        
        <Progress value={fortschritt} className="w-full" />
        <p className="text-sm text-gray-500 mt-2">
          Frage {Object.keys(antworten).length} von {FRAGEN.length}
        </p>
      </div>

      <div className="space-y-6">
        {FRAGEN.map((frage, index) => (
          <motion.div
            key={frage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-emerald-100 hover:border-emerald-200 transition-colors">
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
        <Button variant="outline" onClick={() => router.push("/pflegegrad/modul3")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zu Modul 3
        </Button>
        <Button onClick={handleWeiter} disabled={!alleBeantwortet} className="bg-emerald-600 hover:bg-emerald-700">
          Weiter zu Modul 5
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
