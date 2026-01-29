const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Patterns to replace for Size Guide
const sizeGuideReplacements = [
  {
    from: /COMMENT UTILISER CE TABLEAU DE TAILLES/g,
    to: "{t('products.sizeGuide.title')}"
  },
  {
    from: /Taille EU<\/th>/g,
    to: "{t('products.sizeGuide.sizeEU')}</th>"
  },
  {
    from: /Taille US<\/th>/g,
    to: "{t('products.sizeGuide.sizeUS')}</th>"
  },
  {
    from: /Tour de poitrine \(cm\)<\/th>/g,
    to: "{t('products.sizeGuide.chest')}</th>"
  },
  {
    from: /Tour de taille \(cm\)<\/th>/g,
    to: "{t('products.sizeGuide.waist')}</th>"
  },
  {
    from: /Tour de hanches \(cm\)<\/th>/g,
    to: "{t('products.sizeGuide.hips')}</th>"
  },
  {
    from: /PRENDRE LES BONNES MESURES<\/h4>/g,
    to: "{t('products.sizeGuide.measurementsTitle')}</h4>"
  },
  {
    from: /<strong>Tour de poitrine :<\/strong> Mesurez horizontalement au niveau le plus fort de la poitrine\./g,
    to: "{t('products.sizeGuide.chestMeasure')}"
  },
  {
    from: /<strong>Tour de taille :<\/strong> Mesurez à l'endroit le plus étroit de la taille naturelle\./g,
    to: "{t('products.sizeGuide.waistMeasure')}"
  },
  {
    from: /<strong>Tour de hanches :<\/strong> Mesurez horizontalement au niveau le plus large des hanches\./g,
    to: "{t('products.sizeGuide.hipsMeasure')}"
  },
  {
    from: /CHOISIR LA TAILLE<\/h4>/g,
    to: "{t('products.sizeGuide.chooseSizeTitle')}</h4>"
  },
  {
    from: /Comparez vos mesures avec le tableau ci-dessus\. Si vos mesures se situent entre deux tailles, nous recommandons de choisir la taille supérieure pour un ajustement plus confortable\./g,
    to: "{t('products.sizeGuide.chooseSizeText')}"
  },
  {
    from: /EXEMPLES D'APPLICATION<\/h4>/g,
    to: "{t('products.sizeGuide.examplesTitle')}</h4>"
  },
  {
    from: /Si votre tour de poitrine est de 90 cm, votre tour de taille de 70 cm et votre tour de hanches de 94 cm, la taille S est recommandée\./g,
    to: "{t('products.sizeGuide.example1')}"
  },
  {
    from: /Si vos mesures sont : poitrine 95 cm, taille 75 cm et hanches 99 cm, la taille M conviendra parfaitement\./g,
    to: "{t('products.sizeGuide.example2')}"
  },
  {
    from: /Si vous mesurez : poitrine 92 cm, taille 73 cm et hanches 97 cm \(entre S et M\), nous conseillons la taille M pour plus de confort\./g,
    to: "{t('products.sizeGuide.example3')}"
  },
  {
    from: /CONSEILS SUPPLÉMENTAIRES<\/h4>/g,
    to: "{t('products.sizeGuide.tipsTitle')}</h4>"
  },
  {
    from: /Nos vêtements sont conçus pour un ajustement régulier\. Pour un style plus ample, optez pour la taille au-dessus\./g,
    to: "{t('products.sizeGuide.tip1')}"
  },
  {
    from: /En cas de doute, n'hésitez pas à nous contacter pour des conseils personnalisés\./g,
    to: "{t('products.sizeGuide.tip2')}"
  },
  {
    from: /Toutes les mesures sont données en centimètres et peuvent varier de ±2 cm selon les modèles\./g,
    to: "{t('products.sizeGuide.tip3')}"
  }
];

// Patterns to replace for Care Guide
const careGuideReplacements = [
  {
    from: /MATIÈRE & INSTRUCTIONS D'ENTRETIEN<\/h3>/g,
    to: "{t('products.careGuide.title')}</h3>"
  },
  {
    from: /100% Coton - Jersey/g,
    to: "{t('products.careGuide.cottonJersey')}"
  },
  {
    from: /Ceinture: 97% Coton, 3% Élasthanne/g,
    to: "{t('products.careGuide.waistband')}"
  },
  {
    from: /Facile d'entretien 30 °C/g,
    to: "{t('products.careGuide.washTemp')}"
  },
  {
    from: /Ne pas blanchir/g,
    to: "{t('products.careGuide.nobleach')}"
  },
  {
    from: /Ne pas utiliser le sèche-linge/g,
    to: "{t('products.careGuide.noDryer')}"
  },
  {
    from: /Repassage à température faible/g,
    to: "{t('products.careGuide.ironLow')}"
  },
  {
    from: /Pas de nettoyage à sec chimique/g,
    to: "{t('products.careGuide.noDryCleaning')}"
  },
  {
    from: /Nous sélectionnons avec soin nos matières, en privilégiant principalement des tissus 100% naturels, ainsi que des textiles issus de stocks dormants et de fins de séries\. Cette démarche peut entraîner de légères variations d'une pièce à l'autre, mais nous veillons toujours à préserver une harmonie visuelle et une esthétique fidèle aux modèles présentés et proposés à la vente\./g,
    to: "{t('products.careGuide.materialsIntro')}"
  },
  {
    from: /Il nous arrive également d'utiliser des matières synthétiques, mais uniquement lorsqu'elles sont issues de filières de recyclage, afin de limiter notre impact et de valoriser l'existant\. Notre approche repose ainsi sur une création responsable et engagée, où chaque pièce porte en elle l'histoire du textile auquel nous offrons une seconde vie\./g,
    to: "{t('products.careGuide.sustainabilityText')}"
  }
];

// Find all product pages
const productPages = glob.sync('pages/{aube,zenith,crepuscule}/**/*.tsx');

console.log(`Found ${productPages.length} product pages to update`);

let updatedCount = 0;
let errorCount = 0;

productPages.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Skip if already translated
    if (content.includes("t('products.sizeGuide.") || content.includes('t("products.sizeGuide.')) {
      console.log(`⏭️  Skipping ${filePath} (already translated)`);
      return;
    }

    // Apply size guide replacements
    sizeGuideReplacements.forEach(({ from, to }) => {
      if (content.match(from)) {
        content = content.replace(from, to);
        modified = true;
      }
    });

    // Apply care guide replacements
    careGuideReplacements.forEach(({ from, to }) => {
      if (content.match(from)) {
        content = content.replace(from, to);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated ${filePath}`);
      updatedCount++;
    } else {
      console.log(`⚠️  No changes needed for ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    errorCount++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`   ✅ Updated: ${updatedCount}`);
console.log(`   ❌ Errors: ${errorCount}`);
console.log(`   📝 Total: ${productPages.length}`);
