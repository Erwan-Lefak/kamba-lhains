const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Charger le mapping Cloudinary
const mapping = JSON.parse(fs.readFileSync('./cloudinary-mapping.json', 'utf8'));

console.log(`📦 Loaded ${Object.keys(mapping).length} Cloudinary URLs\n`);

// Fonction pour remplacer les chemins d'images dans un fichier
function updateImagePathsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let replacements = 0;

  // Parcourir tous les fichiers dans le mapping
  Object.entries(mapping).forEach(([fileName, cloudinaryUrl]) => {
    // Patterns à rechercher
    const patterns = [
      new RegExp(`/images/${fileName}\\.(jpg|jpeg|png|gif|webp)(\\?[^"'\\s]*)?`, 'gi'),
      new RegExp(`"/images/${fileName}"`, 'gi'),
      new RegExp(`'/images/${fileName}'`, 'gi'),
    ];

    patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // Garder les query params si présents
          const queryMatch = match.match(/\?[^"'\s]*/);
          const query = queryMatch ? queryMatch[0] : '';

          content = content.replace(match, cloudinaryUrl + query);
          modified = true;
          replacements++;
        });
      }
    });
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${path.relative(process.cwd(), filePath)} (${replacements} replacements)`);
    return replacements;
  }

  return 0;
}

async function updateAllFiles() {
  console.log('🚀 Updating image paths to Cloudinary URLs...\n');

  // Fichiers à mettre à jour
  const filePatterns = [
    'pages/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'data/**/*.{js,jsx,ts,tsx}',
    'styles/**/*.css',
  ];

  let allFiles = [];
  filePatterns.forEach(pattern => {
    const files = glob.sync(pattern);
    allFiles = allFiles.concat(files);
  });

  console.log(`📁 Found ${allFiles.length} files to process\n`);

  let totalReplacements = 0;
  let filesModified = 0;

  allFiles.forEach(file => {
    const replacements = updateImagePathsInFile(file);
    if (replacements > 0) {
      totalReplacements += replacements;
      filesModified++;
    }
  });

  console.log('\n✨ Update completed!');
  console.log(`✅ Files modified: ${filesModified}`);
  console.log(`📝 Total replacements: ${totalReplacements}`);
}

updateAllFiles().catch(console.error);
