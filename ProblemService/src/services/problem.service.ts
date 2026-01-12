import { CreateProblemDto, UpdateProblemDto } from "../validators/problem.validator";
import { IProblem } from "../models/problem.model";
import { IProblemRepository } from "../repositories/problem.repository";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { sanitizeMarkdown } from "../utils/markdown.sanitizer";
import { Company } from "../models/company.model";

export interface IProblemService {
    createProblem(problem: CreateProblemDto): Promise<IProblem>;
    getProblemById(id: string): Promise<IProblem | null>;
    getAllProblems(skip: number, limit: number): Promise<{ problems: IProblem[], total: number }>;
    updateProblem(id: string, updateData: UpdateProblemDto): Promise<IProblem | null>;
    deleteProblem(id: string): Promise<boolean>;
    findByDifficulty(difficulty: "easy" | "medium" | "hard", skip: number, limit: number): Promise<{ problems: IProblem[], total: number }>;
    findByCompany(companyId: string, skip: number, limit: number): Promise<{ problems: IProblem[], total: number }>;
    searchProblems(query: string, skip: number, limit: number): Promise<{ problems: IProblem[], total: number }>;
}

export class ProblemService implements IProblemService {
    private problemRepository: IProblemRepository;

    // Constructor based dependency injection
    constructor(problemRepository: IProblemRepository) {
        this.problemRepository = problemRepository;
    }

    async createProblem(problem: CreateProblemDto): Promise<IProblem> {

        if (problem.company) {
            const companyIds = problem.company;

            const existingCompanies = await Company.find({ _id: { $in: companyIds } });

            if (existingCompanies.length !== companyIds.length) {
                const missingIds = companyIds.filter(
                    id => !existingCompanies.some(c => c.id.equals(id))
                );
                throw new NotFoundError(`Companies not found: ${missingIds.join(", ")}`);
            }
        }

        if(!problem.driver_code.includes('// @@USERCODE@@')){
            throw new BadRequestError("Driver code placeholder not found");
        }

        const sanitizedPayload: any = {
            ...problem,
            description: problem.description && await sanitizeMarkdown(problem.description),
            editorial: problem.editorial && await sanitizeMarkdown(problem.editorial),
            stub: problem.stub && await sanitizeMarkdown(problem.stub),
            driver_code: problem.driver_code && await sanitizeMarkdown(problem.driver_code),
        }
        return await this.problemRepository.createProblem(sanitizedPayload);
    }

    async getProblemById(id: string): Promise<IProblem | null> {
        const problem = await this.problemRepository.getProblemById(id);
        if (!problem) {
            throw new NotFoundError("Problem not found");
        }
        return problem;
    }

    async getAllProblems(skip: number, limit: number): Promise<{ problems: IProblem[], total: number }> {
        return await this.problemRepository.getAllProblems(skip, limit);
    }

    async updateProblem(id: string, updateData: UpdateProblemDto): Promise<IProblem | null> {
        const problem = await this.getProblemById(id);
        if (!problem) {
            throw new NotFoundError("Problem not found");
        }
        if (problem.company) {
            const companyIds = problem.company;

            const existingCompanies = await Company.find({ _id: { $in: companyIds } });

            if (existingCompanies.length !== companyIds.length) {
                const missingIds = companyIds.filter(
                    id => !existingCompanies.some(c => c.id.equals(id))
                );
                throw new NotFoundError(`Companies not found: ${missingIds.join(", ")}`);
            }
        }
        
        
        const sanitizedPayload: any = {
            ...updateData
        }
        if (updateData.description) {
            sanitizedPayload.description = await sanitizeMarkdown(updateData.description);
        }
        if (updateData.editorial) {
            sanitizedPayload.editorial = await sanitizeMarkdown(updateData.editorial);
        }
        if (updateData.stub) {
            // sanitizedPayload.stub = await sanitizeMarkdown(updateData.stub);
            sanitizedPayload.stub = updateData.stub;
        }
        if(updateData.driver_code && !updateData.driver_code.includes('// @@USERCODE@@')){
            throw new BadRequestError("Driver code placeholder not found");
        }
        else if(updateData.driver_code) {
            // sanitizedPayload.driver_code = await sanitizeMarkdown(updateData.driver_code);
            sanitizedPayload.driver_code = updateData.driver_code;
        }
        return await this.problemRepository.updateProblem(id, sanitizedPayload);
    }

    async deleteProblem(id: string): Promise<boolean> {
        const problem = await this.getProblemById(id);
        if (!problem) {
            throw new NotFoundError("Problem not found");
        }
        return await this.problemRepository.deleteProblem(id);
    }

    async findByDifficulty(difficulty: "easy" | "medium" | "hard", skip: number, limit: number): Promise<{ problems: IProblem[], total: number }> {
        return await this.problemRepository.findByDifficulty(difficulty, skip, limit);
    }

    async findByCompany(companyId: string, skip: number, limit: number): Promise<{ problems: IProblem[], total: number }> {
        return await this.problemRepository.findByCompany(companyId, skip, limit);
    }

    async searchProblems(query: string, skip: number, limit: number): Promise<{ problems: IProblem[], total: number }> {
        if (!query || query.trim() === "") {
            throw new BadRequestError("Query is required");
        }
        return await this.problemRepository.searchProblems(query, skip, limit);
    }
}