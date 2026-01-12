import express from 'express';
import { serverConfig } from './config';
import v1Router from './routers/v1/index.router';
import { appErrorHandler, genericErrorHandler } from './middlewares/error.middleware';
import logger from './config/logger.config';
import { attachCorrelationIdMiddleware } from './middlewares/correlation.middleware';
import { connectDB } from './config/db.config';
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import path from 'path';

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "LeetCode Clone Problem Service API",
            version: "1.0.0",
            description: "API documentation for the microservices-based LeetCode clone problem service",
        },
        servers: [
            {
                url: `http://localhost:${serverConfig.PORT}/api`,
                description: "Local development server",
            },
        ],
    },
    apis: [path.resolve(__dirname, "./routers/v1/*.ts")], // files to scan for annotations
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

/**
 * Registering all the routers and their corresponding routes with out app server object.
 */

app.use(attachCorrelationIdMiddleware);
app.use('/api/v1', v1Router);


/**
 * Add the error handler middleware
 */

app.use(appErrorHandler);
app.use(genericErrorHandler);


app.listen(serverConfig.PORT, async () => {
    logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
    logger.info(`Press Ctrl+C to stop the server.`);

    await connectDB();
});
