const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

console.log('Converting SVG icons to PNG...\n');

async function convertIcons() {
  for (const size of sizes) {
    const inputFile = path.join(iconsDir, `icon-${size}x${size}.svg`);
    const outputFile = path.join(iconsDir, `icon-${size}x${size}.png`);
    
    try {
      // Erstelle ein SVG mit korrektem Hintergrund
      const svgBuffer = fs.readFileSync(inputFile);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputFile);
      
      console.log(`✓ icon-${size}x${size}.png`);
    } catch (err) {
      console.error(`✗ icon-${size}x${size}.png: ${err.message}`);
    }
  }
}

convertIcons().then(() => {
  console.log('\n✅ PNG conversion complete!');
}).catch(err => {
  console.error('Conversion failed:', err);
  process.exit(1);
});
