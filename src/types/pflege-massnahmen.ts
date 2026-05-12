/**
 * Pflege-Maßnahmen System - TypeScript Interfaces
 * Für Pflegedienst-App und Patienten-Portal
 */

// ============================================
// ENUMS
// ============================================

export enum PflegeKategorie {
  KOERPERPFLEGE = 'koerperpflege',
  ERNAEHRUNG = 'ernaehrung',
  MOBILITAET = 'mobilitaet',
  MEDIKAMENTE = 'medikamente',
  WUNDVERSORGUNG = 'wundversorgung',
  VITALZEICHEN = 'vitalzeichen',
  KOMMUNIKATION = 'kommunikation',
  SONSTIGES = 'sonstiges'
}

export enum MassnahmeStatus {
  DURCHGEFUEHRT = 'durchgefuehrt',
  VERSPAETET = 'verspaetet',
  ABGEBROCHEN = 'abgebrochen',
  GEPLANT = 'geplant',
  NICHT_DURCHGEFUEHRT = 'nicht_durchgefuehrt'
}

export enum BenutzerRolle {
  PFLEGEDIENST = 'pflegedienst',
  PFLEGEKRAFT = 'pflegekraft',
  PATIENT = 'patient',
  ANGEHOERIGER = 'angehoeriger'
}

// ============================================
// HAUPT-INTERFACE: Pflege-Maßnahme
// ============================================

export interface PflegeMassnahme {
  id: string;
  
  // Beziehungen
  patientId: string;
  patientName?: string; // Optional für Anzeige
  pflegekraftId: string;
  pflegekraftName?: string;
  pflegedienstId: string;
  pflegedienstName?: string;
  
  // Maßnahme-Details
  kategorie: PflegeKategorie;
  unterkategorie?: string; // z.B. "Ganzwäsche", "Teilwäsche"
  beschreibung: string;
  durchgefuehrtAm: Date | string;
  naechsterTermin?: Date | string;
  dauerMinuten?: number;
  
  // Optionale Details
  notizen?: string;
  interneNotizen?: string; // Nur für Pflegedienst sichtbar
  dokumente?: Dokument[];
  
  // Vitalzeichen (optional)
  vitalzeichen?: Vitalzeichen;
  
  // Schmerz (0-10)
  schmerzScore?: number;
  
  // Allgemeiner Zustand
  zustandPatient?: 'sehr_gut' | 'gut' | 'mittel' | 'schlecht' | 'sehr_schlecht';
  
  // Status
  status: MassnahmeStatus;
  abbruchGrund?: string;
  
  // Freigabe
  freigegebenFuerPatient: boolean;
  freigegebenAm?: Date | string;
  freigegebenVon?: string;
  
  // Feedback vom Patienten/Angehörigen
  patientFeedback?: PatientFeedback;
  
  // Metadaten
  erstelltAm: Date | string;
  aktualisiertAm: Date | string;
  version: number; // Für Optimistic Locking
}

// ============================================
// UNTER-INTERFACES
// ============================================

export interface Dokument {
  id: string;
  url: string;
  titel: string;
  typ: 'bild' | 'pdf' | 'audio' | 'video';
  groesseKb: number;
  hochgeladenAm: Date | string;
  hochgeladenVon: string;
}

export interface Vitalzeichen {
  blutdruckSystolisch?: number;
  blutdruckDiastolisch?: number;
  blutdruck?: string; // Alternative: "120/80"
  puls?: number;
  temperatur?: number;
  blutzucker?: number;
  sauerstoffsaettigung?: number; // SpO2 in %
  atmungsfrequenz?: number;
  gewicht?: number;
  gemessenAm: Date | string;
}

export interface PatientFeedback {
  bewertung?: number; // 1-5 Sterne
  kommentar?: string;
  beduerfnisse?: string;
  besonderheiten?: string;
  erstelltAm: Date | string;
  erstelltVon: 'patient' | 'angehoeriger';
  name?: string; // Name des Angehörigen
}

