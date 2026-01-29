const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configuration Cloudinary
cloudinary.config({
  cloud_name: 'diibzuu9j',
  api_key: '733766113121784',
  api_secret: 'J0SSqsWd-MEksJtiVL74KSZacdY'
});

// Fonction pour uploader une image
async function uploadImage(filePath) {
  const fileName = path.basename(filePath, path.extname(filePath));

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: `kamba-images/${fileName}`,
      folder: 'kamba-images',
      resource_type: 'image',
      overwrite: true,
      transformation: [
        { quality: 'auto:good', fetch_format: 'auto' }
      ]
    });

    console.log(`✅ Uploaded: ${fileName} -> ${result.secure_url}`);
    return { fileName, url: result.secure_url, success: true };
  } catch (error) {
    console.error(`❌ Failed to upload ${fileName}:`, error.message);
    return { fileName, error: error.message, success: false };
  }
}

// Fonction principale
async function uploadAllImages() {
  console.log('🚀 Starting Cloudinary upload...\n');

  // Restaurer les images depuis /tmp
  const tmpLargeImages = '/tmp/kamba-large-images';
  const tmpUnusedImages = '/tmp/kamba-unused-images';
  const publicImages = path.join(__dirname, 'public/images');

  // Créer un dossier pour stocker les mappings
  const mappingFile = path.join(__dirname, 'cloudinary-mapping.json');
  const mapping = {};

  // Collecter toutes les images à uploader
  const imagesToUpload = [];

  // Images dans /tmp/kamba-large-images
  if (fs.existsSync(tmpLargeImages)) {
    const files = fs.readdirSync(tmpLargeImages);
    files.forEach(file => {
      if (file.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        imagesToUpload.push(path.join(tmpLargeImages, file));
      }
    });
  }

  console.log(`📦 Found ${imagesToUpload.length} large images to upload\n`);

  // Uploader les images par lots de 5 pour éviter de surcharger l'API
  const batchSize = 5;
  let uploaded = 0;
  let failed = 0;

  for (let i = 0; i < imagesToUpload.length; i += batchSize) {
    const batch = imagesToUpload.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(uploadImage));

    results.forEach(result => {
      if (result.success) {
        mapping[result.fileName] = result.url;
        uploaded++;
      } else {
        failed++;
      }
    });

    console.log(`\n📊 Progress: ${uploaded + failed}/${imagesToUpload.length} (${uploaded} success, ${failed} failed)\n`);

    // Pause de 1 seconde entre les lots pour respecter les limites de l'API
    if (i + batchSize < imagesToUpload.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Sauvegarder le mapping
  fs.writeFileSync(mappingFile, JSON.stringify(mapping, null, 2));

  console.log('\n✨ Upload completed!');
  console.log(`✅ Successfully uploaded: ${uploaded}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📝 Mapping saved to: ${mappingFile}`);

  return mapping;
}

// Exécuter le script
uploadAllImages().catch(console.error);
