const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration Cloudinary
cloudinary.config({
  cloud_name: 'diibzuu9j',
  api_key: '733766113121784',
  api_secret: 'J0SSqsWd-MEksJtiVL74KSZacdY'
});

// Liste des fichiers qui ont échoué (>10 MB)
const failedFiles = [
  'bombers-cafe-tex4', 'bombers-cafe-tex2', 'bombers-cafe-tex3',
  'bombers-gris-tex1', 'bombers-gris-tex3', 'bombers-gris-tex2',
  'calecon-blanc-tex1', 'chemise-uriel-rouge-tex1', 'chemise-uriel-rouge-tex2',
  'chemise-uriel-vert-tex2', 'chemise-uriel-vert-tex1', 'denim-hero-v2',
  'gilet-1957-tex2', 'gilet-1957-tex3', 'gilet-1957-tex1',
  'jean-1957-tex1', 'jean-1957-tex2', 'jean-1957-tex3',
  'jupe-tex3', 'jupe-tex2', 'jupe-tex1',
  'pantalon-jane-tex1', 'pantalon-jane-tex3', 'pantalon-jane-tex2',
  'short-uriel-rouge-tex1', 'surchemise-boubou-dos', 'short-uriel-rouge-tex3', 'short-uriel-rouge-tex2',
  'surchemise-boubou-face', 'sweatpant-beige-tex1', 'sweatpant-beige-tex2', 'sweatpant-beige-tex3', 'sweatpant-beige-tex4',
  'sweatpant-bordeaux-tex2', 'sweatpant-bordeaux-tex1', 'sweatpant-gris-tex2', 'sweatpant-gris-tex1',
  'sweatpant-kaki-tex2', 'sweatpant-kaki-tex1', 'veste-jane-tex1', 'veste-jane-tex2', 'veste-jane-tex3',
  'voile-bordeaux-tex1', 'voile-bordeaux-tex2', 'voile-marron-tex2', 'voile-marron-tex1'
];

async function compressAndUpload(fileName) {
  const inputPath = path.join('/tmp/kamba-large-images', `${fileName}.jpg`);
  const outputPath = path.join('/tmp/compressed', `${fileName}.jpg`);

  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  File not found: ${fileName}`);
    return { fileName, success: false, error: 'File not found' };
  }

  try {
    // Créer le dossier compressed si nécessaire
    if (!fs.existsSync('/tmp/compressed')) {
      fs.mkdirSync('/tmp/compressed', { recursive: true });
    }

    // Compresser l'image (qualité 80, max 9 MB pour être sûr)
    await sharp(inputPath)
      .jpeg({ quality: 80, progressive: true })
      .resize({ width: 4000, fit: 'inside', withoutEnlargement: true })
      .toFile(outputPath);

    const stats = fs.statSync(outputPath);
    console.log(`📦 Compressed: ${fileName} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

    // Uploader sur Cloudinary
    const result = await cloudinary.uploader.upload(outputPath, {
      public_id: `kamba-images/${fileName}`,
      folder: 'kamba-images',
      resource_type: 'image',
      overwrite: true,
      transformation: [
        { quality: 'auto:good', fetch_format: 'auto' }
      ]
    });

    // Supprimer le fichier compressé temporaire
    fs.unlinkSync(outputPath);

    console.log(`✅ Uploaded: ${fileName} -> ${result.secure_url}`);
    return { fileName, url: result.secure_url, success: true };
  } catch (error) {
    console.error(`❌ Failed to compress/upload ${fileName}:`, error.message);
    return { fileName, error: error.message, success: false };
  }
}

async function processFailedImages() {
  console.log('🚀 Compressing and uploading failed images...\n');
  console.log(`📦 Found ${failedFiles.length} images to compress\n`);

  const mapping = JSON.parse(fs.readFileSync('./cloudinary-mapping.json', 'utf8'));
  let uploaded = 0;
  let failed = 0;

  // Traiter par lots de 3
  for (let i = 0; i < failedFiles.length; i += 3) {
    const batch = failedFiles.slice(i, i + 3);
    const results = await Promise.all(batch.map(compressAndUpload));

    results.forEach(result => {
      if (result.success) {
        mapping[result.fileName] = result.url;
        uploaded++;
      } else {
        failed++;
      }
    });

    console.log(`\n📊 Progress: ${uploaded + failed}/${failedFiles.length} (${uploaded} success, ${failed} failed)\n`);

    // Pause entre les lots
    if (i + 3 < failedFiles.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Sauvegarder le mapping mis à jour
  fs.writeFileSync('./cloudinary-mapping.json', JSON.stringify(mapping, null, 2));

  console.log('\n✨ Compression and upload completed!');
  console.log(`✅ Successfully uploaded: ${uploaded}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📝 Total images on Cloudinary: ${Object.keys(mapping).length}`);
}

processFailedImages().catch(console.error);
