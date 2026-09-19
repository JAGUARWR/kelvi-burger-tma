import { z } from 'zod';

export const orderItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().int().positive('Price must be positive'),
  quantity: z.number().int().positive('Quantity must be positive'),
  weight: z.string().optional(),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Cart is empty'),
  orderType: z.enum(['takeaway', 'dine_in']),
  bonusToUse: z.number().int().nonnegative().optional().default(0),
  pickup_time: z.string().optional().default('asap'),
  total_price: z.number().int().nonnegative().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['new', 'cooking', 'ready', 'completed', 'cancelled']),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
