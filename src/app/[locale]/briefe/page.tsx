"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BriefGenerator from "@/components/BriefGenerator";
import { FileText, Shield, Scale, Heart, Building2, GraduationCap, Wallet, HelpCircle } from "lucide-react";

const briefKategorien = [
  {
    id: "antrag-pflegegrad",
    name: "Antrag Pflegegrad",
    beschreibung: "Erstbeantragung bei der Pflegekasse",
    icon: Heart,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    id: "widerspruch-pflegegrad",
    name: "Widerspruch Pflegegrad",
    beschreibung: "Widerspruch gegen MDK-Bescheid",
    icon: Scale,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    id: "versorgungsamt",
    name: "Versorgungsamt",
    beschreibung: "Anfragen und Anträge",
    icon: Building2,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: "em-rente",
    name: "Erwerbsminderungsrente",
    beschreibung: "Antrag bei der Rentenversicherung",
    icon: Wallet,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    id: "schwerbehindertenausweis",
    name: "Schwerbehindertenausweis",
    beschreibung: "GdB-Antrag beim Versorgungsamt",
    icon: Shield,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    id: "betreuungsrecht",
    name: "Betreuungsrecht",
    beschreibung: "Vorsorgevollmacht, Patientenverfügung",
    icon: HelpCircle,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    id: "erbrecht",
    name: "Erbrecht",
    beschreibung: "Testament, Pflichtteil",
    icon: FileText,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    id: "allgemein",
    name: "Allgemeiner Brief",
    beschreibung: "Universitäten, Versicherungen, etc.",
    icon: GraduationCap,
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
];

export default function BriefePage() {
  const [ausgewaehlt, setAusgewaehlt] = useState<string | null>(null);

  if (ausgewaehlt) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => setAusgewaehlt(null)}
          className="mb-6 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        >
          ← Zurück zur Übersicht
        </button>
        <BriefGenerator typ={ausgewaehlt as any} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Brief-Generator
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Erstellen Sie professionelle Briefe für Behörden, Versicherungen und Gerichte. 
          Alle Vorlagen sind rechtlich geprüft und aktuell.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {briefKategorien.map((kategorie) => {
          const Icon = kategorie.icon;
          return (
            <motion.button
              key={kategorie.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAusgewaehlt(kategorie.id)}
              className={`p-6 rounded-xl border-2 border-transparent hover:border-gray-200 transition text-left ${kategorie.bg}`}
            >
              <div className={`w-12 h-12 ${kategorie.bg} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${kategorie.color}`} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {kategorie.name}
              </h3>
              <p className="text-sm text-gray-600">
                {kategorie.beschreibung}
              </p>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
        <h3 className="font-semibold text-blue-900 mb-2">
          💡 Hinweis zur Rechtssicherheit
        </h3>
        <p className="text-sm text-blue-800">
          Alle Briefvorlagen basieren auf aktuellen Gesetzen (SGB IX, SGB XI, BGB). 
          Für komplexe Fälle empfehlen wir dennoch eine Rechtsberatung. 
          PflegeNavigator übernimmt keine Haftung für rechtliche Fehler.
        </p>
      </div>
    </div>
  );
}
