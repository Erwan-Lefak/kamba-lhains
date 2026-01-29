const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configuration Cloudinary
cloudinary.config({
  cloud_name: 'diibzuu9j',
  api_key: '733766113121784',
  api_secret: 'J0SSqsWd-MEksJtiVL74KSZacdY'
});

const sourceDir = '/home/erwan/Documents/Projets/kamba-lhains/Photo V2/Produits/final/look 13';

// Ordre spécifique demandé : face, profil droit, profil gauche, dos, tex1, tex2
const images = [
  { file: 'face .jpg', name: 'voile-noir-m-face' },
  { file: 'profil droit.jpg', name: 'voile-noir-m-droit' },
  { file: 'profil gauche.jpg', name: 'voile-noir-m-gauche' },
  { file: 'dos.jpg', name: 'voile-noir-m-dos' },
  { file: 'tex 1.jpg', name: 'voile-noir-m-tex1' },
  { file: 'tex 2.jpg', name: 'voile-noir-m-tex2' }
];

async function uploadImages() {
  console.log('🚀 Uploading look 13 images to Cloudinary...\n');

  const uploadedUrls = [];

  for (const image of images) {
    const filePath = path.join(sourceDir, image.file);

    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${filePath}`);
      continue;
    }

    try {
      console.log(`📤 Uploading ${image.file} as ${image.name}...`);

      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'kamba-lhains/products',
        public_id: image.name,
        overwrite: true,
        resource_type: 'image',
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      });

      console.log(`✅ Uploaded: ${result.secure_url}\n`);
      uploadedUrls.push(result.secure_url);

    } catch (error) {
      console.error(`❌ Error uploading ${image.file}:`, error.message);
    }
  }

  console.log('\n✨ Upload complete!');
  console.log('\n📋 URLs to use in products.ts:');
  console.log(JSON.stringify(uploadedUrls, null, 2));

  return uploadedUrls;
}

uploadImages().catch(console.error);
