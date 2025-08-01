const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration des tailles d'images responsives
const RESPONSIVE_SIZES = [
  { width: 400, quality: 80, suffix: '-400w' },
  { width: 800, quality: 75, suffix: '-800w' },
  { width: 1200, quality: 70, suffix: '-1200w' },
  { width: 1600, quality: 65, suffix: '-1600w' }
];

// Dossiers source et destination
const INPUT_DIR = path.join(__dirname, '../public/images/collection');
const OUTPUT_DIR = path.join(__dirname, '../public/images/collection/optimized');

// Créer le dossier de sortie s'il n'existe pas
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function optimizeImage(inputPath, filename) {
  const nameWithoutExt = path.parse(filename).name;
  
  try {
    // Obtenir les métadonnées de l'image originale
    const metadata = await sharp(inputPath).metadata();
    console.log(`Optimisation de ${filename} (${metadata.width}x${metadata.height})`);
    
    // Générer les versions WebP optimisées
    for (const size of RESPONSIVE_SIZES) {
      // Éviter d'agrandir les images plus petites
      if (metadata.width < size.width) continue;
      
      const outputPath = path.join(OUTPUT_DIR, `${nameWithoutExt}${size.suffix}.webp`);
      
      await sharp(inputPath)
        .resize(size.width, null, {
          withoutEnlargement: true,
          fastShrinkOnLoad: false
        })
        .webp({ 
          quality: size.quality,
          effort: 6, // Meilleure compression
          nearLossless: false
        })
        .toFile(outputPath);
      
      console.log(`  ✓ Créé ${nameWithoutExt}${size.suffix}.webp`);
    }
    
    // Créer aussi une version WebP à taille originale pour une qualité maximale
    const originalOutputPath = path.join(OUTPUT_DIR, `${nameWithoutExt}-original.webp`);
    await sharp(inputPath)
      .webp({ 
        quality: 85,
        effort: 6,
        nearLossless: false
      })
      .toFile(originalOutputPath);
    
    console.log(`  ✓ Créé ${nameWithoutExt}-original.webp`);
    
  } catch (error) {
    console.error(`Erreur lors de l'optimisation de ${filename}:`, error);
  }
}

async function optimizeAllImages() {
  console.log('🖼️  Début de l\'optimisation des images...\n');
  
  try {
    const files = fs.readdirSync(INPUT_DIR);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png)$/i.test(file) && !file.startsWith('.')
    );
    
    console.log(`Trouvé ${imageFiles.length} images à optimiser\n`);
    
    let processed = 0;
    for (const file of imageFiles) {
      const inputPath = path.join(INPUT_DIR, file);
      await optimizeImage(inputPath, file);
      processed++;
      console.log(`Progression: ${processed}/${imageFiles.length}\n`);
    }
    
    // Générer un manifest des images optimisées
    const manifest = {
      generated: new Date().toISOString(),
      sizes: RESPONSIVE_SIZES,
      images: imageFiles.map(file => {
        const nameWithoutExt = path.parse(file).name;
        return {
          original: file,
          optimized: {
            original: `${nameWithoutExt}-original.webp`,
            responsive: RESPONSIVE_SIZES.map(size => ({
              width: size.width,
              file: `${nameWithoutExt}${size.suffix}.webp`
            }))
          }
        };
      })
    };
    
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
    
    console.log('✅ Optimisation terminée !');
    console.log(`📁 Images optimisées sauvegardées dans: ${OUTPUT_DIR}`);
    console.log('📄 Manifest généré: manifest.json');
    
  } catch (error) {
    console.error('❌ Erreur durant l\'optimisation:', error);
    process.exit(1);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  optimizeAllImages();
}

module.exports = { optimizeAllImages, RESPONSIVE_SIZES };