// ============================================
// DASHBOARD & ÜBERSICHTEN
// ============================================

export interface PatientenDashboard {
  patientId: string;
  patientName: string;
  pflegegrad?: number;
  
  // Heute
  heuteErledigt: number;
  heuteGeplant: number;
  heuteVerspaetet: number;
  
  // Übersicht
  aktuelleMassnahmen: PflegeMassnahme[];
  letzteAktualisierung: Date | string;
  
  // Termine
  naechsteTermine: Termin[];
  
  // Statistik (letzte 7 Tage)
  statistik7Tage: WochenStatistik;
  
  // Benachrichtigungen
  ungeleseneEintraege: number;
  neueDokumente: number;
  wartendesFeedback: number;
}

export interface Termin {
  id: string;
  datum: Date | string;
  uhrzeitVon: string;
  uhrzeitBis?: string;
  titel: string;
  beschreibung?: string;
  kategorie: PflegeKategorie;
  pflegekraftName?: string;
  bestaetigt: boolean;
}

export interface WochenStatistik {
  montag: TagesStatistik;
  dienstag: TagesStatistik;
  mittwoch: TagesStatistik;
  donnerstag: TagesStatistik;
  freitag: TagesStatistik;
  samstag: TagesStatistik;
  sonntag: TagesStatistik;
}

export interface TagesStatistik {
  datum: Date | string;
  anzahlMassnahmen: number;
  durchgefuehrt: number;
  verspaetet: number;
  abgebrochen: number;
}

// ============================================
// PFLEGEDIENST-ANSICHT
// ============================================

export interface PflegedienstDashboard {
  pflegedienstId: string;
  pflegedienstName: string;
  
  // Heute
  patientenHeute: number;
  massnahmenHeute: number;
  durchgefuehrtHeute: number;
  offenHeute: number;
  
  // Übersicht
  meinePatienten: PatientUebersicht[];
  aktivePflegekraefte: PflegekraftUebersicht[];
  
  // Warnungen
  warnungen: Warnung[];
  
  // Statistik
  statistikMonat: MonatsStatistik;
}

export interface PatientUebersicht {
  patientId: string;
  name: string;
  geburtsdatum?: Date | string;
  pflegegrad?: number;
  adresse: string;
  telefon?: string;
  notfallkontakt?: string;
  
  // Aktueller Status
  letzteMassnahme?: Date | string;
  naechsterTermin?: Date | string;
  offeneMassnahmen: number;
  wartendesFeedback: boolean;
  
  // Schnellzugriff
  letzte7TageDurchgefuehrt: number;
  letzte7TageGeplant: number;
}

export interface PflegekraftUebersicht {
  pflegekraftId: string;
  name: string;
  email: string;
  telefon?: string;
  rolle: 'leitung' | 'fachkraft' | 'hilfskraft';
  
  // Heute
  patientenHeute: number;
  massnahmenHeute: number;
  status: 'online' | 'unterwegs' | 'offline';
  letzteAktivitaet?: Date | string;
}

export interface Warnung {
  id: string;
  typ: 'verspaetung' | 'abbruch' | 'schmerz' | 'vitalzeichen_kritisch' | 'feedback_wichtig';
  prioritaet: 'niedrig' | 'mittel' | 'hoch' | 'kritisch';
  titel: string;
  beschreibung: string;
  patientId: string;
  patientName: string;
  massnahmeId?: string;
  erstelltAm: Date | string;
  gelesen: boolean;
}

