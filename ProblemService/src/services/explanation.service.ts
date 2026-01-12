import { IExplanation } from "../models/explanation.model";
import { IExplanationRepository } from "../repositories/explanation.repository";
import { IProblemRepository } from "../repositories/problem.repository";
import { InternalServerError, NotFoundError } from "../utils/errors/app.error";

interface IExplanationService {
    create(data: Partial<IExplanation>): Promise<IExplanation>;
    update(id: string, data: Partial<IExplanation>): Promise<IExplanation | null>;
    getById(id: string): Promise<IExplanation | null>;
    getByProblemId(id: string): Promise<IExplanation | null>;
}

export class ExplanationService implements IExplanationService {
    private ExplanationRepository: IExplanationRepository;
    private ProblemRepository: IProblemRepository;

    constructor(ExplanationRepository: IExplanationRepository, ProblemRepository: IProblemRepository) {
        this.ExplanationRepository = ExplanationRepository;
        this.ProblemRepository = ProblemRepository;
    }

    async create(data: Partial<IExplanation>): Promise<IExplanation> {
        const problem = await this.ProblemRepository.getProblemById(data.problemId);
        if (!problem) {
            throw new NotFoundError('Problem not found');
        }
        const explanation = await this.ExplanationRepository.create(data);
        if (!explanation) {
            throw new InternalServerError('Something went wrong, please try again later');
        }
        return explanation;
    }
    async update(id: string, data: Partial<IExplanation>): Promise<IExplanation | null> {
        const explanation = await this.ExplanationRepository.update(id, data);
        if (!explanation) {
            throw new NotFoundError('Explanation not found');
        }
        return explanation;
    }
    async getById(id: string): Promise<IExplanation | null> {
        const explanation = await this.ExplanationRepository.getById(id);
        if (!explanation) {
            throw new NotFoundError('Explanation not found');
        }
        return explanation;
    }
    async getByProblemId(id: string): Promise<IExplanation | null> {
        const explanation = await this.ExplanationRepository.getByProblemId(id);
        return explanation;
    }
} 