"use client";

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import AvatarChat from "@/components/AvatarChat";
import { 
  Baby, 
  Heart, 
  Puzzle, 
  Utensils, 
  Bath, 
  Moon, 
  Activity, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Info,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Star,
  Gamepad2
} from 'lucide-react';

// Kinder-Modus spezifische Typen
type AgeGroup = 'baby' | 'toddler' | 'preschool' | 'school';

interface ChildInfo {
  name: string;
  age: number;
  ageGroup: AgeGroup;
}

interface AssessmentCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  questions: Question[];
}

interface Question {
  id: string;
  text: string;
  simpleText: string; // Vereinfachte Sprache für Eltern
  options: {
    value: number;
    label: string;
    simpleLabel: string;
  }[];
}

interface AssessmentResult {
  level: number;
  points: number;
  maxPoints: number;
  description: string;
}

// Altersgruppen ermitteln
const getAgeGroup = (age: number): AgeGroup => {
  if (age < 1) return 'baby';
  if (age < 3) return 'toddler';
  if (age < 6) return 'preschool';
  return 'school';
};

// Altersgerechte Fragen für den Kinder-Modus
const getAssessmentCategories = (age: number): AssessmentCategory[] => {
  const ageGroup = getAgeGroup(age);
  
  const baseCategories: AssessmentCategory[] = [
    {
      id: 'mobility',
      name: 'Bewegung',
      icon: <Activity className="w-6 h-6" />,
      color: 'from-pink-400 to-rose-500',
      questions: [
        {
          id: 'mobility-1',
          text: 'Kann das Kind selbstständig laufen, rennen oder kriechen?',
          simpleText: 'Wie gut kann sich Ihr Kind bewegen?',
          options: [
            { value: 0, label: 'Selbstständig mobil', simpleLabel: '😊 Alles gut - läuft/kriecht allein' },
            { value: 1, label: 'Leichte Einschränkungen', simpleLabel: '😐 Manchmal Hilfe nötig' },
            { value: 2, label: 'Deutliche Einschränkungen', simpleLabel: '😕 Oft Hilfe nötig' },
            { value: 3, label: 'Stark eingeschränkt', simpleLabel: '😟 Sehr viel Hilfe nötig' }
          ]
        },
        {
          id: 'mobility-2',
          text: 'Treppensteigen, Treppenabwärtsgehen',
          simpleText: 'Kann Ihr Kind Treppen rauf und runter?',
          options: [
            { value: 0, label: 'Selbstständig', simpleLabel: '😊 Allein möglich' },
            { value: 1, label: 'Hilfsmittel/Anleitung', simpleLabel: '😐 Mit Handlauf oder Hilfe' },
            { value: 2, label: 'Hilfe erforderlich', simpleLabel: '😕 Jemand muss helfen' },
            { value: 3, label: 'Nicht möglich', simpleLabel: '😟 Geht gar nicht' }
          ]
        }
      ]
    },
    {
      id: 'cognitive',
      name: 'Denken & Lernen',
      icon: <Puzzle className="w-6 h-6" />,
      color: 'from-purple-400 to-violet-500',
      questions: [
        {
          id: 'cognitive-1',
          text: 'Versteht das Kind Anweisungen und kann es sich Dinge merken?',
          simpleText: 'Kann Ihr Kind verstehen und sich erinnern?',
          options: [
            { value: 0, label: 'Altersgemäß', simpleLabel: '😊 Passt zum Alter' },
            { value: 1, label: 'Leichte Verzögerung', simpleLabel: '😐 Etwas langsamer' },
            { value: 2, label: 'Deutliche Verzögerung', simpleLabel: '😕 Deutlich langsamer' },
            { value: 3, label: 'Stark verzögert', simpleLabel: '😟 Sehr viel Unterstützung nötig' }
          ]
        },
        {
          id: 'cognitive-2',
          text: 'Kann das Kind spielen und sich beschäftigen?',
          simpleText: 'Kann Ihr Kind alleine spielen?',
          options: [
            { value: 0, label: 'Selbstständig', simpleLabel: '😊 Spielt alleine' },
            { value: 1, label: 'Manchmal Unterstützung', simpleLabel: '😐 Manchmal Anstoß nötig' },
            { value: 2, label: 'Oft Unterstützung', simpleLabel: '😕 Meistens Begleitung nötig' },
            { value: 3, label: 'Ständige Unterstützung', simpleLabel: '😟 Immer jemand dabei nötig' }
          ]
        }
      ]
    },
    {
      id: 'selfcare',
      name: 'Essen & Anziehen',
      icon: <Utensils className="w-6 h-6" />,
      color: 'from-green-400 to-emerald-500',
      questions: [
        {
          id: 'selfcare-1',
          text: 'Kann das Kind selbst essen und trinken?',
          simpleText: 'Wie geht es mit Essen und Trinken?',
          options: [
            { value: 0, label: 'Selbstständig', simpleLabel: '😊 Isst und trinkt allein' },
            { value: 1, label: 'Leichte Hilfe', simpleLabel: '😐 Manchmal etwas helfen' },
            { value: 2, label: 'Deutliche Hilfe', simpleLabel: '😕 Meistens Hilfe nötig' },
            { value: 3, label: 'Vollständige Hilfe', simpleLabel: '😟 Füttern/Geben nötig' }
          ]
        },
        {
          id: 'selfcare-2',
          text: 'An- und Auskleiden, Toilette',
          simpleText: 'Kleidung und Windel/Toilette?',
          options: [
            { value: 0, label: 'Selbstständig', simpleLabel: '😊 Geht allein (altersgemäß)' },
            { value: 1, label: 'Manche Hilfe', simpleLabel: '😐 Manchmal beim Anziehen helfen' },
            { value: 2, label: 'Viel Hilfe', simpleLabel: '😕 Oft ganz anziehen/Windel wechseln' },
            { value: 3, label: 'Volle Hilfe', simpleLabel: '😟 Immer alles machen' }
          ]
        }
      ]
    },
    {
      id: 'communication',
      name: 'Sprechen & Kontakt',
      icon: <Heart className="w-6 h-6" />,
      color: 'from-orange-400 to-amber-500',
      questions: [
        {
          id: 'communication-1',
          text: 'Kann das Kind mitteilen, was es braucht?',
          simpleText: 'Kann sich Ihr Kind mitteilen?',
          options: [
            { value: 0, label: 'Gut kommunizierend', simpleLabel: '😊 Spricht/zeigt was es will' },
            { value: 1, label: 'Manchmal unklar', simpleLabel: '😐 Manchmal raten nötig' },
            { value: 2, label: 'Oft unklar', simpleLabel: '😕 Häufig nicht verständlich' },
            { value: 3, label: 'Kaum kommunizierend', simpleLabel: '😟 Sehr schwierig zu verstehen' }
          ]
        }
      ]
    },
    {
      id: 'sleep',
      name: 'Schlaf & Nacht',
      icon: <Moon className="w-6 h-6" />,
      color: 'from-indigo-400 to-blue-500',
      questions: [
        {
          id: 'sleep-1',
          text: 'Wie ist der Schlaf des Kindes?',
          simpleText: 'Wie schläft Ihr Kind nachts?',
          options: [
            { value: 0, label: 'Durchschlafend', simpleLabel: '😊 Schlaf gut durch' },
            { value: 1, label: 'Selten Probleme', simpleLabel: '😐 Manchmal wach' },
            { value: 2, label: 'Häufig Probleme', simpleLabel: '😕 Oft aufwachen/Probleme' },
            { value: 3, label: 'Intensive Probleme', simpleLabel: '😟 Die ganze Nacht wach/betreuung' }
          ]
        }
      ]
    },
    {
      id: 'hygiene',
      name: 'Waschen & Baden',
      icon: <Bath className="w-6 h-6" />,
      color: 'from-cyan-400 to-teal-500',
      questions: [
        {
          id: 'hygiene-1',
          text: 'Körperpflege, Baden, Duschen',
          simpleText: 'Wie läuft Baden und Waschen?',
          options: [
            { value: 0, label: 'Selbstständig', simpleLabel: '😊 Allein möglich (altersgemäß)' },
            { value: 1, label: 'Anleitung nötig', simpleLabel: '😐 Dabei sein und helfen' },
            { value: 2, label: 'Deutliche Hilfe', simpleLabel: '😕 Viel mitwaschen/helfen' },
            { value: 3, label: 'Vollständige Hilfe', simpleLabel: '😟 Alles übernehmen' }
          ]
        }
      ]
    }
  ];

  // Altersanpassung für Babys unter 18 Monaten
  if (ageGroup === 'baby') {
    baseCategories.forEach(cat => {
      cat.questions.forEach(q => {
        // Anpassung der Optionen für sehr kleine Kinder
        q.options = q.options.map(opt => ({
          ...opt,
          label: opt.label.replace('Selbstständig', 'Entwicklungsgemäß').replace('Selbstständig mobil', 'Entwicklungsgemäß')
        }));
      });
    });
  }

  return baseCategories;
};

