/**
 * Supabase Database Schema für Pflege-Maßnahmen System
 * SQL zum Ausführen in der Supabase SQL Console
 */

-- ============================================
-- ENUMS (als Check Constraints)
-- ============================================

-- Kategorien
CREATE TYPE pflege_kategorie AS ENUM (
  'koerperpflege',
  'ernaehrung', 
  'mobilitaet',
  'medikamente',
  'wundversorgung',
  'vitalzeichen',
  'kommunikation',
  'sonstiges'
);

-- Status
CREATE TYPE massnahme_status AS ENUM (
  'durchgefuehrt',
  'verspaetet',
  'abgebrochen',
  'geplant',
  'nicht_durchgefuehrt'
);

-- Zustand
CREATE TYPE patient_zustand AS ENUM (
  'sehr_gut',
  'gut',
  'mittel',
  'schlecht',
  'sehr_schlecht'
);

-- ============================================
-- HAUPTTABELLE: Pflege-Maßnahmen
-- ============================================

CREATE TABLE pflege_massnahmen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Beziehungen
  patient_id UUID NOT NULL REFERENCES patienten(id) ON DELETE CASCADE,
  pflegekraft_id UUID NOT NULL REFERENCES benutzer(id) ON DELETE RESTRICT,
  pflegedienst_id UUID NOT NULL REFERENCES pflegedienste(id) ON DELETE RESTRICT,
  
  -- Maßnahme-Details
  kategorie pflege_kategorie NOT NULL,
  unterkategorie VARCHAR(100),
  beschreibung TEXT NOT NULL,
  durchgefuehrt_am TIMESTAMP WITH TIME ZONE NOT NULL,
  naechster_termin TIMESTAMP WITH TIME ZONE,
  dauer_minuten INTEGER,
  
  -- Details
  notizen TEXT,
  interne_notizen TEXT, -- Nur für Pflegedienst sichtbar
  dokumente JSONB DEFAULT '[]',
  vitalzeichen JSONB,
  schmerz_score INTEGER CHECK (schmerz_score >= 0 AND schmerz_score <= 10),
  zustand_patient patient_zustand,
  
  -- Status
  status massnahme_status DEFAULT 'geplant',
  abbruch_grund TEXT,
  
  -- Freigabe
  freigegeben_fuer_patient BOOLEAN DEFAULT FALSE,
  freigegeben_am TIMESTAMP WITH TIME ZONE,
  freigegeben_von UUID REFERENCES benutzer(id),
  
  -- Feedback (von Patient/Angehörigen)
  patient_feedback JSONB,
  
  -- Tracking
  gelesen_am TIMESTAMP WITH TIME ZONE,
  
  -- Metadaten
  erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  aktualisiert_am TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  version INTEGER DEFAULT 1,
  
  -- Constraints
  CONSTRAINT valid_dauer CHECK (dauer_minuten > 0 OR dauer_minuten IS NULL),
  CONSTRAINT valid_feedback CHECK (
    patient_feedback IS NULL OR 
    (patient_feedback -> 'bewertung')::int BETWEEN 1 AND 5
  )
);

-- Indexes für Performance
CREATE INDEX idx_massnahmen_patient ON pflege_massnahmen(patient_id);
CREATE INDEX idx_massnahmen_pflegekraft ON pflege_massnahmen(pflegekraft_id);
CREATE INDEX idx_massnahmen_pflegedienst ON pflege_massnahmen(pflegedienst_id);
CREATE INDEX idx_massnahmen_durchgefuehrt ON pflege_massnahmen(durchgefuehrt_am);
CREATE INDEX idx_massnahmen_kategorie ON pflege_massnahmen(kategorie);
CREATE INDEX idx_massnahmen_status ON pflege_massnahmen(status);
CREATE INDEX idx_massnahmen_freigegeben ON pflege_massnahmen(freigegeben_fuer_patient);

-- ============================================
-- TABELLE: Termine
-- ============================================

