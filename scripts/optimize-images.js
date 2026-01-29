const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const MAX_WIDTH = 1920;
const QUALITY = 80;

async function optimizeImage(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) return null;

    const stats = fs.statSync(filePath);
    const sizeMB = stats.size / (1024 * 1024);

    if (sizeMB < 0.2) {
      console.log(`✓ Déjà optimisée: ${path.basename(filePath)} (${sizeMB.toFixed(2)} MB)`);
      return null;
    }

    console.log(`🔄 Optimisation: ${path.basename(filePath)} (${sizeMB.toFixed(2)} MB)...`);

    const backupPath = filePath + '.backup';
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
    }

    const image = sharp(filePath);
    const metadata = await image.metadata();

    if (metadata.width > MAX_WIDTH) {
      await image.resize(MAX_WIDTH, null, { withoutEnlargement: true, fit: 'inside' });
    }

    const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    await image.webp({ quality: QUALITY }).toFile(webpPath);

    await sharp(filePath)
      .resize(MAX_WIDTH, null, { withoutEnlargement: true, fit: 'inside' })
      .jpeg({ quality: QUALITY, progressive: true })
      .png({ quality: QUALITY, compressionLevel: 9 })
      .toFile(filePath + '.optimized');

    fs.renameSync(filePath + '.optimized', filePath);

    const newStats = fs.statSync(filePath);
    const newSizeMB = newStats.size / (1024 * 1024);
    const webpStats = fs.statSync(webpPath);
    const webpSizeMB = webpStats.size / (1024 * 1024);

    const saved = ((sizeMB - newSizeMB) / sizeMB * 100).toFixed(1);
    console.log(`✅ ${path.basename(filePath)}: ${sizeMB.toFixed(2)} MB → ${newSizeMB.toFixed(2)} MB (-${saved}%) | WebP: ${webpSizeMB.toFixed(2)} MB`);

    return { file: path.basename(filePath), originalSize: sizeMB, newSize: newSizeMB, webpSize: webpSizeMB, saved: parseFloat(saved) };
  } catch (error) {
    console.error(`❌ Erreur pour ${filePath}:`, error.message);
    return null;
  }
}

async function optimizeDirectory(dir) {
  const files = fs.readdirSync(dir);
  const results = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      const subResults = await optimizeDirectory(filePath);
      results.push(...subResults);
    } else {
      const result = await optimizeImage(filePath);
      if (result) results.push(result);
    }
  }

  return results;
}

async function main() {
  console.log('🚀 Début optimisation images...\n');
  const startTime = Date.now();
  const results = await optimizeDirectory(IMAGES_DIR);

  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalNew = results.reduce((sum, r) => sum + r.newSize, 0);
  const totalSaved = ((totalOriginal - totalNew) / totalOriginal * 100).toFixed(1);

  console.log('\n' + '='.repeat(60));
  console.log(`Images optimisées: ${results.length} | Économie: ${totalSaved}% (${(totalOriginal - totalNew).toFixed(2)} MB)`);
  console.log(`Durée: ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
  console.log('='.repeat(60));
}

main().catch(console.error);