// Pflegegrad-Berechnung für Kinder (angepasst)
const calculateChildCareLevel = (points: number, age: number): AssessmentResult => {
  // Kinder unter 18 Monaten: Kein Pflegegrad 1, erst ab PG2
  if (age < 1.5) {
    if (points < 30) {
      return {
        level: 0,
        points,
        maxPoints: 100,
        description: 'Noch kein Pflegegrad - Entwicklungsverzögerung dokumentieren'
      };
    }
    if (points < 50) {
      return {
        level: 2,
        points,
        maxPoints: 100,
        description: 'Pflegegrad 2 möglich - trotz jungen Alters'
      };
    }
    if (points < 70) {
      return {
        level: 3,
        points,
        maxPoints: 100,
        description: 'Pflegegrad 3 - deutlicher Unterstützungsbedarf'
      };
    }
    if (points < 90) {
      return {
        level: 4,
        points,
        maxPoints: 100,
        description: 'Pflegegrad 4 - hoher Unterstützungsbedarf'
      };
    }
    return {
      level: 5,
      points,
      maxPoints: 100,
      description: 'Pflegegrad 5 - schwerstpflegebedürftig'
    };
  }

  // Ältere Kinder: Normale Skala
  if (points < 15) {
    return {
      level: 0,
      points,
      maxPoints: 100,
      description: 'Noch kein Pflegegrad'
    };
  }
  if (points < 30) {
    return {
      level: 1,
      points,
      maxPoints: 100,
      description: 'Pflegegrad 1 - geringer Unterstützungsbedarf'
    };
  }
  if (points < 50) {
    return {
      level: 2,
      points,
      maxPoints: 100,
      description: 'Pflegegrad 2 - erheblicher Unterstützungsbedarf'
    };
  }
  if (points < 70) {
    return {
      level: 3,
      points,
      maxPoints: 100,
      description: 'Pflegegrad 3 - schwerer Unterstützungsbedarf'
    };
  }
  if (points < 90) {
    return {
      level: 4,
      points,
      maxPoints: 100,
      description: 'Pflegegrad 4 - schwerster Unterstützungsbedarf'
    };
  }
  return {
    level: 5,
    points,
    maxPoints: 100,
    description: 'Pflegegrad 5 - schwerstpflegebedürftig'
  };
};

