import { Job, Worker } from "bullmq";
import { SUBMISSION_QUEUE } from "../utils/constants";
import logger from "../config/logger.config";
import { createNewRedisConnection } from "../config/redis.config";
import { EvaluationJob, EvaluationResult, TestCase } from "../interfaces/evaluation.interface";
import { runCode } from "../utils/containers/codeRunnner.util";
import { LANGUAGE_CONFIG } from "../config/language.config";
import { updateSubmission } from "../api/submission.api";

function matchTestCasesWithResults(testcases: TestCase[], results: EvaluationResult[]) {
    let output = "pending";
    console.log("____________",testcases, results)
    if (results.length !== testcases.length) {
        console.log("Results and testcases length mismatch");
        return "failed";
    }

    for (let i = 0; i < results.length; i++) {
        if (results[i].status === "time_limit_exceeded") {
            output = "time_limit_exceeded";
            break;
        }
        else if (results[i].status === "failed") {
            output = "runtime_exception";
            break;
        }
        else {
            if (results[i].output === testcases[i].output) {
                continue;
            }
            else {
                output = "wrong_answer";
                break;
            }
        }
    };

    if(output === "pending"){
        output = "correct_answer";
    }

    return output;
};

async function setupEvaluationWorker() {
    const worker = new Worker(SUBMISSION_QUEUE, async (job: Job) => {
        logger.info(`Processing job: ${job.id}`);
        const data: EvaluationJob = job.data;
        console.log("data", data);

        try {
            const testcasesRunnerPromise = data.problem.testcases.map(testcase => {
                return runCode({
                    code: data.code,
                    language: data.language,
                    timeout: LANGUAGE_CONFIG[data.language].timeout,
                    imageName: LANGUAGE_CONFIG[data.language].imageName,
                    input: testcase.input
                });
            });
            const testcasesRunnerPromiseResults = await Promise.all(testcasesRunnerPromise);
            console.log("testcasesRunnerPromiseResult", testcasesRunnerPromiseResults);
            const output = matchTestCasesWithResults(data.problem.testcases, testcasesRunnerPromiseResults);
            await updateSubmission(data.submissionId, output, data.userId, data.problem.id);
        } catch (error) {
            logger.error(`Evaluation job failed: ${job.id}`, error);
            await updateSubmission(data.submissionId, "failed", data.userId, data.problem.id)
            return;
        }
    }, {
        connection: createNewRedisConnection()
    });

    worker.on("error", (error) => {
        logger.error(`Evaluation worker error: ${error.message}`);
    });

    worker.on("completed", (job) => {
        logger.error(`Evaluation job completed: ${job.id}`);
    });

    worker.on("failed", (job, error) => {
        console.log(job, error)
        logger.error(`Evaluation job failed: ${job?.id} ${error.message}`);
    });
}

export async function startWorkers() {
    await setupEvaluationWorker();
}