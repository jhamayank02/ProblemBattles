import express from 'express';
import { vaidateRequestParams, validateRequestBody } from '../../validators';
import {
  createProblemSchema,
  findByCompanySchema,
  findByDifficultySchema,
  updateProblemSchema,
} from '../../validators/problem.validator';
import { problemController } from '../../controllers/problem.controller';

const problemRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Problem
 *   description: Problem management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Problem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "674f93c0d65db7b9b26c8f9e"
 *         title:
 *           type: string
 *           example: "Two Sum"
 *         description:
 *           type: string
 *           example: "Find two numbers in an array that add up to a target."
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *           example: "easy"
 *         editorial:
 *           type: string
 *           example: "Use a hash map for O(n) solution."
 *         testcases:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               input:
 *                 type: string
 *                 example: "[2,7,11,15], target=9"
 *               output:
 *                 type: string
 *                 example: "[0,1]"
 *         company:
 *           type: array
 *           items:
 *             type: string
 *           example: ["675aefb9148dd7be0a1f2c4f"]
 *     ProblemUpdateInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Updated Problem Title"
 *         description:
 *           type: string
 *           example: "Updated problem description"
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *         editorial:
 *           type: string
 *           example: "Updated editorial content"
 *         testcases:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               input:
 *                 type: string
 *               output:
 *                 type: string
 *         company:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/v1/problem:
 *   post:
 *     summary: Create a new problem
 *     description: Creates a new problem entry
 *     tags: [Problem]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProblemDto'
 *     responses:
 *       201:
 *         description: Problem created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Problem created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Problem'
 *                 success:
 *                   type: boolean
 *                   example: true
 */
problemRouter.post('/', validateRequestBody(createProblemSchema), problemController.createProblem);

/**
 * @swagger
 * /api/v1/problem:
 *   get:
 *     summary: Get all problems
 *     tags: [Problem]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of problems to return per page
 *         example: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for paginated results
 *         example: 1
 *     responses:
 *       200:
 *         description: List of all problems
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Problem'
 *                 success:
 *                   type: boolean
 *                   example: true
 */
problemRouter.get('/', problemController.getAllProblems);

/**
 * @swagger
 * /api/v1/problem/difficulty/{difficulty}:
 *   get:
 *     summary: Get problems by difficulty
 *     tags: [Problem]
 *     parameters:
 *       - in: path
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *         required: true
 *         description: Difficulty level
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of problems to return per page
 *         example: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for paginated results
 *         example: 1
 *     responses:
 *       200:
 *         description: Problems filtered by difficulty
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Problem'
 *                 success:
 *                   type: boolean
 *                   example: true
 */
problemRouter.get('/difficulty/:difficulty', vaidateRequestParams(findByDifficultySchema), problemController.findByDifficulty);

/**
 * @swagger
 * /api/v1/problem/company/{company}:
 *   get:
 *     summary: Get problems by company
 *     tags: [Problem]
 *     parameters:
 *       - in: path
 *         name: company
 *         schema:
 *           type: string
 *         required: true
 *         description: Company ID
  *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of problems to return per page
 *         example: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for paginated results
 *         example: 1
 *     responses:
 *       200:
 *         description: Problems filtered by company
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Problem'
 *                 success:
 *                   type: boolean
 *                   example: true
 */
problemRouter.get('/company/:company', vaidateRequestParams(findByCompanySchema), problemController.findByCompany);

/**
 * @swagger
 * /api/v1/problem/search:
 *   get:
 *     summary: Search problems
 *     tags: [Problem]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *           example: Binary tree
 *         required: false
 *         description: Search keyword (in title or description)
  *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of problems to return per page
 *         example: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for paginated results
 *         example: 1
 *     responses:
 *       200:
 *         description: Matching problems
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Problem'
 *                 success:
 *                   type: boolean
 *                   example: true
 */
problemRouter.get('/search', problemController.searchProblems);

/**
 * @swagger
 * /api/v1/problem/{id}:
 *   get:
 *     summary: Get problem by ID
 *     tags: [Problem]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Problem ID
 *     responses:
 *       200:
 *         description: Problem details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Problem'
 *                 success:
 *                   type: boolean
 *                   example: true
 */
problemRouter.get('/:id', problemController.getProblemById);

/**
 * @swagger
 * /api/v1/problem/{id}:
 *   put:
 *     summary: Update a problem
 *     tags: [Problem]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Problem ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProblemDto'
 *     responses:
 *       200:
 *         description: Problem updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Problem updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Problem'
 *                 success:
 *                   type: boolean
 *                   example: true
 */
problemRouter.put('/:id', validateRequestBody(updateProblemSchema), problemController.updateProblem);

/**
 * @swagger
 * /api/v1/problem/{id}:
 *   delete:
 *     summary: Delete a problem
 *     tags: [Problem]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Problem ID
 *     responses:
 *       200:
 *         description: Problem deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Problem deleted successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Problem'
 *                 success:
 *                   type: boolean
 *                   example: true
 */
problemRouter.delete('/:id', problemController.deleteProblem);

export default problemRouter;
