import { z } from 'zod';

export const createProblemSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    difficulty: z.enum(["easy", "medium", "hard"]),
    editorial: z.string().optional(),
    stub: z.string().min(1),
    driver_code: z.string().min(1),
    testcases: z.array(z.object({
        input: z.string().min(1),
        output: z.string().min(1)
    })).optional(),
    sample: z.array(z.object({
        input: z.string().min(1),
        output: z.string().min(1)
    })).optional(),
    company: z.array(z.string().max(24, { message: "Company id must be 24 characters long" })).optional()
});

export const updateProblemSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    stub: z.string().min(1).optional(),
    driver_code: z.string().min(1).optional(),
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
    editorial: z.string().optional(),
    testcases: z.array(z.object({
        input: z.string().min(1),
        output: z.string().min(1)
    })).optional(),
    sample: z.array(z.object({
        input: z.string().min(1),
        output: z.string().min(1)
    })).optional(),
    company: z.array(z.string().max(24, { message: "Company id must be 24 characters long" })).optional()
});

export const findByDifficultySchema = z.object({
    difficulty: z.enum(["easy", "medium", "hard"])
});

export const findByCompanySchema = z.object({
    company: z.string().max(24, { message: "Company id must be 24 characters long" })
});

export type CreateProblemDto = z.infer<typeof createProblemSchema>;
export type UpdateProblemDto = z.infer<typeof updateProblemSchema>;