// Vereinfachte Altersvergleichs-Info
const getAgeComparisonInfo = (age: number): string => {
  const ageGroup = getAgeGroup(age);
  const comparisons: Record<AgeGroup, string> = {
    baby: "Babys Ihres Alters können normalerweise: Nacken halten, Greifen, Lallen, auf dem Bauch liegen",
    toddler: "Kleinkinder Ihres Alters können normalerweise: Laufen, einfache Wörter sagen, mit Bauklötzen spielen",
    preschool: "Vorschulkinder Ihres Alters können normalerweise: Sätze bilden, Toilette nutzen, allein spielen",
    school: "Schulkinder Ihres Alters können normalerweise: Lesen lernen, sich allein anziehen, Freunde treffen"
  };
  return comparisons[ageGroup];
};

export default function KinderModusPage() {
  const [step, setStep] = useState<'intro' | 'info' | 'assessment' | 'result'>('intro');
  const [childInfo, setChildInfo] = useState<ChildInfo>({ name: '', age: 3, ageGroup: 'toddler' });
  const [currentCategory, setCurrentCategory] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showAvatarChat, setShowAvatarChat] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const categories = getAssessmentCategories(childInfo.age);
  const totalQuestions = categories.reduce((sum, cat) => sum + cat.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const handleAgeChange = (age: number) => {
    setChildInfo(prev => ({
      ...prev,
      age,
      ageGroup: getAgeGroup(age)
    }));
  };

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentCategory < categories.length - 1) {
      setCurrentCategory(prev => prev + 1);
    } else {
      // Berechnung
      const totalPoints = Object.values(answers).reduce((sum, val) => sum + val, 0) * 5;
      const maxPoints = totalQuestions * 3 * 5;
      const normalizedPoints = Math.round((totalPoints / maxPoints) * 100);
      
      const calculatedResult = calculateChildCareLevel(normalizedPoints, childInfo.age);
      setResult(calculatedResult);
      setStep('result');
    }
  };

  const handleBack = () => {
    if (currentCategory > 0) {
      setCurrentCategory(prev => prev - 1);
    } else {
      setStep('info');
    }
  };

  const currentCat = categories[currentCategory];
  const currentQuestions = currentCat?.questions || [];

  // Intro Screen
  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          {/* Bunter Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 mb-4 shadow-lg">
              <Baby className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
              Kinder-Modus 🌟
            </h1>
            <p className="text-lg text-gray-600">
              Pflegegrad-Beratung für kleine Schätze
            </p>
          </div>

          {/* Info-Karten */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Card className="border-2 border-pink-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-pink-100 to-pink-50">
                <CardTitle className="flex items-center gap-2 text-pink-700">
                  <Heart className="w-5 h-5" />
                  Für wen ist das?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                    <span>Kinder mit Behinderung oder Erkrankung</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                    <span>Entwicklungsverzögerungen jeder Art</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                    <span>Chronische Erkrankungen im Kindesalter</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Info className="w-5 h-5" />
                  Was ist anders?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                    <span>Altersgerechte Vergleiche mit gesunden Kindern</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                    <span>Kein Pflegegrad 1 unter 18 Monaten</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                    <span>Einfache Sprache für erschöpfte Eltern</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <Button 
              onClick={() => setStep('info')}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white text-xl px-8 py-6 rounded-2xl shadow-xl"
            >
              <Gamepad2 className="w-6 h-6 mr-2" />
              Los geht's!
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Info Eingabe Screen
  if (step === 'info') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Card className="border-2 border-purple-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
              <CardTitle className="text-2xl text-purple-800">
                👋 Erst ein paar Infos
              </CardTitle>
              <CardDescription className="text-purple-600">
                Das hilft uns, altersgerechte Fragen zu stellen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name Ihres Kindes (optional)
                </label>
                <Input
                  value={childInfo.name}
                  onChange={(e) => setChildInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="z.B. Maxi"
                  className="text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alter in Jahren
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    min="0"
                    max="18"
                    step="0.5"
                    value={childInfo.age}
                    onChange={(e) => handleAgeChange(parseFloat(e.target.value))}
                    className="text-lg w-32"
                  />
                  <span className="text-gray-600">
                    Jahre
                  </span>
                </div>
                <p className="mt-2 text-sm text-purple-600 bg-purple-50 p-2 rounded">
                  {childInfo.age < 1.5 ? (
                    <span className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Unter 18 Monaten: Kein Pflegegrad 1 möglich
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Alle Pflegegrade möglich
                    </span>
                  )}
                </p>
              </div>

              {/* Altersgruppen-Visualisierung */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                <h3 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
                  <Baby className="w-5 h-5" />
                  Vergleich mit gleichaltrigen Kindern
                </h3>
                <p className="text-gray-700">
                  {getAgeComparisonInfo(childInfo.age)}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setStep('intro')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Zurück
              </Button>
              <Button 
                onClick={() => setStep('assessment')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center gap-2"
              >
                Weiter
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Assessment Screen
  if (step === 'assessment') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Fortschrittsanzeige */}
          <div className="mb-6 pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Bereich {currentCategory + 1} von {categories.length}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.round(progress)}% geschafft
              </span>
            </div>
            <Progress 
              value={progress} 
              className="h-3 bg-gray-200"
            />
            <div className="flex gap-1 mt-2">
              {categories.map((cat, idx) => (
                <div 
                  key={cat.id}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    idx < currentCategory ? 'bg-green-500' :
                    idx === currentCategory ? `bg-gradient-to-r ${cat.color}` :
                    'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Haupt-Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Fragen-Bereich */}
            <div className="lg:col-span-2 space-y-4">
              {/* Kategorie-Header */}
              <Card className={`border-2 shadow-lg overflow-hidden`}>
                <div className={`h-2 bg-gradient-to-r ${currentCat.color}`} />
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${currentCat.color} text-white`}>
                      {currentCat.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{currentCat.name}</CardTitle>
                      <CardDescription>
                        Fragen zu {currentCat.name.toLowerCase()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentQuestions.map((question, idx) => (
                    <div key={question.id} className="space-y-3">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {idx + 1}. {question.simpleText}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {question.text}
                      </p>
                      <RadioGroup
                        value={answers[question.id]?.toString()}
                        onValueChange={(val) => handleAnswer(question.id, parseInt(val))}
                        className="space-y-2"
                      >
                        {question.options.map((opt) => (
                          <label
                            key={opt.value}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              answers[question.id] === opt.value
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                            }`}
                          >
                            <RadioGroupItem 
                              value={opt.value.toString()} 
                              id={`${question.id}-${opt.value}`}
                            />
                            <span className="text-gray-700">
                              {opt.simpleLabel}
                            </span>
                          </label>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handleBack}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Zurück
                  </Button>
                  <Button 
                    onClick={handleNext}
                    disabled={currentQuestions.some(q => answers[q.id] === undefined)}
                    className={`bg-gradient-to-r ${currentCat.color} text-white flex items-center gap-2`}
                  >
                    {currentCategory < categories.length - 1 ? 'Weiter' : 'Ergebnis'}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>

              {/* Eltern-Info-Bereich */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium mb-1">
                      💡 Tipp für Eltern
                    </p>
                    <p className="text-sm text-blue-700">
                      Beantworten Sie die Fragen so ehrlich wie möglich. Es ist normal, 
                      dass Kinder Hilfe brauchen. Es geht darum, wie es aktuell ist - 
                      nicht wie es mal war oder sein sollte.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Avatar Chat Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <Baby className="w-5 h-5" />
                      Kinder-Assistent
                    </h3>
                    <p className="text-purple-100 text-sm">
                      Frag mich alles zum Thema!
                    </p>
                  </div>
                  <div className="h-[400px]">
                    <AvatarChat 
                      initialMessage={`Hallo! Ich helfe Ihnen bei der Pflegegrad-Bewertung für ${childInfo.name || 'Ihr Kind'}. Haben Sie Fragen zu den Bereichen oder brauchen Sie Hilfe?`}
                      topic="kinder-pflegegrad"
                      showVoiceHints={true}
                    />
                  </div>
                </div>

                {/* Schnell-Hilfe Buttons */}
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-600 mb-2">Häufige Fragen:</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full text-left justify-start text-sm"
                    onClick={() => setShowAvatarChat(true)}
                  >
                    <span className="mr-2">❓</span> Was bedeutet PG2?
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full text-left justify-start text-sm"
                  >
                    <span className="mr-2">📋</span> Was brauche ich?
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full text-left justify-start text-sm"
                  >
                    <span className="mr-2">⏱️</span> Wie lange dauert es?
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Result Screen
  if (step === 'result' && result) {
    const isBabyUnder18Months = childInfo.age < 1.5;
    const showPG1Warning = result.level === 1 && isBabyUnder18Months;

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
        <div className="max-w-3xl mx-auto pt-8">
          <Card className="border-2 shadow-2xl overflow-hidden">
            {/* Ergebnis-Header */}
            <div className={`h-32 bg-gradient-to-r ${
              result.level === 0 ? 'from-gray-400 to-gray-500' :
              result.level === 1 ? 'from-green-400 to-green-500' :
              result.level === 2 ? 'from-yellow-400 to-orange-500' :
              result.level === 3 ? 'from-orange-400 to-red-500' :
              result.level === 4 ? 'from-red-400 to-red-600' :
              'from-purple-500 to-purple-700'
            } flex items-center justify-center`}>
              <div className="text-center text-white">
                <div className="text-5xl mb-2">
                  {result.level === 0 ? '🤔' :
                   result.level === 1 ? '👍' :
                   result.level === 2 ? '💪' :
                   result.level === 3 ? '🌟' :
                   result.level === 4 ? '❤️' : '💜'}
                </div>
                <h1 className="text-2xl font-bold">
                  {result.level === 0 ? 'Noch kein Pflegegrad' :
                   result.level >= 2 || !isBabyUnder18Months ? `Pflegegrad ${result.level}` :
                   'Pflegegrad 2 (statt 1)'}
                </h1>
              </div>
            </div>

            <CardContent className="pt-8 space-y-6">
              {/* Punkte-Anzeige */}
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-800 mb-2">
                  {result.points} Punkte
                </p>
                <p className="text-gray-600">von maximal {result.maxPoints} möglichen Punkten</p>
              </div>

              {/* Beschreibung */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl">
                <p className="text-lg text-gray-800 text-center">
                  {result.description}
                </p>
              </div>

              {/* Baby-Warnung */}
              {showPG1Warning && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-amber-800 mb-1">
                        ⚠️ Wichtiger Hinweis für Babys unter 18 Monaten
                      </p>
                      <p className="text-amber-700">
                        Kinder unter 18 Monaten können keinen Pflegegrad 1 erhalten, 
                        auch wenn die Punkte dafür reichen würden. Stattdessen wird 
                        Pflegegrad 2 gewährt. Die Verzögerung muss dokumentiert sein.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nächste Schritte */}
              <div className="space-y-4">
                <h3 className="font-semibold text-xl text-gray-800 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5" />
                  Was kommt jetzt?
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-green-200">
                    <CardContent className="pt-4">
                      <p className="font-medium text-green-800 mb-2">1. Antrag stellen</p>
                      <p className="text-sm text-gray-600">
                        Beim Medizinischen Dienst (MDK) oder Ihrer Pflegekasse
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-blue-200">
                    <CardContent className="pt-4">
                      <p className="font-medium text-blue-800 mb-2">2. Gutachten</p>
                      <p className="text-sm text-gray-600">
                        Ein Gutachter kommt zu Ihnen nach Hause
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-purple-200">
                    <CardContent className="pt-4">
                      <p className="font-medium text-purple-800 mb-2">3. Bescheid</p>
                      <p className="text-sm text-gray-600">
                        Sie erhalten Post mit dem Ergebnis
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-orange-200">
                    <CardContent className="pt-4">
                      <p className="font-medium text-orange-800 mb-2">4. Geld fließt</p>
                      <p className="text-sm text-gray-600">
                        Pflegegeld oder Sachleistungen
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Altersvergleich nochmal */}
              <div className="bg-white border-2 border-pink-200 rounded-xl p-4">
                <h3 className="font-semibold text-pink-800 mb-2 flex items-center gap-2">
                  <Baby className="w-5 h-5" />
                  Zur Erinnerung: Entwicklung bei {childInfo.age} Jahren
                </h3>
                <p className="text-gray-700">
                  {getAgeComparisonInfo(childInfo.age)}
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="outline" 
                onClick={() => setStep('assessment')}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück zur Bewertung
              </Button>
              <Button 
                onClick={() => setStep('intro')}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Neu starten
              </Button>
            </CardFooter>
          </Card>

          {/* Avatar Chat am Ende */}
          <div className="mt-8">
            <Card className="border-2 border-purple-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
                <CardTitle className="text-purple-800 flex items-center gap-2">
                  <Baby className="w-6 h-6" />
                  Noch Fragen?
                </CardTitle>
                <CardDescription className="text-purple-600">
                  Ich helfe Ihnen weiter beim Kinder-Pflegegrad
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px]">
                  <AvatarChat 
                    initialMessage={`Super! Die Bewertung ist fertig. ${result.level > 0 ? `Es sieht nach Pflegegrad ${result.level} aus.` : 'Es sieht so aus, als bräuchten Sie noch etwas Zeit.'} Möchten Sie wissen, wie es weitergeht?`}
                    topic="kinder-pflegegrad-ergebnis"
                    showVoiceHints={true}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
}