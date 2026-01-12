import { Request, Response } from "express";
import { ExplanationRepository } from "../repositories/explanation.repository";
import { ProblemRepository } from "../repositories/problem.repository";
import { ExplanationService } from "../services/explanation.service";
import { generateExplanation } from "../services/openai.service";
import { InternalServerError, NotFoundError } from "../utils/errors/app.error";
import { ProblemService } from "../services/problem.service";

const explanationRepository = new ExplanationRepository();
const problemRepository = new ProblemRepository();
const problemService = new ProblemService(problemRepository);
const explanationService = new ExplanationService(explanationRepository, problemRepository);

export const explanationControllers = {
    async getExplanationByProblemId(req: Request, res: Response): Promise<void> {
        const problem = await problemService.getProblemById(String(req.params.problemId));
        if (!problem) {
            throw new NotFoundError('Problem not found');
        }

        let explanation = await explanationService.getByProblemId(problem.id);
        if (explanation && explanation.updatedAt.getTime() < problem.updatedAt.getTime()) {
            // If explanation's updatedAt is older than problem's updatedAt then generate new explanation else return old one
            const generatedExplanation = await generateExplanation(`
                Name: ${problem.title}
                Description: ${problem.description}
                `);
            if (generatedExplanation) {
                explanation = await explanationService.update(explanation.id, { explanation: generatedExplanation });
            }
        }
        else if(!explanation) {
            // Generate explanation
            const generatedExplanation = await generateExplanation(`
                Name: ${problem.title}
                Description: ${problem.description}
            `);
            if (!generatedExplanation) {
                throw new InternalServerError('Something went wrong, please try again later');
            }
            explanation = await explanationService.create({
                problemId: problem.id,
                explanation: generatedExplanation
            });
        }

        res.status(200).json({
            success: true,
            data: explanation,
            message: "Explanation fetched successfully"
        })
    },
}