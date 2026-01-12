import logger from "../config/logger.config";
import { redis } from "../config/redis.config";

export interface IEvaluatedJob {
    submissionId: string;
    userId: string;
    problemId: string;
    status: string;
}

export async function publishEvaluatedJob(data: IEvaluatedJob): Promise<string | null> {
    try {
        const result = await redis.publish("evaluated", JSON.stringify(data));
        logger.info(`Evaluated job published: ${result}`);
        return data.submissionId;
    } catch (error) {
        logger.error(`Failed to publis evaluated job: ${error}`);
        return null;
    }
}