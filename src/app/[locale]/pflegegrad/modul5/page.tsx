"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, HeartPulse } from "lucide-react";

const FRAGEN = [
  {
    id: "krankheit_1",
    text: "Können Sie Ihre Medikamente selbstständig einnehmen?",
    hilfe: "Inklusive richtiger Dosierung und Zeitpunkt. Zählen Sie auch Hilfe beim Öffnen von Blisterverpackungen oder Flaschen."
  },
  {
    id: "krankheit_2",
    text: "Können Sie Therapien (z.B. Spritzen, Inhalationen) selbst durchführen?",
    hilfe: "Umfasst Insulinspritzen, Inhalationen, Wundversorgung oder andere ärztlich verordnete Behandlungen."
  },
  {
    id: "krankheit_3",
    text: "Können Sie Arztbesuche und Termine eigenständig organisieren und wahrnehmen?",
    hilfe: "Inklusive Anmeldung bei der Praxis, Transport zum Arzt und Einhalten von Terminen."
  },
  {
    id: "krankheit_4",
    text: "Können Sie bei Beschwerden oder Symptomen angemessen reagieren?",
    hilfe: "Erkennen Sie Warnzeichen? Wissen Sie, wann Sie Hilfe rufen oder den Arzt kontaktieren müssen?"
  },
  {
    id: "krankheit_5",
    text: "Können Sie mit Ihrer Erkrankung und den Einschränkungen psychisch umgehen?",
    hilfe: "Frustbewältigung, Umgang mit Ängsten oder depressiven Verstimmungen durch die Erkrankung."
  },
  {
    id: "krankheit_6",
    text: "Können Sie den Überblick über Ihre Gesundheitsdokumente behalten?",
    hilfe: "Befunde, Medikamentenpläne, Impfpass – können Sie diese ordnen und bei Bedarf finden?"
  }
];

const BEWERTUNGEN = [
  { value: "0", label: "Keine Einschränkung", punkte: 0 },
  { value: "1", label: "Leichte Einschränkung", punkte: 25 },
  { value: "2", label: "Mittlere Einschränkung", punkte: 50 },
  { value: "3", label: "Schwere Einschränkung", punkte: 75 },
  { value: "4", label: "Völlig hilfsbedürftig", punkte: 100 }
];

export default function Modul5Page() {
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
    
    localStorage.setItem("modul5", JSON.stringify({
      modulId: 5,
      punkte: durchschnitt,
      antworten
    }));
    
    router.push("/pflegegrad/modul6");
  };

  const handleZurueck = () => {
    router.push("/pflegegrad/modul4");
  };

  const fortschritt = (Object.keys(antworten).length / FRAGEN.length) * 100;
  const alleBeantwortet = Object.keys(antworten).length === FRAGEN.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-rose-100 rounded-lg">
            <HeartPulse className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Modul 5: Krankheitsbewältigung</h1>
            <p className="text-gray-600">Gewichtung: 20%</p>
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
            <Card className="border-rose-100">
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
          onClick={handleZurueck}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zu Modul 4
        </Button>
        
        <Button
          onClick={handleWeiter}
          disabled={!alleBeantwortet}
          className="bg-rose-600 hover:bg-rose-700"
        >
          Weiter zu Modul 6
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
