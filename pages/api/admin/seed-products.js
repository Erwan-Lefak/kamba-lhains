import { PrismaClient } from '@prisma/client';
import { products } from '../../../data/products';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Simple auth check
  const { adminKey } = req.body;
  if (adminKey !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const importedProducts = [];
    const skippedProducts = [];
    let collections = {};

    // Filtre les produits - exclu seulement les sacs (pas les vestes ni les jupes)
    const productsToImport = products.filter(p => {
      const id = p.id.toLowerCase();
      const name = p.name.toLowerCase();

      // Exclure uniquement si c'est un sac (et pas un mot contenant "sac" comme "veste")
      const isBag = (
        id === 'sac' ||
        id.includes('sac-') ||
        id.includes('-sac') ||
        name === 'sac' ||
        (name.includes('sac ') && !name.includes('veste')) ||
        (name.includes(' sac') && !name.includes('veste'))
      );

      return !isBag;
    });

    console.log(`Importing ${productsToImport.length} products (excluding sacs)...`);

    for (const product of productsToImport) {
      try {
        // Détermine la collection basée sur subCategory
        let collectionId = null;
        if (product.subCategory) {
          const collectionName = product.subCategory.toLowerCase();

          // Créer ou récupérer la collection
          if (!collections[collectionName]) {
            collections[collectionName] = await prisma.collection.upsert({
              where: { name: collectionName },
              update: {},
              create: {
                name: collectionName,
                displayName: capitalizeFirst(collectionName),
                isActive: true
              }
            });
          }
          collectionId = collections[collectionName].id;
        }

        // Mapper la catégorie vers ProductCategory enum
        const categoryMap = {
          'denim': 'OUTERWEAR',
          'aube': 'TOPS',
          'crepuscule': 'TOPS',
          'zenith': 'TOPS',
          'homme': 'TOPS'
        };

        const category = categoryMap[product.subCategory?.toLowerCase()] || 'TOPS';

        // Créer le produit
        const createdProduct = await prisma.product.create({
          data: {
            name: product.name,
            slug: product.id,
            description: Array.isArray(product.description)
              ? product.description.join('\n')
              : product.description || '',
            price: product.price,
            collectionId,
            category,
            tags: [],
            images: product.images || [product.image],
            materials: extractMaterials(product.description),
            isActive: product.inStock !== false,
            isFeatured: product.featured || false,
            isExclusive: false
          }
        });

        // Créer les variantes pour chaque combinaison couleur/taille
        const colors = product.colors || ['Noir'];
        const sizes = product.sizes || ['S', 'M', 'L', 'XL'];

        for (const color of colors) {
          for (const size of sizes) {
            await prisma.productVariant.create({
              data: {
                productId: createdProduct.id,
                color,
                size,
                sku: `${product.id}-${color}-${size}`.toUpperCase().replace(/\s/g, '-'),
                stock: product.inStock === false ? 0 : 10, // 10 en stock par défaut si dispo
                lowStockThreshold: 5
              }
            });
          }
        }

        importedProducts.push({
          name: product.name,
          id: createdProduct.id,
          variants: colors.length * sizes.length
        });

      } catch (error) {
        console.error(`Error importing product ${product.name}:`, error);
        skippedProducts.push({
          name: product.name,
          error: error.message
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Imported ${importedProducts.length} products`,
      imported: importedProducts.length,
      skipped: skippedProducts.length,
      details: {
        imported: importedProducts.map(p => p.name),
        skipped: skippedProducts
      }
    });

  } catch (error) {
    console.error('Error seeding products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to seed products',
      error: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Helper functions
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function extractMaterials(description) {
  if (!description) return [];
  const descText = Array.isArray(description) ? description.join(' ') : description;
  const materials = [];

  if (descText.includes('coton') || descText.includes('Coton')) materials.push('Coton');
  if (descText.includes('laine') || descText.includes('Laine')) materials.push('Laine');
  if (descText.includes('polyester') || descText.includes('Polyester')) materials.push('Polyester');
  if (descText.includes('denim') || descText.includes('Denim')) materials.push('Denim');

  return materials.length > 0 ? materials : ['Textile'];
}
