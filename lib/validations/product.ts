import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Le nom du produit est requis'),
  description: z.array(z.string()).min(1, 'Au moins une description est requise'),
  price: z.number().positive('Le prix doit être positif'),
  image: z.string().url('URL d\'image invalide'),
  category: z.string().min(1, 'La catégorie est requise'),
  colors: z.array(z.string()).min(1, 'Au moins une couleur est requise'),
  sizes: z.array(z.string()).min(1, 'Au moins une taille est requise'),
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
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