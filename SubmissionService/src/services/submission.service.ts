import { getProblemById } from "../apis/problem.api";
import logger from "../config/logger.config";
import { ISubmission, ISubmissionData, SubmissionLanguage, SubmissionStatus } from "../models/submission.model";
import { publishEvaluatedJob } from "../producers/evaluated.producer";
import { addSubmissionJob } from "../producers/submission.producer";
import { ISubmissionRepository } from "../repositories/submission.repository";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";

export interface ISubmissionService {
    create(submissionData: Partial<ISubmission>, userId: string): Promise<ISubmission>;
    findById(id: string): Promise<ISubmission | null>;
    findByProblemId(problemId: string): Promise<ISubmission[]>;
    findByUserId(userId: string): Promise<ISubmission[]>;
    findByUserAndProblemId(userId: string, problemId: string): Promise<ISubmission[]>;
    deleteById(id: string): Promise<boolean>;
    updateStatus(id: string, status: SubmissionStatus, submissionData: ISubmissionData, problemId: string, userId: string): Promise<ISubmission | null>;
}

export class SubmissionService implements ISubmissionService {
    private submissionRepository: ISubmissionRepository;

    constructor(submissionRepository: ISubmissionRepository) {
        this.submissionRepository = submissionRepository;
    }

    async create(submissionData: Partial<ISubmission>, userId: string): Promise<ISubmission> {
        // Check if problem exists
        if (!submissionData.problemId) {
            throw new BadRequestError("Problem ID is required");
        }
        const problem = await getProblemById(submissionData.problemId);
        if (!problem) {
            throw new NotFoundError("Problem not found or something went wrong");
        }

        // Add the submission payload to db
        const submission: any = await this.submissionRepository.create({...submissionData, userId});

        // Add submission to redis queue
        // TODO - Store job id in submission collection to track the job
        const jobId = await addSubmissionJob({
            submissionId: submission.id,
            problem,
            userId,
            code: buildFinalCode(problem.driver_code, submissionData.code as string),
            language: submissionData.language as SubmissionLanguage
        });
        logger.info(`${jobId} added to evaluate-submission event`);

        return submission;
    }

    async findById(id: string): Promise<ISubmission | null> {
        const submission = await this.submissionRepository.findById(id);
        if (!submission) {
            throw new NotFoundError("Submission not found");
        }
        return submission;
    }

    async findByProblemId(problemId: string): Promise<ISubmission[]> {
        const submissions = await this.submissionRepository.findByProblemId(problemId);
        return submissions;
    }

    async findByUserId(userId: string): Promise<ISubmission[]> {
        const submissions = await this.submissionRepository.findByUserId(userId);
        return submissions;
    }

    async findByUserAndProblemId(userId: string, problemId: string): Promise<ISubmission[]> {
        const submissions = await this.submissionRepository.findByUserAndProblemId(userId, problemId);
        return submissions;
    }

    async deleteById(id: string): Promise<boolean> {
        const submission = await this.submissionRepository.deleteById(id);
        if (!submission) {
            throw new NotFoundError("Submission not found");
        }
        return submission;
    }

    async updateStatus(id: string, status: SubmissionStatus, submissionData: ISubmissionData, problemId: string, userId: string): Promise<ISubmission | null> {
        const submission = await this.submissionRepository.updateStatus(id, status, submissionData);
        if (!submission) {
            throw new NotFoundError("Submission not found");
        }
        publishEvaluatedJob({
            status: status,
            submissionId: submission.id as string,
            problemId: problemId,
            userId: userId
        });
        return submission;
    }
}

function buildFinalCode(driverCode: string, userCode: string): string {
    return driverCode.replace(
        /\/\/ @@USERCODE@@/,
        userCode.trim()
    );
}