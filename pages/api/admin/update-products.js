import { PrismaClient } from '@prisma/client';

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
    // Activer tous les produits et mettre à jour leur stock
    const allProducts = await prisma.product.findMany({
      include: {
        variants: true
      }
    });

    const updates = [];

    for (const product of allProducts) {
      // Activer le produit
      await prisma.product.update({
        where: { id: product.id },
        data: { isActive: true }
      });

      // Mettre à jour le stock de toutes les variantes à 10 si elles sont à 0
      for (const variant of product.variants) {
        if (variant.stock === 0) {
          await prisma.productVariant.update({
            where: { id: variant.id },
            data: { stock: 10 }
          });
        }
      }

      updates.push({
        name: product.name,
        slug: product.slug,
        isActive: true,
        variantsUpdated: product.variants.filter(v => v.stock === 0).length
      });
    }

    return res.status(200).json({
      success: true,
      message: `Updated ${allProducts.length} products`,
      updated: updates.length,
      details: updates
    });

  } catch (error) {
    console.error('Error updating products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update products',
      error: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
}
