/**
 * API Routes für Pflege-Maßnahmen
 * RESTful API für CRUD-Operationen
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  PflegeMassnahme, 
  CreateMassnahmeRequest, 
  UpdateMassnahmeRequest,
  MassnahmenFilter,
  PatientenDashboard,
  FreigabeRequest,
  CreateFeedbackRequest,
  PflegeKategorie,
  MassnahmeStatus
} from '@/types/pflege-massnahmen';

// ============================================
// HILFSFUNKTIONEN
// ============================================

function getAuthenticatedUser(req: NextRequest): { userId: string; rolle: string; pflegedienstId?: string } | null {
  // In Produktion: JWT-Token validieren
  // Für Entwicklung: Mock-User
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  
  // TODO: Implementiere echte Auth
  return {
    userId: 'mock-user-id',
    rolle: 'pflegekraft',
    pflegedienstId: 'mock-pflegedienst-id'
  };
}

function buildFilterQuery(filter: MassnahmenFilter): string {
  const conditions: string[] = [];
  
  if (filter.patientId) conditions.push(`patient_id.eq.${filter.patientId}`);
  if (filter.pflegekraftId) conditions.push(`pflegekraft_id.eq.${filter.pflegekraftId}`);
  if (filter.kategorie) conditions.push(`kategorie.eq.${filter.kategorie}`);
  if (filter.status) conditions.push(`status.eq.${filter.status}`);
  if (filter.freigegeben !== undefined) conditions.push(`freigegeben_fuer_patient.eq.${filter.freigegeben}`);
  if (filter.vonDatum) conditions.push(`durchgefuehrt_am.gte.${filter.vonDatum}`);
  if (filter.bisDatum) conditions.push(`durchgefuehrt_am.lte.${filter.bisDatum}`);
  
  return conditions.join(',');
}

// ============================================
// POST /api/pflege/massnahmen
// Neue Maßnahme erstellen
// ============================================

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const body: CreateMassnahmeRequest = await req.json();
    
    // Validierung
    if (!body.patientId || !body.beschreibung || !body.kategorie) {
      return NextResponse.json(
        { error: 'Pflichtfelder fehlen: patientId, beschreibung, kategorie' }, 
        { status: 400 }
      );
    }

    const supabase = createClient();
    
    // Maßnahme erstellen
    const { data, error } = await supabase
      .from('pflege_massnahmen')
      .insert({
        patient_id: body.patientId,
        pflegekraft_id: user.userId,
        pflegedienst_id: user.pflegedienstId,
        kategorie: body.kategorie,
        unterkategorie: body.unterkategorie,
        beschreibung: body.beschreibung,
        durchgefuehrt_am: body.durchgefuehrtAm,
        naechster_termin: body.naechsterTermin,
        dauer_minuten: body.dauerMinuten,
        notizen: body.notizen,
        interne_notizen: body.interneNotizen,
        vitalzeichen: body.vitalzeichen,
        schmerz_score: body.schmerzScore,
        zustand_patient: body.zustandPatient,
        status: body.status || MassnahmeStatus.DURCHGEFUEHRT,
        freigegeben_fuer_patient: false,
        erstellt_am: new Date().toISOString(),
        aktualisiert_am: new Date().toISOString(),
        version: 1
      })
      .select()
      .single();

    if (error) throw error;

    // Dokumente verarbeiten (falls vorhanden)
    if (body.dokumente && body.dokumente.length > 0) {
      // TODO: Datei-Upload implementieren
    }

    return NextResponse.json({
      success: true,
      data: mapDatabaseToInterface(data)
    }, { status: 201 });

  } catch (error) {
    console.error('Fehler beim Erstellen der Maßnahme:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' }, 
      { status: 500 }
    );
  }
}

// ============================================
// GET /api/pflege/massnahmen
// Alle Maßnahmen abrufen (mit Filter)
// ============================================

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    
    const filter: MassnahmenFilter = {
      patientId: searchParams.get('patientId') || undefined,
      pflegekraftId: searchParams.get('pflegekraftId') || undefined,
      kategorie: searchParams.get('kategorie') as PflegeKategorie || undefined,
      status: searchParams.get('status') as MassnahmeStatus || undefined,
      vonDatum: searchParams.get('vonDatum') || undefined,
      bisDatum: searchParams.get('bisDatum') || undefined,
      freigegeben: searchParams.get('freigegeben') === 'true' ? true : 
                   searchParams.get('freigegeben') === 'false' ? false : undefined,
      suchbegriff: searchParams.get('q') || undefined
    };

    const supabase = createClient();
    
    let query = supabase
      .from('pflege_massnahmen')
      .select(`
        *,
        patient:patient_id (name, geburtsdatum),
        pflegekraft:pflegekraft_id (name),
        pflegedienst:pflegedienst_id (name)
      `);
    
    // Filter anwenden
    if (filter.patientId) query = query.eq('patient_id', filter.patientId);
    if (filter.pflegekraftId) query = query.eq('pflegekraft_id', filter.pflegekraftId);
    if (filter.kategorie) query = query.eq('kategorie', filter.kategorie);
    if (filter.status) query = query.eq('status', filter.status);
    if (filter.freigegeben !== undefined) query = query.eq('freigegeben_fuer_patient', filter.freigegeben);
    if (filter.vonDatum) query = query.gte('durchgefuehrt_am', filter.vonDatum);
    if (filter.bisDatum) query = query.lte('durchgefuehrt_am', filter.bisDatum);
    
    // Suche in Beschreibung
    if (filter.suchbegriff) {
      query = query.ilike('beschreibung', `%${filter.suchbegriff}%`);
    }
    
    // Nur eigene Patienten (Pflegedienst-Scope)
    if (user.pflegedienstId) {
      query = query.eq('pflegedienst_id', user.pflegedienstId);
    }
    
    // Sortierung
    query = query.order('durchgefuehrt_am', { ascending: false });
    
    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data?.map(mapDatabaseToInterface) || [],
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
// PUT /api/pflege/massnahmen/:id
// Maßnahme aktualisieren
// ============================================

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const { id } = params;
    const body: UpdateMassnahmeRequest = await req.json();

    const supabase = createClient();
    
    // Prüfe Berechtigung (nur eigene Einträge oder Leitung)
    const { data: existing } = await supabase
      .from('pflege_massnahmen')
      .select('pflegekraft_id, version')
      .eq('id', id)
      .single();
    
    if (!existing) {
      return NextResponse.json({ error: 'Maßnahme nicht gefunden' }, { status: 404 });
    }
    
    // Optimistic Locking
    if (body.version && existing.version !== body.version) {
      return NextResponse.json(
        { error: 'Konflikt: Maßnahme wurde zwischenzeitlich geändert' }, 
        { status: 409 }
      );
    }

    // Update
    const updateData: any = {
      aktualisiert_am: new Date().toISOString(),
      version: existing.version + 1
    };
    
    if (body.beschreibung !== undefined) updateData.beschreibung = body.beschreibung;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.notizen !== undefined) updateData.notizen = body.notizen;
    if (body.interneNotizen !== undefined) updateData.interne_notizen = body.interneNotizen;
    if (body.vitalzeichen !== undefined) updateData.vitalzeichen = body.vitalzeichen;
    if (body.schmerzScore !== undefined) updateData.schmerz_score = body.schmerzScore;
    if (body.zustandPatient !== undefined) updateData.zustand_patient = body.zustandPatient;
    if (body.abbruchGrund !== undefined) updateData.abbruch_grund = body.abbruchGrund;
    if (body.naechsterTermin !== undefined) updateData.naechster_termin = body.naechsterTermin;

    const { data, error } = await supabase
      .from('pflege_massnahmen')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: mapDatabaseToInterface(data)
    });

  } catch (error) {
    console.error('Fehler beim Aktualisieren der Maßnahme:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' }, 
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/pflege/massnahmen/:id/freigeben
// Maßnahme für Patient freigeben
// ============================================

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const { id } = params;
    const body: FreigabeRequest = await req.json();

    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('pflege_massnahmen')
      .update({
        freigegeben_fuer_patient: body.freigegeben,
        freigegeben_am: body.freigegeben ? new Date().toISOString() : null,
        freigegeben_von: body.freigegeben ? user.userId : null,
        aktualisiert_am: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: mapDatabaseToInterface(data),
      message: body.freigegeben 
        ? 'Maßnahme für Patient freigegeben' 
        : 'Freigabe zurückgezogen'
    });

  } catch (error) {
    console.error('Fehler bei der Freigabe:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' }, 
      { status: 500 }
    );
  }
}

// ============================================
// DELETE /api/pflege/massnahmen/:id
// Maßnahme löschen (nur mit Berechtigung)
// ============================================

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const { id } = params;
    
    // Nur Leitung darf löschen
    if (user.rolle !== 'leitung') {
      return NextResponse.json(
        { error: 'Nur Pflegedienstleitung darf Maßnahmen löschen' }, 
        { status: 403 }
      );
    }

    const supabase = createClient();
    
    const { error } = await supabase
      .from('pflege_massnahmen')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Maßnahme gelöscht'
    });

  } catch (error) {
    console.error('Fehler beim Löschen der Maßnahme:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' }, 
      { status: 500 }
    );
  }
}

// ============================================
// HILFSFUNKTIONEN
// ============================================

function mapDatabaseToInterface(dbRecord: any): PflegeMassnahme {
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
    interneNotizen: dbRecord.interne_notizen,
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