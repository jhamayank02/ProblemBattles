import { Request, Response } from "express";
import { ProblemService } from "../services/problem.service";
import { ProblemRepository } from "../repositories/problem.repository";
import { BadRequestError } from "../utils/errors/app.error";

const problemRepository = new ProblemRepository();
const problemService = new ProblemService(problemRepository);

export const problemController = {

    async createProblem(req: Request, res: Response): Promise<void> {
        const problem = await problemService.createProblem(req.body);
        res.status(201).json({
            message: "Problem created successfully",
            data: problem,
            success: true
        });
    },

    async getProblemById(req: Request, res: Response): Promise<void> {
        const problem = await problemService.getProblemById(String(req.params.id));
        res.status(200).json({
            message: "Problem fetched successfully",
            data: problem,
            success: true
        });
    },

    async getAllProblems(req: Request, res: Response): Promise<void> {
        let { limit, page } = req.query;

        const parsedLimit = Number(limit);
        const parsedPage = Number(page);

        if (limit && isNaN(parsedLimit)) {
            throw new BadRequestError("Invalid limit value");
        }
        if (page && isNaN(parsedPage)) {
            throw new BadRequestError("Invalid page value");
        }

        const finalLimit = parsedLimit || 10;
        const finalPage = parsedPage || 1;

        const skip = (finalPage - 1) * finalLimit;

        const problem = await problemService.getAllProblems(skip, finalLimit);
        res.status(200).json({
            message: "Problems fetched successfully",
            data: problem,
            success: true
        });
    },

    async updateProblem(req: Request, res: Response): Promise<void> {
        const problem = await problemService.updateProblem(String(req.params.id), req.body);
        res.status(200).json({
            message: "Problem updated successfully",
            data: problem,
            success: true
        });
    },

    async deleteProblem(req: Request, res: Response): Promise<void> {
        const problem = await problemService.deleteProblem(String(req.params.id));
        res.status(200).json({
            message: "Problem deleted successfully",
            data: problem,
            success: true
        });
    },

    async findByDifficulty(req: Request, res: Response): Promise<void> {
        const difficulty = req.params.difficulty as "easy" | "medium" | "hard";
        console.log(difficulty)
        let { limit, page } = req.query;

        const parsedLimit = Number(limit);
        const parsedPage = Number(page);

        if (limit && isNaN(parsedLimit)) {
            throw new BadRequestError("Invalid limit value");
        }
        if (page && isNaN(parsedPage)) {
            throw new BadRequestError("Invalid page value");
        }

        const finalLimit = parsedLimit || 10;
        const finalPage = parsedPage || 1;

        const skip = (finalPage - 1) * finalLimit;

        const problem = await problemService.findByDifficulty(difficulty, skip, finalLimit);
        res.status(200).json({
            message: "Problems fetched successfully",
            data: problem,
            success: true
        });
    },

    async findByCompany(req: Request, res: Response): Promise<void> {
        const companyId = String(req.params.company_id);
        let { limit, page } = req.query;

        const parsedLimit = Number(limit);
        const parsedPage = Number(page);

        if (limit && isNaN(parsedLimit)) {
            throw new BadRequestError("Invalid limit value");
        }
        if (page && isNaN(parsedPage)) {
            throw new BadRequestError("Invalid page value");
        }

        const finalLimit = parsedLimit || 10;
        const finalPage = parsedPage || 1;

        const skip = (finalPage - 1) * finalLimit;

        const problem = await problemService.findByCompany(companyId, skip, finalLimit);
        res.status(200).json({
            message: "Problems fetched successfully",
            data: problem,
            success: true
        });
    },

    async searchProblems(req: Request, res: Response): Promise<void> {
        let { limit, page } = req.query;
        
        const parsedLimit = Number(limit);
        const parsedPage = Number(page);
        
        if (limit && isNaN(parsedLimit)) {
            throw new BadRequestError("Invalid limit value");
        }
        if (page && isNaN(parsedPage)) {
            throw new BadRequestError("Invalid page value");
        }
        
        const finalLimit = parsedLimit || 10;
        const finalPage = parsedPage || 1;
        
        const skip = (finalPage - 1) * finalLimit;
        const problem = await problemService.searchProblems(req.query.query as string, skip, finalLimit);

        res.status(200).json({
            message: "Problems fetched successfully",
            data: problem,
            success: true
        });
    }
}