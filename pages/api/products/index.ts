import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { withAuth, withOptionalAuth } from '../../../lib/middleware/auth';
import { createProductSchema } from '../../../lib/validations/product';

interface ProductQuery {
  category?: string;
  featured?: string;
  inStock?: string;
  search?: string;
  limit?: string;
  offset?: string;
}

interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);
    case 'POST':
      return createProduct(req, res);
    default:
      return res.status(405).json({ 
        success: false, 
        message: 'Méthode non autorisée' 
      });
  }
}

async function getProducts(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const query = req.query as ProductQuery;
    const { 
      category, 
      featured, 
      inStock, 
      search,
      limit = '20',
      offset = '0' 
    } = query;

    const where: any = {};

    if (category) where.category = category;
    if (featured !== undefined) where.isFeatured = featured === 'true';
    if (inStock !== undefined) {
      where.variants = {
        some: {
          stock: {
            gt: 0
          }
        }
      };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const products = await prisma.product.findMany({
      where,
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.product.count({ where });

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: total > parseInt(offset) + parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des produits'
    });
  }
}

async function createProduct(req: AuthenticatedRequest, res: NextApiResponse) {
  // Only admins can create products
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Accès administrateur requis'
    });
  }

  try {
    const validatedData = createProductSchema.parse(req.body);

    const product = await prisma.product.create({
      data: {
        ...validatedData,
        collectionId: validatedData.collectionId || null
      }
    });

    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès',
      data: { product }
    });

  } catch (error: any) {
    console.error('Create product error:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du produit'
    });
  }
}

// Use optional auth for GET (public) and required auth for POST (admin only)
export default function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return withOptionalAuth(handler)(req, res);
  } else {
    return withAuth(handler, { adminOnly: true })(req, res);
  }
}