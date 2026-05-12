/**
 * Icon Generator für PflegeNavigator PWA
 * Erzeugt alle benötigten Icon-Größen aus SVG
 */

const fs = require('fs');
const path = require('path');

// SVG-Template für das Icon
const svgTemplate = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#0f2744"/>
  <circle cx="50" cy="50" r="38" fill="#0f2744" stroke="white" stroke-width="2"/>
  <circle cx="50" cy="12" r="4" fill="#20b2aa"/>
  <text x="50" y="16" text-anchor="middle" font-size="8" font-weight="bold" fill="white">N</text>
  <g transform="translate(50, 50) rotate(-45)">
    <polygon points="0,-28 -5,0 5,0" fill="#20b2aa"/>
    <polygon points="0,28 -5,0 5,0" fill="white"/>
    <circle cx="0" cy="0" r="4" fill="#0f2744" stroke="white" stroke-width="1.5"/>
  </g>
</svg>`;

// Maskable SVG-Template (mit Safe Zone)
const maskableSvgTemplate = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#0066cc"/>
  <circle cx="50" cy="50" r="28" fill="#0f2744" stroke="white" stroke-width="1.5"/>
  <circle cx="50" cy="18" r="3" fill="#20b2aa"/>
  <text x="50" y="21" text-anchor="middle" font-size="6" font-weight="bold" fill="white">N</text>
  <g transform="translate(50, 50) rotate(-45)">
    <polygon points="0,-22 -4,0 4,0" fill="#20b2aa"/>
    <polygon points="0,22 -4,0 4,0" fill="white"/>
    <circle cx="0" cy="0" r="3" fill="#0f2744" stroke="white" stroke-width="1"/>
  </g>
</svg>`;

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Erstelle Icons-Verzeichnis falls nicht vorhanden
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generiere Icons
console.log('Generating PWA icons...\n');

sizes.forEach(size => {
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svgTemplate(size));
  console.log(`✓ Created ${filename}`);
});

// Erstelle eine README mit Anweisungen zur PNG-Konvertierung
const readmePath = path.join(iconsDir, 'README.md');
fs.writeFileSync(readmePath, `# PWA Icons

## Generierte Icons

Dieses Verzeichnis enthält SVG-Icons in folgenden Größen:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

## PNG-Konvertierung

Für die Produktion müssen diese SVGs in PNGs konvertiert werden:

### Option 1: Online-Tool
Verwende [PWA Asset Generator](https://pwa-asset-generator.com/) oder [Favicon.io](https://favicon.io/favicon-converter/)

### Option 2: CLI mit ImageMagick
\`\`\`bash
# Install ImageMagick
brew install imagemagick  # macOS
sudo apt-get install imagemagick  # Ubuntu/Debian

# Konvertiere alle Icons
for size in 72 96 128 144 152 192 384 512; do
  convert -background none icon-\\${size}x\\${size}.svg -resize \\${size}x\\${size} icon-\\${size}x\\${size}.png
done
\`\`\`

### Option 3: Node.js mit sharp
\`\`\`bash
npm install sharp
\`\`\`

Dann führe aus:
\`\`\`javascript
const sharp = require('sharp');
const fs = require('fs');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(async size => {
  await sharp(\`icon-\${size}x\${size}.svg\`)
    .resize(size, size)
    .png()
    .toFile(\`icon-\${size}x\${size}.png\`);
});
\`\`\`

## Maskable Icons

Für Android Adaptive Icons sollten zusätzlich maskable Icons erstellt werden:
- Sicherer Bereich: 66% des Bildes
- Hintergrund: #0066cc
- Vordergrund-Logo zentriert
`);

console.log('\n✓ README.md created');
console.log('\n✅ Icon generation complete!');
console.log('Note: Convert SVGs to PNGs for production using:');
console.log('  - ImageMagick: convert -background none icon.svg icon.png');
console.log('  - Online: pwa-asset-generator.com');
