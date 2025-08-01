import { z } from 'zod';

export const shippingAddressSchema = z.object({
  firstName: z.string().min(2, 'Le prénom est requis'),
  lastName: z.string().min(2, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
  address: z.string().min(5, 'Adresse requise'),
  address2: z.string().optional(),
  city: z.string().min(2, 'Ville requise'),
  postalCode: z.string().min(5, 'Code postal requis'),
  country: z.string().min(2, 'Pays requis').default('FR'),
});

export const createOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  billingAddress: shippingAddressSchema.optional(),
  useSameAddress: z.boolean().default(true),
  paymentMethod: z.enum(['stripe', 'paypal']).default('stripe'),
  shippingMethod: z.enum(['standard', 'express']).default('standard'),
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
});

export const orderItemSchema = z.object({
  productId: z.string().cuid('ID produit invalide'),
  quantity: z.number().int().positive('La quantité doit être positive'),
  price: z.number().positive('Le prix doit être positif'),
  size: z.string().optional(),
  color: z.string().optional(),
});

export const orderFilterSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  customerId: z.string().optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type OrderFilterInput = z.infer<typeof orderFilterSchema>;