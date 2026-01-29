// Script temporaire pour analyser les breadcrumbs
const fs = require('fs');

// Lire le fichier products.ts
const content = fs.readFileSync('./data/products.ts', 'utf8');

// Extraire les produits avec regex simple
const productMatches = content.matchAll(/name: "([^"]+)"[\s\S]{1,500}?description: \[([\s\S]{1,800}?)\]/g);

console.log("=== ANALYSE DES BREADCRUMBS POUR CHAQUE PRODUIT ===\n");

for (const match of productMatches) {
  const name = match[1];
  const descContent = match[2];

  // Chercher la catégorie dans la description
  const catMatch = descContent.match(/(Aube|Zénith|Crépuscule) \/ (Haut|Bas) \/ ([^\/\n"]+)/);

  if (catMatch) {
    const collection = catMatch[1];
    const type = catMatch[2];
    const category = catMatch[3].trim();
    console.log(`${name}`);
    console.log(`  => ${collection} - ${type} - ${category}\n`);
  } else {
    console.log(`${name}`);
    console.log(`  => ⚠️ PAS DE CATÉGORIE TROUVÉE DANS LA DESCRIPTION\n`);
  }
}
