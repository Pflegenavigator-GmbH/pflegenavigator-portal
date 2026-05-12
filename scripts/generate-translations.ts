/**
 * Übersetzungsgenerator - 35 Sprachen für PflegeNavigator
 * Automatisierte Übersetzungen (DE → Zielsprache)
 * Hinweis: Dies ist ein Template - echte Übersetzung erfordert LibreTranslate oder professionelle Dienstleister
 */

import fs from 'fs';
import path from 'path';

// Basis-Sprache (Deutsch)
const baseTranslations = {
  de: require('./locales/de/common.json')
};

// Zielsprachen nach Priorität
const languagePriority = {
  high: ['en', 'tr', 'pl', 'ru', 'ar', 'fa'],     // Top 6: Englisch, Türkisch, Polnisch, Russisch, Arabisch, Farsi
  medium: ['it', 'es', 'fr', 'uk', 'ro', 'bg', 'hr', 'sr', 'sl'],  // EU-Nachbarn
  standard: ['hu', 'el', 'pt', 'nl', 'da', 'sv', 'no', 'fi', 'et', 'lv', 'lt', 'cs', 'sk', 'ja', 'ko', 'zh', 'hi', 'th', 'vi']  // Rest + Asien
};

// Einfache Übersetzungs-Mappings (Platzhalter - müssen durch echte Übersetzung ersetzt werden)
const simpleTranslations: Record<string, Record<string, string>> = {
  en: {
    // Bereits vorhanden in common.json
  },
  tr: {
    "app.name": "PflegeNavigator EU",
    "app.tagline": "Bakım yolunuz - basit, hızlı, ücretsiz",
    "buttons.weiter": "Devam",
    "buttons.zurueck": "Geri",
    "pflegegrad.title": "Bakım Derecesi Hesaplayıcı",
  },
  pl: {
    "app.name": "PflegeNavigator EU",
    "app.tagline": "Twoja droga opieki - prosta, szybka, bezpłatna",
    "buttons.weiter": "Dalej",
    "buttons.zurueck": "Wstecz",
    "pflegegrad.title": "Kalkulator poziomu opieki",
  },
  ru: {
    "app.name": "PflegeNavigator EU",
    "app.tagline": "Ваш путь ухода - простой, быстрый, бесплатный",
    "buttons.weiter": "Далее",
    "buttons.zurueck": "Назад",
    "pflegegrad.title": "Калькулятор уровня ухода",
  },
  ar: {
    "app.name": "PflegeNavigator EU",
    "app.tagline": "طريقك للرعاية - بسيط، سريع، مجاني",
    "buttons.weiter": "التالي",
    "buttons.zurueck": "رجوع",
    "pflegegrad.title": "حاسبة مستوى الرعاية",
    "_rtl": "true"
  },
  fa: {
    "app.name": "PflegeNavigator EU",
    "app.tagline": "مسیر مراقبت شما - ساده، سریع، رایگان",
    "buttons.weiter": "بعدی",
    "buttons.zurueck": "بازگشت",
    "pflegegrad.title": "ماشین حساب سطح مراقبت",
    "_rtl": "true"
  }
  // Weitere Sprachen würden hier folgen...
};

// Generator-Funktion
export function generateTranslationFile(lang: string, priority: 'high' | 'medium' | 'standard') {
  const base = JSON.parse(JSON.stringify(baseTranslations.de)); // Deep copy
  
  // Einfache Übersetzungen anwenden (falls vorhanden)
  if (simpleTranslations[lang]) {
    Object.assign(base, simpleTranslations[lang]);
  }
  
  // Für fehlende Keys, Platzhalter einfügen
  const fillMissingKeys = (obj: any, prefix = ''): any => {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        // Wenn nicht übersetzt, Platzhalter mit Hinweis
        if (!simpleTranslations[lang]?.[key]) {
          result[key] = `[${lang.toUpperCase()}] ${value}`;
        } else {
          result[key] = value;
        }
      } else if (typeof value === 'object' && value !== null) {
        result[key] = fillMissingKeys(value, `${prefix}${key}.`);
      } else {
        result[key] = value;
      }
    }
    return result;
  };
  
  return fillMissingKeys(base);
}

