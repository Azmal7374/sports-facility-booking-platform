import { z } from 'zod';

const CreateFacilityvalidationSchema = z.object({
  body: z.object({
    name: z.string(),
    description: z.string(),
    pricePerHour: z.number().positive('please provide positive number'),
    location: z.string(),
    isDeleted: z.boolean().default(false),
  }),
});

const UpdateFacilityvalidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    pricePerHour: z
      .number()
      .positive('please provide positive number')
      .optional(),
    location: z.string().optional(),
    isDeleted: z.boolean().default(false).optional(),
  }),
});

export const Facilityvalidation = {
  CreateFacilityvalidationSchema,
  UpdateFacilityvalidationSchema,
};
