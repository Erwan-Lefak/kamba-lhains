import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { variantId, newStock } = req.body;

  if (!variantId || newStock === undefined || newStock === null) {
    return res.status(400).json({ error: 'variantId et newStock sont requis' });
  }

  if (typeof newStock !== 'number' || newStock < 0) {
    return res.status(400).json({ error: 'newStock doit être un nombre positif' });
  }

  try {
    const updatedVariant = await prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: newStock },
      include: {
        product: true
      }
    });

    res.status(200).json({
      success: true,
      variant: {
        id: updatedVariant.id,
        productName: updatedVariant.product.name,
        color: updatedVariant.color,
        size: updatedVariant.size,
        sku: updatedVariant.sku,
        stock: updatedVariant.stock
      }
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du stock' });
  }
}
