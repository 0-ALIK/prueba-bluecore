import { z } from 'zod';

export const createCreditApplicationSchema = z.object({
  amount: z.coerce.number(),
  term: z.coerce.number(),
  cardId: z.string(),
});
