import express from 'express';
import { explanationControllers } from '../../controllers/explanation.controller';
import { vaidateRequestParams } from '../../validators';
import { findByProblemIdSchemaa } from '../../validators/explanation.validator';

const explanationRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Explanation
 *   description: Explanation management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Explanation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "674f93c0d65db7b9b26c8f9e"
 *         explanation:
 *           type: string
 *           example: "Two Sum"
 *         createdAt:
 *           type: date-time
 *           example: "2025-10-16T06:19:26.083+00:00"
 *         updatedAt:
 *           type: date-time
 *           example: "2025-10-16T06:19:26.083+00:00"
 */

/**
 * @swagger
 * /api/v1/explanation/{problemId}:
 *   get:
 *     summary: Get explanation by problem ID
 *     description: Retrieve a problem's explanation by problem ID
 *     tags: [Explanation]
 *     parameters:
 *       - in: path
 *         name: problemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Problem ID
 *     responses:
 *       200:
 *         description: Expanation details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Explanation'
 *                 success:
 *                   type: boolean
 *                   example: true
 */
explanationRouter.get('/:problemId', vaidateRequestParams(findByProblemIdSchemaa), explanationControllers.getExplanationByProblemId);

export default explanationRouter;