export interface MonatsStatistik {
  monat: number;
  jahr: number;
  gesamtMassnahmen: number;
  durchgefuehrt: number;
  verspaetet: number;
  abgebrochen: number;
  patientenzufriedenheit: number; // Durchschnitt 1-5
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

// Create
export interface CreateMassnahmeRequest {
  patientId: string;
  kategorie: PflegeKategorie;
  unterkategorie?: string;
  beschreibung: string;
  durchgefuehrtAm: Date | string;
  naechsterTermin?: Date | string;
  dauerMinuten?: number;
  notizen?: string;
  interneNotizen?: string;
  vitalzeichen?: Vitalzeichen;
  schmerzScore?: number;
  zustandPatient?: 'sehr_gut' | 'gut' | 'mittel' | 'schlecht' | 'sehr_schlecht';
  status: MassnahmeStatus;
  dokumente?: File[]; // Upload-Files
}

export interface CreateMassnahmeResponse {
  success: boolean;
  data?: PflegeMassnahme;
  error?: string;
}

// Update
export interface UpdateMassnahmeRequest {
  beschreibung?: string;
  status?: MassnahmeStatus;
  notizen?: string;
  interneNotizen?: string;
  vitalzeichen?: Vitalzeichen;
  schmerzScore?: number;
  zustandPatient?: 'sehr_gut' | 'gut' | 'mittel' | 'schlecht' | 'sehr_schlecht';
  abbruchGrund?: string;
  naechsterTermin?: Date | string;
}

// Freigabe
export interface FreigabeRequest {
  freigegeben: boolean;
  grund?: string;
}

// Filter
export interface MassnahmenFilter {
  patientId?: string;
  pflegekraftId?: string;
  kategorie?: PflegeKategorie;
  status?: MassnahmeStatus;
  vonDatum?: Date | string;
  bisDatum?: Date | string;
  freigegeben?: boolean;
  suchbegriff?: string;
}

// Feedback
export interface CreateFeedbackRequest {
  bewertung: number;
  kommentar?: string;
  beduerfnisse?: string;
  besonderheiten?: string;
  erstelltVon: 'patient' | 'angehoeriger';
  name?: string;
}

// ============================================
// KATEGORIE-KONFIGURATION
// ============================================

export const PFLEGE_KATEGORIEN_CONFIG: Record<PflegeKategorie, {
  label: string;
  icon: string;
  emoji: string;
  unterkategorien: string[];
  farbe: string;
}> = {
  [PflegeKategorie.KOERPERPFLEGE]: {
    label: 'Körperpflege',
    icon: 'Droplets',
    emoji: '🚿',
    farbe: '#3b82f6', // blue-500
    unterkategorien: [
      'Ganzwäsche',
      'Teilwäsche',
      'Duschen',
      'Baden',
      'Rasieren',
      'Nagelpflege',
      'Haarpflege',
      'Zahnpflege',
      'Hautpflege',
      'Windelwechsel'
    ]
  },
  [PflegeKategorie.ERNAEHRUNG]: {
    label: 'Ernährung',
    icon: 'Utensils',
    emoji: '🍽️',
    farbe: '#22c55e', // green-500
    unterkategorien: [
      'Frühstück',
      'Mittagessen',
      'Abendessen',
      'Zwischenmahlzeit',
      'Flüssigkeitszufuhr',
      'Sonderkost',
      'Sondenkost',
      'Hilfe beim Essen'
    ]
  },
  [PflegeKategorie.MOBILITAET]: {
    label: 'Mobilität',
    icon: 'PersonStanding',
    emoji: '🚶',
    farbe: '#f59e0b', // amber-500
    unterkategorien: [
      'Lagerung',
      'Umlagerung',
      'Transfer Bett/Stuhl',
      'Gehhilfe',
      'Rollstuhl',
      'Spaziergang',
      'Treppensteigen',
      'Gymnastik',
      'Lagerungskissen'
    ]
  },
  [PflegeKategorie.MEDIKAMENTE]: {
    label: 'Medikamente',
    icon: 'Pill',
    emoji: '💊',
    farbe: '#a855f7', // purple-500
    unterkategorien: [
      'Tabletteneinnahme',
      'Injektion',
      'Inhalation',
      'Augentropfen',
      'Ohrentropfen',
      'Nasenspray',
      'Salben/Cremes',
      'Pflaster',
      'Sondenkost-Medikamente'
    ]
  },
  [PflegeKategorie.WUNDVERSORGUNG]: {
    label: 'Wundversorgung',
    icon: 'Bandage',
    emoji: '🩹',
    farbe: '#ef4444', // red-500
    unterkategorien: [
      'Verbandswechsel',
      'Druckstellen',
      'Wundinspektion',
      'Wundreinigung',
      'Wundauflagen',
      'Dekubitus-Prophylaxe',
      'Dekubitus-Behandlung'
    ]
  },
  [PflegeKategorie.VITALZEICHEN]: {
    label: 'Vitalzeichen',
    icon: 'Activity',
    emoji: '🌡️',
    farbe: '#06b6d4', // cyan-500
    unterkategorien: [
      'Blutdruck',
      'Puls',
      'Temperatur',
      'Blutzucker',
      'Sauerstoffsättigung',
      'Atmungsfrequenz',
      'Gewicht',
      'Allgemeinzustand'
    ]
  },
  [PflegeKategorie.KOMMUNIKATION]: {
    label: 'Kommunikation',
    icon: 'MessageCircle',
    emoji: '💬',
    farbe: '#ec4899', // pink-500
    unterkategorien: [
      'Gespräch',
      'Zuhören',
      'Angehörige informieren',
      'Arzt kontaktieren',
      'Koordination Team',
      'Dokumentation besprechen',
      'Bedürfnisse erfragen'
    ]
  },
  [PflegeKategorie.SONSTIGES]: {
    label: 'Sonstiges',
    icon: 'MoreHorizontal',
    emoji: '📝',
    farbe: '#64748b', // slate-500
    unterkategorien: [
      'Haushalt',
      'Einkaufen',
      'Begleitung',
      'Kleidung wechseln',
      'Betten machen',
      'Raum lüften',
      'Sonstige Tätigkeiten'
    ]
  }
};

// ============================================
// HELFER-FUNKTIONEN
// ============================================

export function getKategorieLabel(kategorie: PflegeKategorie): string {
  return PFLEGE_KATEGORIEN_CONFIG[kategorie]?.label || kategorie;
}

export function getKategorieEmoji(kategorie: PflegeKategorie): string {
  return PFLEGE_KATEGORIEN_CONFIG[kategorie]?.emoji || '📋';
}

export function getKategorieFarbe(kategorie: PflegeKategorie): string {
  return PFLEGE_KATEGORIEN_CONFIG[kategorie]?.farbe || '#64748b';
}

export function getUnterkategorien(kategorie: PflegeKategorie): string[] {
  return PFLEGE_KATEGORIEN_CONFIG[kategorie]?.unterkategorien || [];
}

export function getStatusLabel(status: MassnahmeStatus): string {
  const labels: Record<MassnahmeStatus, string> = {
    [MassnahmeStatus.DURCHGEFUEHRT]: 'Durchgeführt',
    [MassnahmeStatus.VERSPAETET]: 'Verspätet',
    [MassnahmeStatus.ABGEBROCHEN]: 'Abgebrochen',
    [MassnahmeStatus.GEPLANT]: 'Geplant',
    [MassnahmeStatus.NICHT_DURCHGEFUEHRT]: 'Nicht durchgeführt'
  };
  return labels[status] || status;
}

export function getStatusFarbe(status: MassnahmeStatus): string {
  const farben: Record<MassnahmeStatus, string> = {
    [MassnahmeStatus.DURCHGEFUEHRT]: '#22c55e', // green
    [MassnahmeStatus.VERSPAETET]: '#f59e0b', // amber
    [MassnahmeStatus.ABGEBROCHEN]: '#ef4444', // red
    [MassnahmeStatus.GEPLANT]: '#3b82f6', // blue
    [MassnahmeStatus.NICHT_DURCHGEFUEHRT]: '#64748b' // slate
  };
  return farben[status] || '#64748b';
}
