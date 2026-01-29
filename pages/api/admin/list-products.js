import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const allProducts = await prisma.product.findMany({
      include: {
        variants: true,
        collection: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    const productList = allProducts.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      isActive: p.isActive,
      collection: p.collection?.name || 'none',
      totalVariants: p.variants.length,
      variantsWithStock: p.variants.filter(v => v.stock > 0).length
    }));

    return res.status(200).json({
      total: allProducts.length,
      products: productList
    });

  } catch (error) {
    console.error('Error listing products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to list products',
      error: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
}
