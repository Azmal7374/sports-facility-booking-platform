import { z } from 'zod';

const CreateFacilityvalidationSchema = z.object({
  body: z.object({
    name: z.string(),
    description: z.string(),
    pricePerHour: z
      .number()
      .positive('Price per hour must be a positive number'),
    location: z.string(),
    isDeleted: z.boolean().default(false),
  }),
});




export const Facilityvalidation = {
    CreateFacilityvalidationSchema 
  };