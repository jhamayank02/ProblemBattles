import { Request, Response } from "express";
import { CompanyRepository } from "../repositories/company.repository";
import { CompanyService } from "../services/company.service";
import { BadRequestError } from "../utils/errors/app.error";

const companyRepository = new CompanyRepository();
const companyService = new CompanyService(companyRepository);

export const companyController = {
    async createCompany(req: Request, res: Response): Promise<void> {
        const company = await companyService.createCompany(req.body);
        res.status(201).json({
            message: "Company created successfully",
            data: company,
            success: true
        });
    },

    async getCompanyById(req: Request, res: Response): Promise<void> {
        const problem = await companyService.getCompanyById(String(req.params.id));
        res.status(200).json({
            message: "Company fetched successfully",
            data: problem,
            success: true
        });
    },

    async getAllCompanies(req: Request, res: Response): Promise<void> {
        let { limit, page } = req.query;

        const parsedLimit = Number(limit);
        const parsedPage = Number(page);

        if (limit && isNaN(parsedLimit)) {
            throw new BadRequestError("Invalid limit value");
        }
        if (page && isNaN(parsedPage)) {
            throw new BadRequestError("Invalid page value");
        }

        const finalLimit = parsedLimit || 10;
        const finalPage = parsedPage || 1;

        const skip = (finalPage - 1) * finalLimit;

        const companies = await companyService.getAllCompanies(skip, finalLimit);
        res.status(200).json({
            message: "Companies fetched successfully",
            data: companies,
            success: true
        });
    },

    async updateCompany(req: Request, res: Response): Promise<void> {
        const problem = await companyService.updateCompany(String(req.params.id), req.body);
        res.status(200).json({
            message: "Company updated successfully",
            data: problem,
            success: true
        });
    },

    async deleteCompany(req: Request, res: Response): Promise<void> {
        const problem = await companyService.deleteCompany(String(req.params.id));
        res.status(200).json({
            message: "Company deleted successfully",
            data: problem,
            success: true
        });
    },

    async searchCompany(req: Request, res: Response): Promise<void> {
        let { limit, page } = req.query;

        const parsedLimit = Number(limit);
        const parsedPage = Number(page);

        if (limit && isNaN(parsedLimit)) {
            throw new BadRequestError("Invalid limit value");
        }
        if (page && isNaN(parsedPage)) {
            throw new BadRequestError("Invalid page value");
        }

        const finalLimit = parsedLimit || 10;
        const finalPage = parsedPage || 1;

        const skip = (finalPage - 1) * finalLimit;

        const problem = await companyService.searchcompanies(req.query.query as string, skip, finalLimit);
        res.status(200).json({
            message: "Companies fetched successfully",
            data: problem,
            success: true
        });
    }
}