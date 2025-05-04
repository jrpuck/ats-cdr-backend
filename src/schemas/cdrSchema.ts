import { z } from 'zod';

/**
 * Runtime schema for incoming CDR objects.
 */
export const CdrRecordSchema = z.object({
  cust_id: z.number(),
  id: z.string(),
  seq: z.number(),
  start_time: z
    .string()
    .refine((s) => !isNaN(Date.parse(s)), { message: 'Invalid date' }),
  end_time: z
    .string()
    .refine((s) => !isNaN(Date.parse(s)), { message: 'Invalid date' }),
  added_dt: z
    .string()
    .refine((s) => !isNaN(Date.parse(s)), { message: 'Invalid date' }),
  caller_id: z.string().optional(),
});

export type CdrRecord = z.infer<typeof CdrRecordSchema>;
