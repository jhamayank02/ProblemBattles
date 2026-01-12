import { Explanation, IExplanation } from "../models/explanation.model";

export interface IExplanationRepository {
    create(data: Partial<IExplanation>): Promise<IExplanation>;
    update(id: string, data: Partial<IExplanation>): Promise<IExplanation | null>;
    getById(id: string): Promise<IExplanation | null>;
    getByProblemId(id: string): Promise<IExplanation | null>;
}

export class ExplanationRepository implements IExplanationRepository {
    async create(data: Partial<IExplanation>): Promise<IExplanation> {
        return await Explanation.create(data);
    }
    async update(id: string, data: Partial<IExplanation>): Promise<IExplanation | null> {
        return await Explanation.findByIdAndUpdate(id, data, { new: true });
    }
    async getById(id: string): Promise<IExplanation | null> {
        return await Explanation.findById(id)
    }
    async getByProblemId(id: string): Promise<IExplanation | null> {
        return await Explanation.findOne({ problemId: id })
    }
};