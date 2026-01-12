// This file contains all the basic configuration logic for the app server to work
import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number;
    SUBMISSION_SERVICE: string;
    PROBLEM_SERVICE: string;
}

function loadEnv() {
    dotenv.config();
    console.log(`Environment variables loaded`);
}

loadEnv();

export const serverConfig: ServerConfig = {
    PORT: Number(process.env.PORT) || 3001,
    SUBMISSION_SERVICE: process.env.SUBMISSION_SERVICE || "http://localhost:3002/api/v1",
    PROBLEM_SERVICE: process.env.PROBLEM_SERVICE || "http://localhost:3000/api/v1",
};