CREATE TABLE pflege_termine (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patienten(id) ON DELETE CASCADE,
  pflegekraft_id UUID REFERENCES benutzer(id),
  pflegedienst_id UUID NOT NULL REFERENCES pflegedienste(id),
  
  datum DATE NOT NULL,
  uhrzeit_von TIME NOT NULL,
  uhrzeit_bis TIME,
  titel VARCHAR(200) NOT NULL,
  beschreibung TEXT,
  kategorie pflege_kategorie,
  
  bestaetigt BOOLEAN DEFAULT FALSE,
  bestaetigt_am TIMESTAMP WITH TIME ZONE,
  
  erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  aktualisiert_am TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_termine_patient ON pflege_termine(patient_id);
CREATE INDEX idx_termine_datum ON pflege_termine(datum);
CREATE INDEX idx_termine_pflegedienst ON pflege_termine(pflegedienst_id);

-- ============================================
-- TABELLE: Patienten (Erweiterung)
-- ============================================

CREATE TABLE patienten (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  benutzer_id UUID UNIQUE REFERENCES benutzer(id) ON DELETE CASCADE,
  
  -- Pflichtfelder
  name VARCHAR(200) NOT NULL,
  geburtsdatum DATE,
  adresse TEXT NOT NULL,
  telefon VARCHAR(50),
  
  -- Pflege
  pflegegrad INTEGER CHECK (pflegegrad BETWEEN 1 AND 5),
  pflegegrad_seit DATE,
  pflegegrad_bis DATE,
  
  -- Notfall
  notfallkontakt_name VARCHAR(200),
  notfallkontakt_telefon VARCHAR(50),
  notfallkontakt_beziehung VARCHAR(100),
  
  -- Medizinisch
  allergien TEXT[],
  erkrankungen TEXT[],
  medikamente JSONB DEFAULT '[]',
  
  -- Zuordnung
  pflegedienst_id UUID REFERENCES pflegedienste(id),
  haupt_pflegekraft_id UUID REFERENCES benutzer(id),
  
  -- Einstellungen
  sprache VARCHAR(10) DEFAULT 'de',
  benachrichtigungen_email BOOLEAN DEFAULT TRUE,
  benachrichtigungen_push BOOLEAN DEFAULT TRUE,
  
  -- Metadaten
  erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  aktualisiert_am TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELLE: Pflegedienste
-- ============================================

CREATE TABLE pflegedienste (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  typ VARCHAR(50) NOT NULL CHECK (typ IN ('ambulant', 'stationaer', 'tagespflege')),
  
  -- Kontakt
  adresse TEXT NOT NULL,
  telefon VARCHAR(50),
  email VARCHAR(200),
  website VARCHAR(500),
  
  -- Lizenz
  lizenz_nummer VARCHAR(100),
  lizenz_gueltig_bis DATE,
  
  -- Einstellungen
  ti_angeschlossen BOOLEAN DEFAULT FALSE,
  kIM_aktiviert BOOLEAN DEFAULT FALSE,
  
  -- Metadaten
  erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  aktualisiert_am TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELLE: Benutzer (Erweiterung)
-- ============================================

CREATE TABLE benutzer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(200) UNIQUE NOT NULL,
  passwort_hash VARCHAR(255) NOT NULL,
  
  -- Profil
  vorname VARCHAR(100) NOT NULL,
  nachname VARCHAR(100) NOT NULL,
  name VARCHAR(200) GENERATED ALWAYS AS (vorname || ' ' || nachname) STORED,
  telefon VARCHAR(50),
  
  -- Rolle
  rolle VARCHAR(50) NOT NULL CHECK (rolle IN (
    'admin',
    'pflegedienst_leitung',
    'pflegefachkraft',
    'pflegehilfskraft',
    'patient',
    'angehoeriger'
  )),
  
  -- Zuordnung
  pflegedienst_id UUID REFERENCES pflegedienste(id),
  
  -- Status
  email_verifiziert BOOLEAN DEFAULT FALSE,
  aktiv BOOLEAN DEFAULT TRUE,
  letzte_anmeldung TIMESTAMP WITH TIME ZONE,
  
  -- Sicherheit
  ti_token VARCHAR(500), -- Telematikinfrastruktur
  mfa_aktiviert BOOLEAN DEFAULT FALSE,
  
  -- Metadaten
  erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  aktualisiert_am TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_benutzer_email ON benutzer(email);
CREATE INDEX idx_benutzer_pflegedienst ON benutzer(pflegedienst_id);
CREATE INDEX idx_benutzer_rolle ON benutzer(rolle);

-- ============================================
-- TABELLE: Zuordnung Patient <-> Pflegekraft
-- ============================================

CREATE TABLE patient_pflegekraft_zuordnung (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patienten(id) ON DELETE CASCADE,
  pflegekraft_id UUID NOT NULL REFERENCES benutzer(id) ON DELETE CASCADE,
  
  ist_haupt_pflegekraft BOOLEAN DEFAULT FALSE,
  zugewiesen_am TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  zugewiesen_von UUID REFERENCES benutzer(id),
  
  UNIQUE(patient_id, pflegekraft_id)
);

-- ============================================
-- TRIGGER: Aktualisierung Timestamp
-- ============================================

CREATE OR REPLACE FUNCTION update_aktualisiert_am()
RETURNS TRIGGER AS $$
BEGIN
  NEW.aktualisiert_am = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_massnahmen_update
  BEFORE UPDATE ON pflege_massnahmen
  FOR EACH ROW
  EXECUTE FUNCTION update_aktualisiert_am();

CREATE TRIGGER tr_patienten_update
  BEFORE UPDATE ON patienten
  FOR EACH ROW
  EXECUTE FUNCTION update_aktualisiert_am();

CREATE TRIGGER tr_benutzer_update
  BEFORE UPDATE ON benutzer
  FOR EACH ROW
  EXECUTE FUNCTION update_aktualisiert_am();

-- ============================================
-- FUNKTIONEN
-- ============================================

-- Wochenstatistik für Patienten
CREATE OR REPLACE FUNCTION get_wochen_statistik(p_patient_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'montag', COALESCE((SELECT json_build_object(
      'datum', CURRENT_DATE - (EXTRACT(DOW FROM CURRENT_DATE)::int - 1),
      'anzahlMassnahmen', COUNT(*),
      'durchgefuehrt', COUNT(*) FILTER (WHERE status = 'durchgefuehrt'),
      'verspaetet', COUNT(*) FILTER (WHERE status = 'verspaetet'),
      'abgebrochen', COUNT(*) FILTER (WHERE status = 'abgebrochen')
    ) FROM pflege_massnahmen 
    WHERE patient_id = p_patient_id 
    AND DATE(durchgefuehrt_am) = CURRENT_DATE - (EXTRACT(DOW FROM CURRENT_DATE)::int - 1)), '{}'),
    -- ... ähnlich für andere Wochentage
    'sonntag', COALESCE((SELECT json_build_object(
      'datum', CURRENT_DATE + (7 - EXTRACT(DOW FROM CURRENT_DATE)::int),
      'anzahlMassnahmen', COUNT(*),
      'durchgefuehrt', COUNT(*) FILTER (WHERE status = 'durchgefuehrt'),
      'verspaetet', COUNT(*) FILTER (WHERE status = 'verspaetet'),
      'abgebrochen', COUNT(*) FILTER (WHERE status = 'abgebrochen')
    ) FROM pflege_massnahmen 
    WHERE patient_id = p_patient_id 
    AND DATE(durchgefuehrt_am) = CURRENT_DATE + (7 - EXTRACT(DOW FROM CURRENT_DATE)::int)), '{}')
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Tagesstatistik
CREATE OR REPLACE FUNCTION get_massnahmen_statistik(
  p_patient_id UUID,
  p_datum DATE
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'durchgefuehrt', COUNT(*) FILTER (WHERE status = 'durchgefuehrt'),
    'verspaetet', COUNT(*) FILTER (WHERE status = 'verspaetet'),
    'abgebrochen', COUNT(*) FILTER (WHERE status = 'abgebrochen'),
    'geplant', COUNT(*) FILTER (WHERE status = 'geplant'),
    'gesamt', COUNT(*)
  ) INTO result
  FROM pflege_massnahmen
  WHERE patient_id = p_patient_id
  AND DATE(durchgefuehrt_am) = p_datum;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Patienten: Nur eigene Daten oder zugewiesene Pflegekräfte
ALTER TABLE patienten ENABLE ROW LEVEL SECURITY;

CREATE POLICY patienten_eigen ON patienten
  FOR ALL USING (auth.uid() = benutzer_id);

CREATE POLICY patienten_pflegekraft ON patienten
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM patient_pflegekraft_zuordnung
      WHERE patient_id = patienten.id
      AND pflegekraft_id = auth.uid()
    )
  );

-- Massnahmen: Nur eigene Patienten oder zugewiesene Pflegekräfte
ALTER TABLE pflege_massnahmen ENABLE ROW LEVEL SECURITY;

CREATE POLICY massnahmen_pflegekraft ON pflege_massnahmen
  FOR ALL USING (
    pflegekraft_id = auth.uid() OR
    pflegedienst_id IN (
      SELECT pflegedienst_id FROM benutzer WHERE id = auth.uid()
    )
  );

CREATE POLICY massnahmen_patient ON pflege_massnahmen
  FOR SELECT USING (
    patient_id IN (
      SELECT id FROM patienten WHERE benutzer_id = auth.uid()
    )
    AND freigegeben_fuer_patient = TRUE
  );

-- ============================================
-- SEED DATA (Beispieldaten)
-- ============================================

-- Beispiel-Pflegedienst
INSERT INTO pflegedienste (name, typ, adresse, telefon, email) VALUES
('PflegeNavigator Testdienst', 'ambulant', 'Musterstraße 123, 12345 Berlin', '030-12345678', 'kontakt@pflegenavigator-test.de');

-- Beispiel-Benutzer (Passwort: 'test1234' - in Produktion hashen!)
INSERT INTO benutzer (email, passwort_hash, vorname, nachname, rolle, pflegedienst_id) VALUES
('pflegekraft@test.de', '$2b$10$...', 'Maria', 'Muster', 'pflegefachkraft', 
 (SELECT id FROM pflegedienste LIMIT 1));

-- Beispiel-Patient
INSERT INTO patienten (benutzer_id, name, geburtsdatum, adresse, pflegegrad, pflegedienst_id) VALUES
((SELECT id FROM benutzer WHERE email = 'patient@test.de'),
 'Max Mustermann',
 '1950-05-15',
 'Patientenstraße 1, 12345 Berlin',
 3,
 (SELECT id FROM pflegedienste LIMIT 1));

COMMIT;