import {z} from 'zod';
import { SubmissionLanguage, SubmissionStatus } from '../models/submission.model';

export const createSubmissionSchema = z.object({
    problemId: z.string({message: "problemId is required"}).length(24, {message: "invalid problem id"}),
    code: z.string({message: "code is required"}).min(1, {message: "code must contain at least 1 character"}),
    language: z.nativeEnum(SubmissionLanguage, {message: "language must be one of cpp, java, python, javascript"})
});

export const updateSubmissionSchema = z.object({
    status: z.nativeEnum(SubmissionStatus, {message: "submission status must be one of pending, completed, time_limit_exceeded, correct_answer, wrong_answer, runtime_exception"}),
    // submisssionData: z.any(),
    problemId: z.string({message: "problemId is required"}).min(1, {message: "invalid problem id"}).optional(),
    userId: z.string({message: "userId is required"}).min(1, {message: "invalid user id"}).optional()
});

export const findByIdSchema = z.object({
    id: z.string().min(24, {message: "invalid id"})
});

export const findByUserIdSchema = z.object({
    userId: z.string({message: "User id is required"})
});

export const findByUserAndProblemIdSchema = z.object({
    userId: z.string({message: "User id is required"}),
    problemId: z.string({message: "Problem id is required"}),
});