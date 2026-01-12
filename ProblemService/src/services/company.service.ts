import { ICompany } from "../models/company.model";
import { ICompanyRepository } from "../repositories/company.repository";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { CreateCompanyDto, UpdateCompanyDto } from "../validators/company.validator";

export interface ICompanyService {
    createCompany(company: CreateCompanyDto): Promise<ICompany>;
    getCompanyById(id: string): Promise<ICompany | null>;
    getAllCompanies(skip: number, limit: number): Promise<{ companies: ICompany[], total: number }>;
    updateCompany(id: string, updateData: UpdateCompanyDto): Promise<ICompany | null>;
    deleteCompany(id: string): Promise<boolean>;
    searchcompanies(query: string, skip: number, limit: number): Promise<{ companies: ICompany[], total: number }>;
}

export class CompanyService implements ICompanyService {
    private CompanyRepository: ICompanyRepository;

    // Constructor based dependency injection
    constructor(CompanyRepository: ICompanyRepository) {
        this.CompanyRepository = CompanyRepository;
    }

    async createCompany(company: CreateCompanyDto): Promise<ICompany> {
        const sanitizedPayload: any = {
            ...company
        }
        return await this.CompanyRepository.createCompany(sanitizedPayload);
    }

    async getCompanyById(id: string): Promise<ICompany | null> {
        const company = await this.CompanyRepository.getCompanyById(id);
        if (!company) {
            throw new NotFoundError("Company not found");
        }
        return company;
    }

    async getAllCompanies(skip: number, limit: number): Promise<{ companies: ICompany[], total: number }> {
        return await this.CompanyRepository.getAllCompanies(skip, limit);
    }

    async updateCompany(id: string, updateData: UpdateCompanyDto): Promise<ICompany | null> {
        const company = await this.getCompanyById(id);
        if (!company) {
            throw new NotFoundError("Company not found");
        }
        return await this.CompanyRepository.updateCompany(id, updateData);
    }

    async deleteCompany(id: string): Promise<boolean> {
        const Company = await this.getCompanyById(id);
        if (!Company) {
            throw new NotFoundError("Company not found");
        }
        return await this.CompanyRepository.deleteCompany(id);
    }

    async searchcompanies(query: string, skip: number, limit: number): Promise<{ companies: ICompany[], total: number }> {
        if (!query || query.trim() === "") {
            throw new BadRequestError("Query is required");
        }
        return await this.CompanyRepository.searchCompanies(query, skip, limit);
    }
}