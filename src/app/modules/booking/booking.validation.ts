import { z } from 'zod';

const createBookingValidationSchema = z.object({
  body: z.object({
    date: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    facility: z.string(),
  }),
});

export const validateBooking = { createBookingValidationSchema };
