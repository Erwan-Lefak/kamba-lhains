const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration Cloudinary
cloudinary.config({
  cloud_name: 'diibzuu9j',
  api_key: '733766113121784',
  api_secret: 'J0SSqsWd-MEksJtiVL74KSZacdY'
});

// Fonction pour uploader une image
async function uploadImage(filePath) {
  const relativePath = filePath.replace('public/images/', '');
  const fileName = path.basename(filePath, path.extname(filePath));
  const folder = path.dirname(relativePath);

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

    console.log(`✅ ${fileName}`);
    return { fileName, url: result.secure_url, success: true, originalPath: filePath };
  } catch (error) {
    console.error(`❌ ${fileName}: ${error.message}`);
    return { fileName, error: error.message, success: false, originalPath: filePath };
  }
}

async function uploadAllRemainingImages() {
  console.log('🚀 Uploading remaining images from public/images...\n');

  // Trouver toutes les images
  const imageFiles = glob.sync('public/images/**/*.{jpg,jpeg,png,gif,webp,JPG,JPEG,PNG,GIF,WEBP}');
  console.log(`📦 Found ${imageFiles.length} images to upload\n`);

  // Charger le mapping existant
  let mapping = {};
  if (fs.existsSync('./cloudinary-mapping.json')) {
    mapping = JSON.parse(fs.readFileSync('./cloudinary-mapping.json', 'utf8'));
  }

  let uploaded = 0;
  let failed = 0;
  let skipped = 0;

  // Uploader par lots de 5
  const batchSize = 5;
  for (let i = 0; i < imageFiles.length; i += batchSize) {
    const batch = imageFiles.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(uploadImage));

    results.forEach(result => {
      if (result.success) {
        mapping[result.fileName] = result.url;
        uploaded++;
      } else {
        failed++;
      }
    });

    console.log(`\n📊 Progress: ${uploaded + failed}/${imageFiles.length} (${uploaded} ✅, ${failed} ❌)\n`);

    // Pause entre les lots
    if (i + batchSize < imageFiles.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Sauvegarder le mapping
  fs.writeFileSync('./cloudinary-mapping.json', JSON.stringify(mapping, null, 2));

  console.log('\n✨ Upload completed!');
  console.log(`✅ Successfully uploaded: ${uploaded}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📝 Total images on Cloudinary: ${Object.keys(mapping).length}`);

  return mapping;
}

uploadAllRemainingImages().catch(console.error);
