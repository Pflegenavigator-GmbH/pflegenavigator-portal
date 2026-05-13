"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TagebuchPage() {
  const [eintrag, setEintrag] = useState("");
  const [datum, setDatum] = useState(new Date().toISOString().split("T")[0]);

  const speichern = () => {
    // Speichern in localStorage
    const eintraege = JSON.parse(localStorage.getItem("tagebuch") || "[]");
    eintraege.push({ datum, text: eintrag, id: Date.now() });
    localStorage.setItem("tagebuch", JSON.stringify(eintraege));
    setEintrag("");
    alert("Gespeichert!");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Pflegetagebuch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Datum</label>
              <Input
                type="date"
                value={datum}
                onChange={(e) => setDatum(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Was ist heute passiert?
              </label>
              <Textarea
                value={eintrag}
                onChange={(e) => setEintrag(e.target.value)}
                rows={5}
                placeholder="Beschreiben Sie den Tag..."
              />
            </div>
            <Button onClick={speichern} disabled={!eintrag}>
              Speichern
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-gray-500 mt-8 text-center">
        PflegeNavigator EU gUG bietet keine Rechtsberatung.
      </p>

      {/* Footer mit Impressum & Datenschutz */}
      <footer className="mt-8 pt-6 border-t border-slate-200">
        <div className="flex justify-center gap-6 text-sm text-slate-500">
          <a href="/impressum" className="hover:text-[#20b2aa]">Impressum</a>
          <span>|</span>
          <a href="/datenschutz" className="hover:text-[#20b2aa]">Datenschutz</a>
        </div>
      </footer>
    </div>
  );
}
