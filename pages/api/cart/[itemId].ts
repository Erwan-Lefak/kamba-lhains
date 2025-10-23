import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { withAuth } from '../../../lib/middleware/auth';
import { updateCartItemSchema } from '../../../lib/validations/product';

interface AuthenticatedRequest extends NextApiRequest {
  user: {
    id: string;
    email: string;
  };
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { itemId } = req.query;

  if (!itemId || typeof itemId !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'ID d\'item requis'
    });
  }

  switch (req.method) {
    case 'PUT':
      return updateCartItem(req, res, itemId);
    case 'DELETE':
      return removeCartItem(req, res, itemId);
    default:
      return res.status(405).json({
        success: false,
        message: 'Méthode non autorisée'
      });
  }
}

async function updateCartItem(req: AuthenticatedRequest, res: NextApiResponse, itemId: string) {
  try {
    const validatedData = updateCartItemSchema.parse(req.body);
    const { quantity } = validatedData;

    // Verify the cart item belongs to the user
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId: req.user.id
      }
    });

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Item de panier non trouvé'
      });
    }

    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Quantité mise à jour',
      data: { cartItem: updatedItem }
    });

  } catch (error) {
    console.error('Update cart item error:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: (error as any).errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour'
    });
  }
}

async function removeCartItem(req: AuthenticatedRequest, res: NextApiResponse, itemId: string) {
  try {
    // Verify the cart item belongs to the user before deletion
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId: req.user.id
      }
    });

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Item de panier non trouvé'
      });
    }

    await prisma.cartItem.delete({
      where: { id: itemId }
    });

    res.status(200).json({
      success: true,
      message: 'Produit retiré du panier'
    });

  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression'
    });
  }
}

export default withAuth(handler);