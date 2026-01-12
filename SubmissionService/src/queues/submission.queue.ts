import { Queue, QueueEvents } from "bullmq";
import { createNewRedisConnection } from "../config/redis.config";
import logger from "../config/logger.config";

export const submissionQueue = new Queue("submission", {
    connection: createNewRedisConnection(),
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 2000
        }
    }
});

submissionQueue.on("error", (err) => {
    logger.error(`Submission queue error:`, err);
});

submissionQueue.on("waiting", (job) => {
    logger.error(`Submission job waiting:`, job.id);
});

export const submissionEvent = new QueueEvents("submission");

submissionEvent.on("completed", (job) => {
    logger.error(`Submission job completed:`, job.jobId);
});