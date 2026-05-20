import { z } from 'zod';

export const updateCreditApplicationStatusSchema = z.object({
  id: z.string().uuid(),
});

export const updateCreditApplicationStatusBodySchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  comment: z.string().min(1),
});
