import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { searchProductsSchema } from '../../../lib/validations/product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Méthode non autorisée'
    });
  }

  try {
    const validatedQuery = searchProductsSchema.parse(req.query);
    const { 
      query, 
      category, 
      priceMin, 
      priceMax, 
      inStock, 
      sortBy = 'name', 
      sortOrder = 'asc',
      page = 1,
      limit = 20
    } = validatedQuery;

    // Build where clause
    const where: any = {};

    // Text search in name and description
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { array_contains: query } }
      ];
    }

    // Category filter
    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    // Price range filter
    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = {};
      if (priceMin !== undefined) {
        where.price.gte = priceMin;
      }
      if (priceMax !== undefined) {
        where.price.lte = priceMax;
      }
    }

    // Stock filter - check if product has variants with stock
    if (inStock !== undefined) {
      where.variants = {
        some: {
          stock: {
            gt: 0
          }
        }
      };
    }

    // Build orderBy clause
    const orderBy: any = {};
    if (sortBy === 'name') {
      orderBy.name = sortOrder;
    } else if (sortBy === 'price') {
      orderBy.price = sortOrder;
    } else if (sortBy === 'created') {
      orderBy.createdAt = sortOrder;
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Execute search query
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          images: true,
          category: true,
          tags: true,
          isFeatured: true,
          createdAt: true
        }
      }),
      prisma.product.count({ where })
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit
        },
        searchParams: {
          query,
          category,
          priceMin,
          priceMax,
          inStock,
          sortBy,
          sortOrder
        }
      }
    });

  } catch (error) {
    console.error('Search products error:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Paramètres de recherche invalides',
        errors: (error as any).errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche'
    });
  }
}