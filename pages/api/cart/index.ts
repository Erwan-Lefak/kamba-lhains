import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { withAuth } from '../../../lib/middleware/auth';
import { addToCartSchema } from '../../../lib/validations/product';

interface AuthenticatedRequest extends NextApiRequest {
  user: {
    id: string;
    email: string;
  };
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getCart(req, res);
    case 'POST':
      return addToCart(req, res);
    case 'DELETE':
      return clearCart(req, res);
    default:
      return res.status(405).json({ 
        success: false, 
        message: 'Méthode non autorisée' 
      });
  }
}

async function getCart(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const totalAmount = cartItems.reduce((total, item) => {
      return total + (Number(item.product.price) * item.quantity);
    }, 0);

    res.status(200).json({
      success: true,
      data: {
        items: cartItems,
        totalItems: cartItems.reduce((total, item) => total + item.quantity, 0),
        totalAmount: totalAmount.toFixed(2)
      }
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du panier'
    });
  }
}

async function addToCart(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const validatedData = addToCartSchema.parse(req.body);
    const { productId, quantity, size, color } = validatedData;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: {
          where: {
            color: color || '',
            size: size || ''
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Check variant stock if size and color are specified
    if (size && color && product.variants.length > 0) {
      const variant = product.variants[0];
      if (variant.stock - variant.reservedStock < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Stock insuffisant pour cette variante'
        });
      }
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId_size_color: {
          userId: req.user.id,
          productId,
          size: size || '',
          color: color || ''
        }
      }
    });

    let cartItem;

    if (existingCartItem) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
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
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: req.user.id,
          productId,
          quantity,
          size: size || '',
          color: color || ''
        },
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
    }

    res.status(200).json({
      success: true,
      message: 'Produit ajouté au panier',
      data: { cartItem }
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: (error as any).errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout au panier'
    });
  }
}

async function clearCart(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: req.user.id }
    });

    res.status(200).json({
      success: true,
      message: 'Panier vidé avec succès'
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du panier'
    });
  }
}

export default withAuth(handler);