import axios from "axios";
import { serverConfig } from "../config";
import { InternalServerError } from "../utils/errors/app.error";
import logger from "../config/logger.config";

export async function updateSubmission(submissionId: string, status: string, userId: string, problemId: string) {
    try {
        // TODO: Improve the axios api error handling
        console.log("sent", {
            status,
            userId,
            problemId,
            submissionId
        })
        const response = await axios.put(`${serverConfig.SUBMISSION_SERVICE}/submission/${submissionId}`, {
            status,
            userId,
            problemId,
            submissionId
        });
        if (response.status !== 200) {
            throw new InternalServerError("Failed to update submission");
        }
        console.log("Submission updated successfully", response.data);
        return
    } catch (error) {
        logger.error(`Failed to update submission status: ${error}`);
        return null;
    }
}