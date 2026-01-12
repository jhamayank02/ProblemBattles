import { InternalServerError } from "../errors/app.error";
import { commands } from "./commands.util";
import { createNewDockerContainer } from "./createContainer.util";

export interface RunCodeOptions {
    code: string,
    // language: "python" | "cpp" | "java" | "javascript",
    language: "python" | "cpp",
    timeout: number,
    imageName: string,
    input: string
}

const allowedLanguages = ["python", "cpp", "java", "javascript"];

export async function runCode(options: RunCodeOptions) {
    const { code, language, timeout, imageName, input } = options;

    if (!allowedLanguages.includes(language)) {
        throw new InternalServerError(`Invalid language: ${language}`);
    }

    // Take the python code and dump in a file and run the python file in the container
    const container = await createNewDockerContainer({
        imageName: imageName,
        cmdExecutable: commands[language](code, input),
        memoryLimit: 1024 * 1024 * 1024 * 1 // 1gb
    });

    let isTimeLimitExceeded = false;
    const timeLimitExceededTimeout = setTimeout(async () => {
        console.log("Time limit exceeded");
        isTimeLimitExceeded = true;
        // await container?.kill();
    }, timeout);

    // Start the container
    await container?.start();

    if (isTimeLimitExceeded) {
        await container?.remove();
        return {
            status: "time_limit_exceeded",
            output: "Time limit exceeded"
        }
    }

    const status = await container?.wait();
    console.log("Container status", status);

    const logs = await container?.logs({
        stdout: true,
        stderr: true
    });
    console.log("Container logs", logs?.toString());

    const sampleOutput = "36";
    const logsString = processLogs(logs);

    console.log("Is matching", sampleOutput === logsString)

    await container?.remove();
    if (status?.StatusCode === 0) {
        clearTimeout(timeLimitExceededTimeout);
        console.log("Container exited successfully");
        return {
            status: "success",
            output: logsString
        }
    } else {
        clearTimeout(timeLimitExceededTimeout);
        console.log("Container exited with error");
        return {
            status: "failed",
            output: logsString
        }
    }
}

function processLogs(logs: Buffer | undefined) {
    return logs?.toString('utf8')
        .replace(/\x00/g, '') // Remove null bytes
        .replace(/[\x00-\x09\x0B-\x1F\x7F-\x9F]/g, '') // Remove control characters except \n (0x0A)
        .trim();
}