import { z } from 'zod';

export const createCompanySchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }).max(50, { message: "Name must be at max 50 characters long" }),
    image_url: z.string().url({ "message": "Invalid url" }).max(100, { message: "Image url must be at max 100 characters long" }).optional()
});

export const updateCompanySchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }).max(50, { message: "Name must be at max 50 characters long" }).optional(),
    image_url: z.string().url({ "message": "Invalid url" }).max(100, { message: "Image url must be at max 100 characters long" }).optional()
});

export type CreateCompanyDto = z.infer<typeof createCompanySchema>;
export type UpdateCompanyDto = z.infer<typeof updateCompanySchema>;