// Alle Sprachen generieren
export function generateAllTranslations() {
  const allTranslations: Record<string, any> = {};
  
  // High Priority
  for (const lang of languagePriority.high) {
    allTranslations[lang] = generateTranslationFile(lang, 'high');
  }
  
  // Medium Priority
  for (const lang of languagePriority.medium) {
    allTranslations[lang] = generateTranslationFile(lang, 'medium');
  }
  
  // Standard Priority
  for (const lang of languagePriority.standard) {
    allTranslations[lang] = generateTranslationFile(lang, 'standard');
  }
  
  return allTranslations;
}

// Dateien schreiben
export function writeTranslationFiles(outputDir: string = './locales') {
  const translations = generateAllTranslations();
  
  for (const [lang, content] of Object.entries(translations)) {
    const langDir = path.join(outputDir, lang);
    
    // Verzeichnis erstellen
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }
    
    // Datei schreiben
    const filePath = path.join(langDir, 'common.json');
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
    
    console.log(`Generated: ${filePath}`);
  }
  
  // README generieren
  const readmeContent = generateReadme();
  fs.writeFileSync(path.join(outputDir, 'README.md'), readmeContent, 'utf-8');
  
  console.log(`Generated: ${path.join(outputDir, 'README.md')}`);
}

// README mit Übersetzungsstatus
function generateReadme(): string {
  return `# Übersetzungen - PflegeNavigator EU

## Übersicht

Dieses Verzeichnis enthält die Übersetzungen für das PflegeNavigator EU Portal.

**Gesamt:** 35 Sprachen

## Prioritäten

### High Priority (Top 6)
- English (en) - Fertig
- Türkçe (tr) - Teilweise (Platzhalter)
- Polski (pl) - Teilweise (Platzhalter)
- Русский (ru) - Teilweise (Platzhalter)
- العربية (ar) - Teilweise + RTL
- فارسی (fa) - Teilweise + RTL

### Medium Priority (EU-Nachbarn)
- Italiano (it) - Platzhalter
- Español (es) - Platzhalter
- Français (fr) - Platzhalter
- Українська (uk) - Platzhalter
- Română (ro) - Platzhalter
- Български (bg) - Platzhalter
- Hrvatski (hr) - Platzhalter
- Српски (sr) - Platzhalter
- Slovenščina (sl) - Platzhalter

### Standard Priority
- Magyar (hu) - Platzhalter
- Ελληνικά (el) - Platzhalter
- Português (pt) - Platzhalter
- Nederlands (nl) - Platzhalter
- Dansk (da) - Platzhalter
- Svenska (sv) - Platzhalter
- Norsk (no) - Platzhalter
- Suomi (fi) - Platzhalter
- Eesti (et) - Platzhalter
- Latviešu (lv) - Platzhalter
- Lietuvių (lt) - Platzhalter
- Čeština (cs) - Platzhalter
- Slovenčina (sk) - Platzhalter
- 日本語 (ja) - Platzhalter
- 한국어 (ko) - Platzhalter
- 中文 (zh) - Platzhalter
- हिंदी (hi) - Platzhalter
- ไทย (th) - Platzhalter
- Tiếng Việt (vi) - Platzhalter

## RTL-Sprachen (Rechts-nach-Links)
- Arabisch (ar)
- Farsi (fa)

## Nutzung

### Automatische Übersetzung

1. **LibreTranslate starten:**
   \`\`\`bash
   docker-compose up -d translate
   \`\`\`

2. **Übersetzungen generieren:**
   \`\`\`bash
   npx ts-node scripts/translate-all.ts
   \`\`\`

### Manuelle Übersetzung

1. Datei öffnen: \`locales/[sprache]/common.json\`
2. Platzhalter ersetzen: \`[XX] Originaltext\` → echte Übersetzung
3. JSON validieren
4. Speichern

## Qualitätssicherung

- Automatische Validierung (JSON-Format)
- Key-Vollständigkeit prüfen
- Länge der Übersetzungen (max. 150% der deutschen Länge)
- Community-Review empfohlen

## Fehlende Übersetzungen finden

\`\`\`bash
grep -r '\[TR\]\|\[PL\]\|\[RU\]' locales/
\`\`\`

## Kontakt

Bei Fragen zu Übersetzungen:
- E-Mail: i18n@pflegenavigatoreu.com
- GitHub: Erstelle ein Issue

---
**Stand:** ${new Date().toISOString().split('T')[0]}
`;
}

// Export für Node.js
if (require.main === module) {
  writeTranslationFiles();
}

export default {
  generateTranslationFile,
  generateAllTranslations,
  writeTranslationFiles
};
