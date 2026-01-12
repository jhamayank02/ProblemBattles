import { Request, Response } from "express";
import { SubmissionRepository } from "../repositories/submission.repository";
import { SubmissionService } from "../services/submission.service";

const submissionRepository = new SubmissionRepository();
const submissionService = new SubmissionService(submissionRepository);

export const submissionControllers = {
    async create(req: Request, res: Response): Promise<void> {
        const userId = String(req.headers['x-user-id']);
        const submission = await submissionService.create(req.body, userId as string);
        res.status(201).json({
            message: "Submission created successfully",
            data: submission,
            success: true
        });
    },

    async findById(req: Request, res: Response): Promise<void> {
        const submission = await submissionService.findById(String(req.params.id));
        res.status(200).json({
            message: "Submission fetched successfully",
            data: submission,
            success: true
        });
    },

    async findByProblemId(req: Request, res: Response): Promise<void> {
        const submission = await submissionService.findByProblemId(String(req.params.id));
        res.status(200).json({
            message: "Submission fetched successfully",
            data: submission,
            success: true
        });
    },

    async findByUserId(req: Request, res: Response): Promise<void> {
        const submissions = await submissionService.findByUserId(String(req.params.userId));
        res.status(200).json({
            message: "Submissions fetched successfully",
            data: submissions,
            success: true
        });
    },

    async findByUserAndProblemId(req: Request, res: Response): Promise<void> {
        const submissions = await submissionService.findByUserAndProblemId(String(req.params.userId), String(req.params.problemId));
        res.status(200).json({
            message: "Submissions fetched successfully",
            data: submissions,
            success: true
        });
    },

    async deleteById(req: Request, res: Response): Promise<void> {
        const submission = await submissionService.deleteById(String(req.params.id));
        res.status(200).json({
            message: "Submission deleted successfully",
            data: submission,
            success: true
        });
    },

    async update(req: Request, res: Response): Promise<void> {
        const submission = await submissionService.updateStatus(String(req.params.id), req.body.status, req.body.output, req.body.problemId, req.body.userId);
        res.status(200).json({
            message: "Submission updated successfully",
            data: submission,
            success: true
        });
    }
}