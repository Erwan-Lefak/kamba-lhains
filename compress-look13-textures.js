const sharp = require('sharp');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Configuration Cloudinary
cloudinary.config({
  cloud_name: 'diibzuu9j',
  api_key: '733766113121784',
  api_secret: 'J0SSqsWd-MEksJtiVL74KSZacdY'
});

const sourceDir = '/home/erwan/Documents/Projets/kamba-lhains/Photo V2/Produits/final/look 13';

const textures = [
  { file: 'tex 1.jpg', name: 'voile-noir-m-tex1' },
  { file: 'tex 2.jpg', name: 'voile-noir-m-tex2' }
];

async function compressAndUpload() {
  console.log('🔧 Compressing and uploading textures...\n');

  const uploadedUrls = [];

  for (const texture of textures) {
    const inputPath = path.join(sourceDir, texture.file);
    const outputPath = `/tmp/${texture.name}.jpg`;

    try {
      console.log(`🗜️  Compressing ${texture.file}...`);

      // Compress to under 10MB
      await sharp(inputPath)
        .resize(3000, 3000, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 80 })
        .toFile(outputPath);

      console.log(`📤 Uploading ${texture.name}...`);

      const result = await cloudinary.uploader.upload(outputPath, {
        folder: 'kamba-lhains/products',
        public_id: texture.name,
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
      console.error(`❌ Error processing ${texture.file}:`, error.message);
    }
  }

  console.log('\n✨ All textures uploaded!');
  console.log('\n📋 Complete URLs list:');
  const allUrls = [
    "https://res.cloudinary.com/diibzuu9j/image/upload/v1765124060/kamba-lhains/products/voile-noir-m-face.jpg",
    "https://res.cloudinary.com/diibzuu9j/image/upload/v1765124064/kamba-lhains/products/voile-noir-m-droit.jpg",
    "https://res.cloudinary.com/diibzuu9j/image/upload/v1765124069/kamba-lhains/products/voile-noir-m-gauche.jpg",
    "https://res.cloudinary.com/diibzuu9j/image/upload/v1765124073/kamba-lhains/products/voile-noir-m-dos.jpg",
    ...uploadedUrls
  ];
  console.log(JSON.stringify(allUrls, null, 2));
}

compressAndUpload().catch(console.error);
