import { Company, ICompany } from "../models/company.model";

export interface ICompanyRepository {
    createCompany(company: Partial<ICompany>): Promise<ICompany>;
    getCompanyById(id: string): Promise<ICompany | null>;
    getAllCompanies(skip: number, limit: number): Promise<{ companies: ICompany[], total: number }>;
    updateCompany(id: string, updateData: Partial<ICompany>): Promise<ICompany | null>;
    deleteCompany(id: string): Promise<boolean>;
    searchCompanies(query: string, skip: number, limit: number): Promise<{ companies: ICompany[], total: number }>;
}

export class CompanyRepository implements ICompanyRepository {
    async createCompany(company: Partial<ICompany>): Promise<ICompany> {
        const newCompany = new Company(company);
        return await newCompany.save();
    };
    async getCompanyById(id: string): Promise<ICompany | null> {
        return await Company.findOne({ _id: id, is_deleted: false });
    };
    async getAllCompanies(skip: number, limit: number): Promise<{ companies: ICompany[], total: number }> {
        const companies = await Company.find({ is_deleted: false }).skip(skip).limit(limit).sort({ createdAt: -1 });
        const total = await Company.find().countDocuments();
        return {
            companies, total
        };
    };
    async updateCompany(id: string, updateData: Partial<ICompany>): Promise<ICompany | null> {
        return await Company.findOneAndUpdate({ _id: id, is_deleted: false }, updateData, { new: true });
    };
    async deleteCompany(id: string): Promise<boolean> {
        const result = await Company.findByIdAndUpdate(id, { is_deleted: false });
        return result !== null;
    };
    async searchCompanies(query: string, skip: number, limit: number): Promise<{ companies: ICompany[], total: number }> {
        const regex = new RegExp(query, "i");
        console.log("regex", regex)
        const companies = await Company.find({ $or: [{ name: regex }], is_deleted: false }).skip(skip).limit(limit).sort({ createdAt: -1 });
        const total = await Company.find().countDocuments();
        return {
            companies, total
        };
    };
}