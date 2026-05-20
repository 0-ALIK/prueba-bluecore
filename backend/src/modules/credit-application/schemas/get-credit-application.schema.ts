import { z } from 'zod';

export const getCreditApplicationSchema = z.object({
  id: z.string().uuid(),
});
