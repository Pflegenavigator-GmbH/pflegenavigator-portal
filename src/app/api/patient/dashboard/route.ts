/**
 * Patienten-API
 * Für Pflegebedürftige: Dashboard und freigegebene Maßnahmen abrufen
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PatientenDashboard, PflegeMassnahme, PatientFeedback } from '@/types/pflege-massnahmen';

// ============================================
// HILFSFUNKTIONEN
// ============================================

function getAuthenticatedPatient(req: NextRequest): { patientId: string; email: string } | null {
  // In Produktion: JWT-Token validieren
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  
  return {
    patientId: 'mock-patient-id',
    email: 'patient@example.com'
  };
}

// ============================================
// GET /api/patient/dashboard
// Patienten-Dashboard abrufen
// ============================================

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const patient = getAuthenticatedPatient(req);
    if (!patient) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const supabase = createClient();
    
    // Patienten-Profil laden
    const { data: patientProfil, error: profilError } = await supabase
      .from('patienten')
      .select('name, pflegegrad, adresse')
      .eq('id', patient.patientId)
      .single();
    
    if (profilError) throw profilError;

    // Heutige Maßnahmen (freigegeben)
    const heute = new Date().toISOString().split('T')[0];
    const { data: heutigeMassnahmen, error: massnahmenError } = await supabase
      .from('pflege_massnahmen')
      .select(`
        *,
        pflegekraft:pflegekraft_id (name),
        pflegedienst:pflegedienst_id (name)
      `)
      .eq('patient_id', patient.patientId)
      .eq('freigegeben_fuer_patient', true)
      .gte('durchgefuehrt_am', `${heute}T00:00:00`)
      .lte('durchgefuehrt_am', `${heute}T23:59:59`)
      .order('durchgefuehrt_am', { ascending: false });
    
    if (massnahmenError) throw massnahmenError;

    // Statistik: Durchgeführt vs. Geplant
    const { data: statistikHeute } = await supabase
      .rpc('get_massnahmen_statistik', {
        p_patient_id: patient.patientId,
        p_datum: heute
      });

    // Ungelesene Einträge
    const { count: ungelesen } = await supabase
      .from('pflege_massnahmen')
      .select('*', { count: 'exact' })
      .eq('patient_id', patient.patientId)
      .eq('freigegeben_fuer_patient', true)
      .is('gelesen_am', null);

    // Nächste Termine (geplant)
    const { data: naechsteTermine } = await supabase
      .from('pflege_termine')
      .select(`
        *,
        pflegekraft:pflegekraft_id (name)
      `)
      .eq('patient_id', patient.patientId)
      .gte('datum', heute)
      .order('datum', { ascending: true })
      .limit(5);

    // Wochenstatistik (letzte 7 Tage)
    const { data: wochenStatistik } = await supabase
      .rpc('get_wochen_statistik', {
        p_patient_id: patient.patientId
      });

    const dashboard: PatientenDashboard = {
      patientId: patient.patientId,
      patientName: patientProfil?.name || 'Unbekannt',
      pflegegrad: patientProfil?.pflegegrad,
      
      heuteErledigt: statistikHeute?.durchgefuehrt || 0,
      heuteGeplant: statistikHeute?.geplant || 0,
      heuteVerspaetet: statistikHeute?.verspaetet || 0,
      
      aktuelleMassnahmen: heutigeMassnahmen?.map(mapToInterface) || [],
      letzteAktualisierung: new Date().toISOString(),
      
      naechsteTermine: naechsteTermine?.map(t => ({
        id: t.id,
        datum: t.datum,
        uhrzeitVon: t.uhrzeit_von,
        uhrzeitBis: t.uhrzeit_bis,
        titel: t.titel,
        beschreibung: t.beschreibung,
        kategorie: t.kategorie,
        pflegekraftName: t.pflegekraft?.name,
        bestaetigt: t.bestaetigt
      })) || [],
      
      statistik7Tage: wochenStatistik || {
        montag: { anzahlMassnahmen: 0, durchgefuehrt: 0, verspaetet: 0, abgebrochen: 0 },
        dienstag: { anzahlMassnahmen: 0, durchgefuehrt: 0, verspaetet: 0, abgebrochen: 0 },
        mittwoch: { anzahlMassnahmen: 0, durchgefuehrt: 0, verspaetet: 0, abgebrochen: 0 },
        donnerstag: { anzahlMassnahmen: 0, durchgefuehrt: 0, verspaetet: 0, abgebrochen: 0 },
        freitag: { anzahlMassnahmen: 0, durchgefuehrt: 0, verspaetet: 0, abgebrochen: 0 },
        samstag: { anzahlMassnahmen: 0, durchgefuehrt: 0, verspaetet: 0, abgebrochen: 0 },
        sonntag: { anzahlMassnahmen: 0, durchgefuehrt: 0, verspaetet: 0, abgebrochen: 0 }
      },
      
      ungeleseneEintraege: ungelesen || 0,
      neueDokumente: 0, // TODO implementieren
      wartendesFeedback: 0 // TODO implementieren
    };

    return NextResponse.json({
      success: true,
      data: dashboard
    });

  } catch (error) {
    console.error('Fehler beim Laden des Dashboards:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' }, 
      { status: 500 }
    );
  }
}

// ============================================
// GET /api/patient/massnahmen
// Freigegebene Maßnahmen für Patienten abrufen
// ============================================

export async function GET_MASSNAHMEN(req: NextRequest): Promise<NextResponse> {
  try {
    const patient = getAuthenticatedPatient(req);
    if (!patient) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const kategorie = searchParams.get('kategorie') || undefined;
    const vonDatum = searchParams.get('von') || undefined;
    const bisDatum = searchParams.get('bis') || undefined;

    const supabase = createClient();
    
    let query = supabase
      .from('pflege_massnahmen')
      .select(`
        *,
        pflegekraft:pflegekraft_id (name),
        pflegedienst:pflegedienst_id (name)
      `)
      .eq('patient_id', patient.patientId)
      .eq('freigegeben_fuer_patient', true);
    
    if (kategorie) query = query.eq('kategorie', kategorie);
    if (vonDatum) query = query.gte('durchgefuehrt_am', vonDatum);
    if (bisDatum) query = query.lte('durchgefuehrt_am', bisDatum);
    
    query = query.order('durchgefuehrt_am', { ascending: false });
    
    const { data, error } = await query;

    if (error) throw error;

    // Markiere als gelesen
    if (data) {
      const ids = data.map(m => m.id);
      await supabase
        .from('pflege_massnahmen')
        .update({ gelesen_am: new Date().toISOString() })
        .in('id', ids)
        .is('gelesen_am', null);
    }

    return NextResponse.json({
      success: true,
      data: data?.map(mapToInterface) || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Fehler beim Abrufen der Maßnahmen:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' }, 
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/patient/massnahmen/:id/feedback
// Feedback zu einer Maßnahme geben
// ============================================

export async function POST_FEEDBACK(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const patient = getAuthenticatedPatient(req);
    if (!patient) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const { id } = params;
    const body: CreateFeedbackRequest = await req.json();

    const supabase = createClient();
    
    // Prüfe ob Maßnahme existiert und für Patient freigegeben ist
    const { data: massnahme, error: checkError } = await supabase
      .from('pflege_massnahmen')
      .select('id, patient_id, freigegeben_fuer_patient')
      .eq('id', id)
      .single();
    
    if (checkError || !massnahme) {
      return NextResponse.json({ error: 'Maßnahme nicht gefunden' }, { status: 404 });
    }
    
    if (massnahme.patient_id !== patient.patientId) {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 });
    }
    
    if (!massnahme.freigegeben_fuer_patient) {
      return NextResponse.json({ error: 'Maßnahme nicht freigegeben' }, { status: 403 });
    }

    // Feedback speichern
    const { data, error } = await supabase
      .from('pflege_massnahmen')
      .update({
        patient_feedback: {
          bewertung: body.bewertung,
          kommentar: body.kommentar,
          beduerfnisse: body.beduerfnisse,
          besonderheiten: body.besonderheiten,
          erstellt_am: new Date().toISOString(),
          erstellt_von: body.erstelltVon,
          name: body.name
        },
        aktualisiert_am: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Feedback gespeichert',
      data: mapToInterface(data)
    });

  } catch (error) {
    console.error('Fehler beim Speichern des Feedbacks:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' }, 
      { status: 500 }
    );
  }
}

// ============================================
// HILFSFUNKTIONEN
// ============================================

interface CreateFeedbackRequest {
  bewertung: number;
  kommentar?: string;
  beduerfnisse?: string;
  besonderheiten?: string;
  erstelltVon: 'patient' | 'angehoeriger';
  name?: string;
}

function mapToInterface(dbRecord: any): PflegeMassnahme {
  return {
    id: dbRecord.id,
    patientId: dbRecord.patient_id,
    patientName: dbRecord.patient?.name,
    pflegekraftId: dbRecord.pflegekraft_id,
    pflegekraftName: dbRecord.pflegekraft?.name,
    pflegedienstId: dbRecord.pflegedienst_id,
    pflegedienstName: dbRecord.pflegedienst?.name,
    kategorie: dbRecord.kategorie,
    unterkategorie: dbRecord.unterkategorie,
    beschreibung: dbRecord.beschreibung,
    durchgefuehrtAm: dbRecord.durchgefuehrt_am,
    naechsterTermin: dbRecord.naechster_termin,
    dauerMinuten: dbRecord.dauer_minuten,
    notizen: dbRecord.notizen,
    interneNotizen: undefined, // Patient sieht keine internen Notizen
    dokumente: dbRecord.dokumente,
    vitalzeichen: dbRecord.vitalzeichen,
    schmerzScore: dbRecord.schmerz_score,
    zustandPatient: dbRecord.zustand_patient,
    status: dbRecord.status,
    abbruchGrund: dbRecord.abbruch_grund,
    freigegebenFuerPatient: dbRecord.freigegeben_fuer_patient,
    freigegebenAm: dbRecord.freigegeben_am,
    freigegebenVon: dbRecord.freigegeben_von,
    patientFeedback: dbRecord.patient_feedback,
    erstelltAm: dbRecord.erstellt_am,
    aktualisiertAm: dbRecord.aktualisiert_am,
    version: dbRecord.version
  };
}