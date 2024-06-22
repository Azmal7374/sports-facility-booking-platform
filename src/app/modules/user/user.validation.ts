import { z } from 'zod';

export const UserRoleSchema = z.enum(['admin', 'user']);

const createUserValidation = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    phone: z.string(),
    role: UserRoleSchema,
    address: z.string(),
  }),
});

export const validateUser = { createUserValidation };
