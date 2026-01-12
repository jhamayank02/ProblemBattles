import { IProblem, Problem } from "../models/problem.model";

export interface IProblemRepository {
    createProblem(problem: Partial<IProblem>): Promise<IProblem>;
    getProblemById(id: string): Promise<IProblem | null>;
    getAllProblems(skip: number, limit: number): Promise<{ problems: IProblem[], total: number }>;
    updateProblem(id: string, updateData: Partial<IProblem>): Promise<IProblem | null>;
    deleteProblem(id: string): Promise<boolean>;
    findByDifficulty(difficulty: "easy" | "medium" | "hard", skip: number, limit: number): Promise<{ problems: IProblem[], total: number }>;
    findByCompany(companyId: string, skip: number, limit: number): Promise<{ problems: IProblem[], total: number }>;
    searchProblems(query: string, skip: number, limit: number): Promise<{ problems: IProblem[], total: number }>;
}

export class ProblemRepository implements IProblemRepository {
    async createProblem(problem: Partial<IProblem>): Promise<IProblem> {
        const newProblem = new Problem(problem);
        return await newProblem.save();
    };
    async getProblemById(id: string): Promise<IProblem | null> {
        return await Problem.findById(id).populate("company");
    };
    async getAllProblems(skip: number, limit: number): Promise<{ problems: IProblem[], total: number }> {
        const problems = await Problem.find().populate("company").skip(skip).limit(limit).sort({ createdAt: -1 });
        const total = await Problem.find().countDocuments();
        return {
            problems, total
        };
    };
    async updateProblem(id: string, updateData: Partial<IProblem>): Promise<IProblem | null> {
        return await Problem.findByIdAndUpdate(id, updateData, { new: true });
    };
    async deleteProblem(id: string): Promise<boolean> {
        const result = await Problem.findByIdAndDelete(id);
        return result !== null;
    };
    async findByDifficulty(difficulty: "easy" | "medium" | "hard", skip: number, limit: number): Promise<{ problems: IProblem[], total: number }> {
        const problems = await Problem.find({ difficulty }).skip(skip).limit(limit).populate("company").sort({ createdAt: -1 });
        const total = await Problem.find().countDocuments();
        return {
            problems, total
        };
    };
    async findByCompany(companyId: string, skip: number, limit: number): Promise<{ problems: IProblem[], total: number }> {
        const problems = await Problem.find({ company: companyId }).skip(skip).limit(limit).populate("company").sort({ createdAt: -1 });
        const total = await Problem.find().countDocuments();
        return {
            problems, total
        };
    };
    async searchProblems(query: string, skip: number, limit: number): Promise<{ problems: IProblem[], total: number }> {
        const regex = new RegExp(query, "i");
        const problems = await Problem.find({ $or: [{ title: regex }, { difficulty: regex }] }).skip(skip).limit(limit).populate("company").sort({ createdAt: -1 });
        const total = await Problem.find().countDocuments();
        return {
            problems, total
        };
    };
}