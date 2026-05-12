/**
 * PDF-Generierung für Widerspruchsbriefe
 * Nutzt @react-pdf/renderer für serverseitige PDF-Erstellung
 */

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { WiderspruchDaten, WiderspruchFrist } from '@/lib/widerspruch';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface PDFGenerateOptions {
  daten: WiderspruchDaten;
  frist: WiderspruchFrist;
}

/**
 * Generiert ein PDF für den Widerspruch
 */
export async function generateWiderspruchPDF(
  options: PDFGenerateOptions
): Promise<Uint8Array> {
  const { daten, frist } = options;
  
  // PDF erstellen
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const margin = 50;
  let y = height - margin;
  const lineHeight = 16;
  const smallLineHeight = 12;
  
  // Hilfsfunktion für Text
  const writeText = (
    text: string, 
    x: number, 
    opts?: { bold?: boolean; size?: number; color?: ReturnType<typeof rgb> }
  ) => {
    const size = opts?.size || 11;
    const selectedFont = opts?.bold ? fontBold : font;
    const color = opts?.color || rgb(0, 0, 0);
    
    page.drawText(text, {
      x,
      y,
      size,
      font: selectedFont,
      color,
    });
  };
  
  // Absender
  writeText(daten.versicherterName || '[Ihr Name]', margin, { size: 10 });
  y -= smallLineHeight;
  
  if (daten.anschrift) {
    const zeilen = daten.anschrift.split('\n');
    for (const zeile of zeilen) {
      writeText(zeile, margin, { size: 10 });
      y -= smallLineHeight;
    }
  } else {
    writeText('[Ihre Anschrift]', margin, { size: 10 });
    y -= smallLineHeight;
  }
  
  y -= lineHeight * 3; // Abstand
  
  // Empfänger
  writeText(daten.pflegekasse || '[Name der Pflegekasse]', margin, { size: 11 });
  y -= smallLineHeight;
  writeText('z. Hd. Widerspruchsstelle', margin, { size: 11 });
  y -= smallLineHeight;
  writeText('[Anschrift der Pflegekasse]', margin, { size: 11 });
  
  y -= lineHeight * 3; // Abstand
  
  // Datum
  const heute = format(new Date(), 'dd.MM.yyyy', { locale: de });
  writeText(heute, width - margin - 80, { size: 11 });
  
  y -= lineHeight * 2;
  
  // Betreff
  writeText('Widerspruch', margin, { bold: true, size: 13 });
  y -= lineHeight;
  writeText(`gegen Ihren Bescheid vom ${format(new Date(daten.bescheidDatum), 'dd.MM.yyyy', { locale: de })}`, margin, { size: 11 });
  
  y -= lineHeight * 2;
  
  // Anrede
  writeText('Sehr geehrte Damen und Herren,', margin, { size: 11 });
  y -= lineHeight;
  
  // Einleitung
  y -= lineHeight;
  const einleitung = `hiermit lege ich fristgerecht Widerspruch gegen Ihren Bescheid vom ${format(new Date(daten.bescheidDatum), 'dd.MM.yyyy', { locale: de })} ein.`;
  
  // Text umbrechen
  const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];
    
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = font.widthOfTextAtSize(currentLine + ' ' + word, fontSize);
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };
  
  const textZeilen = wrapText(einleitung, width - 2 * margin, 11);
  for (const zeile of textZeilen) {
    writeText(zeile, margin, { size: 11 });
    y -= lineHeight;
  }
  
  y -= lineHeight;
  
  // Versicherungsnummer
  if (daten.versicherungsnummer) {
    writeText(`Meine Versicherungsnummer: ${daten.versicherungsnummer}`, margin, { size: 11 });
    y -= lineHeight;
  }
  
  y -= lineHeight;
  
  // Begründung
  writeText('BEGRÜNDUNG:', margin, { bold: true, size: 11 });
  y -= lineHeight;
  
  const begruendung = daten.begruendung || 
    'Ich bin mit dem Bescheid nicht einverstanden, da die Einstufung meines Pflegebedarfs nicht meiner tatsächlichen Situation entspricht. Ich bitte um eine erneute Prüfung.';
  
  const begruendungZeilen = wrapText(begruendung, width - 2 * margin, 11);
  for (const zeile of begruendungZeilen) {
    writeText(zeile, margin, { size: 11 });
    y -= lineHeight;
  }
  
  y -= lineHeight * 2;
  
  // Fristhinweis
  writeText('HINWEIS ZUR FRIST:', margin, { bold: true, size: 11 });
  y -= lineHeight;
  const fristText = `Die Widerspruchsfrist läuft gemäß ${frist.gesetz} am ${format(frist.fristEndeWerktag, 'dd.MM.yyyy', { locale: de })} ab.`;
  const fristZeilen = wrapText(fristText, width - 2 * margin, 11);
  for (const zeile of fristZeilen) {
    writeText(zeile, margin, { size: 11 });
    y -= lineHeight;
  }
  
  y -= lineHeight * 2;
  
  // Schluss
  const schluss = 'Ich bitte Sie, meinen Widerspruch zu prüfen und mir einen neuen Bescheid zu erlassen.';
  const schlussZeilen = wrapText(schluss, width - 2 * margin, 11);
  for (const zeile of schlussZeilen) {
    writeText(zeile, margin, { size: 11 });
    y -= lineHeight;
  }
  
  y -= lineHeight * 2;
  
  // Gruß
  writeText('Mit freundlichen Grüßen', margin, { size: 11 });
  
  y -= lineHeight * 4;
  
  // Unterschrift
  writeText(daten.versicherterName || '[Ihre Unterschrift]', margin, { size: 11 });
  
  // Zweite Seite: Anlagen
  const anlagenPage = pdfDoc.addPage();
  let anlagenY = anlagenPage.getSize().height - margin;
  
  anlagenPage.drawText('ANLAGEN:', {
    x: margin,
    y: anlagenY,
    size: 12,
    font: fontBold,
  });
  anlagenY -= lineHeight * 1.5;
  
  const anlagen = [
    '☐ Kopie des angefochtenen Bescheids',
    '☐ Arztberichte (falls vorhanden)',
    '☐ Pflegeprotokoll/Tagebuch',
    '☐ Weitere Beweisunterlagen',
  ];
  
  for (const anlage of anlagen) {
    anlagenPage.drawText(anlage, {
      x: margin,
      y: anlagenY,
      size: 11,
      font,
    });
    anlagenY -= lineHeight;
  }
  
  // PDF speichern
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

/**
 * Hilfsfunktion zum Download des PDFs im Browser
 */
export function downloadPDF(pdfBytes: Uint8Array, filename: string): void {
  if (typeof window === 'undefined') return;
  
  const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
