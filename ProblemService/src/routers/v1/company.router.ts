import express from "express";
import { validateRequestBody } from "../../validators";
import { companyController } from "../../controllers/company.controller";
import { createCompanySchema, updateCompanySchema } from "../../validators/company.validator";

const companyRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Company
 *   description: Company management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "12345"
 *         name:
 *           type: string
 *           example: "Google"
 *         image_url:
 *           type: string
 *           example: "https://example.com/logo.png"
 *
 *     CreateCompanyRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Google
 *         image_url:
 *           type: string
 *           example: "https://example.com/logo.png"
 *
 *     UpdateCompanyRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Google Inc.
 *         image_url:
 *           type: string
 *           example: "https://example.com/new-logo.png"
 *
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Operation successful"
 *         success:
 *           type: boolean
 *           example: true
 *
 *     CompanyResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/Company'
 *
 *     CompanyListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 */

/**
 * @swagger
 * /api/v1/company:
 *   post:
 *     summary: Create a company
 *     description: Creates a new company entry
 *     tags: [Company]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCompanyRequest'
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyResponse'
 */
companyRouter.post("/", validateRequestBody(createCompanySchema), companyController.createCompany);

/**
 * @swagger
 * /api/v1/company:
 *   get:
 *     summary: Get all companies
 *     description: Retrieve all registered companies
 *     tags: [Company]
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
 *         description: Companies fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyListResponse'
 */
companyRouter.get("/", companyController.getAllCompanies);

/**
 * @swagger
 * /api/v1/company/search:
 *   get:
 *     summary: Search companies
 *     description: Search companies by name or partial match
 *     tags: [Company]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *         description: Company name to search for
 *         example: Google
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
 *         description: Companies fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyListResponse'
 */
companyRouter.get("/search", companyController.searchCompany);

/**
 * @swagger
 * /api/v1/company/{id}:
 *   get:
 *     summary: Get company by ID
 *     description: Retrieve a company by its ID
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyResponse'
 */
companyRouter.get("/:id", companyController.getCompanyById);

/**
 * @swagger
 * /api/v1/company/{id}:
 *   put:
 *     summary: Update company by ID
 *     description: Updates a company's details
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCompanyRequest'
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyResponse'
 */
companyRouter.put("/:id", validateRequestBody(updateCompanySchema), companyController.updateCompany);

/**
 * @swagger
 * /api/v1/company/{id}:
 *   delete:
 *     summary: Delete company by ID
 *     description: Permanently deletes a company record
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
companyRouter.delete("/:id", companyController.deleteCompany);

export default companyRouter;
