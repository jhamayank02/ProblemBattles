import { ISubmission, ISubmissionData, Submission, SubmissionStatus } from "../models/submission.model";

export interface ISubmissionRepository {
    create(submissionData: Partial<ISubmission>): Promise<ISubmission>;
    findById(id: string): Promise<ISubmission | null>;
    findByProblemId(problemId: string): Promise<ISubmission[]>;
    findByUserId(userId: string): Promise<ISubmission[]>;
    findByUserAndProblemId(userId: string, problemId: string): Promise<ISubmission[]>;
    deleteById(id: string): Promise<boolean>;
    updateStatus(id: string, status: SubmissionStatus, submissionData: ISubmissionData): Promise<ISubmission | null>;
}

export class SubmissionRepository implements ISubmissionRepository {
    async create(submissionData: Partial<ISubmission>): Promise<ISubmission> {
        const newSubmission = await Submission.create(submissionData);
        return newSubmission;
    }
    async findById(id: string): Promise<ISubmission | null> {
        const submission = await Submission.findById(id);
        return submission;
    }
    async findByProblemId(problemId: string): Promise<ISubmission[]> {
        const submission = await Submission.find({ problemId });
        return submission;
    }
    async findByUserId(userId: string): Promise<ISubmission[]> {
        const submission = await Submission.find({ userId });
        return submission;
    }
    async findByUserAndProblemId(userId: string, problemId: string): Promise<ISubmission[]> {
        const submission = await Submission.find({ userId: userId, problemId: problemId }).sort({'createdAt': -1});
        return submission;
    }
    async deleteById(id: string): Promise<boolean> {
        const submission = await Submission.findByIdAndDelete(id);
        return submission != null;
    }
    async updateStatus(id: string, status: SubmissionStatus, submissionData: ISubmissionData): Promise<ISubmission | null> {
        const submission = await Submission.findByIdAndUpdate(id, { status, submissionData }, { new: true });
        return submission;
    }
}