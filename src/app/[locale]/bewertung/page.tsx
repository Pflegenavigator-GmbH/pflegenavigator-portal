'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Loader2, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react'
import { useCaseStore } from '@/lib/store'

const MODULES = [
  { number: 1, name: 'Pflegegrad-Bewertung', duration: 15 },
  { number: 2, name: 'Hilfebedarf im Alltag', duration: 20 },
  { number: 3, name: 'Kognitive Einschränkungen', duration: 15 },
  { number: 4, name: 'Gesundheitliche Vorerkrankungen', duration: 10 },
  { number: 5, name: 'Wohnsituation', duration: 10 },
  { number: 6, name: 'Pflegende Angehörige', duration: 15 },
  { number: 7, name: 'Leistungen der Krankenkasse', duration: 15 },
  { number: 8, name: 'Soziales Umfeld', duration: 10 },
  { number: 9, name: 'Finanzielle Situation', duration: 15 },
  { number: 10, name: 'Rechtlicher Status', duration: 15 },
]

export default function BewertungPage() {
  const router = useRouter()
  const { caseId, caseCode, currentModule, setCase, setCurrentModule } = useCaseStore()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Bei Start: Neuen Fall erstellen falls keiner vorhanden
  useEffect(() => {
    if (!caseId) {
      createNewCase()
    } else {
      setIsLoading(false)
    }
  }, [caseId])

  async function createNewCase() {
    try {
      const res = await fetch('/api/cases', { method: 'POST' })
      const data = await res.json()
      
      if (!data.success) throw new Error(data.error)
      
      setCase(data.caseId, data.caseCode)
    } catch (err) {
      setError('Fehler beim Erstellen des Falls. Bitte versuchen Sie es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  const progress = ((currentModule - 1) / MODULES.length) * 100

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-slate-600">Ihre Bewertung wird vorbereitet...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={createNewCase}>Erneut versuchen</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-slate-900">Pflegebewertung</h1>
            <div className="text-sm text-slate-600">
              Fallcode: <span className="font-mono font-bold text-emerald-600">{caseCode}</span>
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-slate-600 mt-2">
            Modul {currentModule} von {MODULES.length}
          </p>
        </div>

        {/* Module Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Module</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {MODULES.map((mod) => (
                <button
                  key={mod.number}
                  onClick={() => setCurrentModule(mod.number)}
                  className={`
                    p-3 rounded-lg text-left transition-colors
                    ${currentModule === mod.number 
                      ? 'bg-emerald-100 border-2 border-emerald-500' 
                      : 'bg-slate-100 hover:bg-slate-200 border-2 border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{mod.number}</span>
                    {mod.number < currentModule && (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{mod.name}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            disabled={currentModule === 1}
            onClick={() => setCurrentModule(currentModule - 1)}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>
          
          <Button
            disabled={currentModule === MODULES.length}
            onClick={() => setCurrentModule(currentModule + 1)}
          >
            Weiter
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
