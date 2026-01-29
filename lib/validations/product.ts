import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Le nom du produit est requis'),
  slug: z.string().min(1, 'Le slug est requis'),
  description: z.string().min(1, 'La description est requise'),
  price: z.number().positive('Le prix doit être positif'),
  compareAtPrice: z.number().positive().optional(),
  images: z.array(z.string().url('URL d\'image invalide')).min(1, 'Au moins une image est requise'),
  category: z.enum(['TOPS', 'BOTTOMS', 'ACCESSORIES', 'OUTERWEAR', 'UNDERWEAR', 'BAGS', 'HATS']),
  tags: z.array(z.string()).optional().default([]),
  materials: z.array(z.string()).optional().default([]),
  careInstructions: z.string().optional(),
  madeIn: z.string().optional(),
  collectionId: z.string().optional(),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  isExclusive: z.boolean().optional().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const addToCartSchema = z.object({
  productId: z.string().cuid('ID produit invalide'),
  quantity: z.number().int().positive('La quantité doit être positive'),
  size: z.string().optional(),
  color: z.string().optional(),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive('La quantité doit être positive'),
});

export const searchProductsSchema = z.object({
  query: z.string().min(1, 'Terme de recherche requis'),
  category: z.string().optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  inStock: z.boolean().optional(),
  sortBy: z.enum(['name', 'price', 'created']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type SearchProductsInput = z.infer<typeof searchProductsSchema>;