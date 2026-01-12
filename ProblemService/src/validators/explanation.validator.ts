import z from "zod";

export const findByProblemIdSchemaa = z.object({
    problemId: z.string().length(24, { message: "Problem id must be 24 characters long" })
});