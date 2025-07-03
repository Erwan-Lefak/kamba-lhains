import { prisma } from '../../../lib/prisma'
import { withAuth, withOptionalAuth } from '../../../lib/middleware/auth'
import { createProductSchema } from '../../../lib/validations/product'

async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res)
    case 'POST':
      return createProduct(req, res)
    default:
      return res.status(405).json({ 
        success: false, 
        message: 'Méthode non autorisée' 
      })
  }
}

async function getProducts(req, res) {
  try {
    const { 
      category, 
      featured, 
      inStock, 
      search,
      limit = 20,
      offset = 0 
    } = req.query

    const where = {}
    
    if (category) where.category = category
    if (featured !== undefined) where.featured = featured === 'true'
    if (inStock !== undefined) where.inStock = inStock === 'true'
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { hasSome: [search] } }
      ]
    }

    const products = await prisma.product.findMany({
      where,
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { createdAt: 'desc' }
    })

    const total = await prisma.product.count({ where })

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
    })

  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des produits'
    })
  }
}

async function createProduct(req, res) {
  // Only admins can create products
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Accès administrateur requis'
    })
  }

  try {
    const validatedData = createProductSchema.parse(req.body)

    const product = await prisma.product.create({
      data: validatedData
    })

    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès',
      data: { product }
    })

  } catch (error) {
    console.error('Create product error:', error)
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: error.errors
      })
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du produit'
    })
  }
}

// Use optional auth for GET (public) and required auth for POST (admin only)
export default function (req, res) {
  if (req.method === 'GET') {
    return withOptionalAuth(handler)(req, res)
  } else {
    return withAuth(handler, { adminOnly: true })(req, res)
  }
}