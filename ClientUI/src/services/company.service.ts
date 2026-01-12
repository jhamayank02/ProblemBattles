import { fetchApi } from "@/lib/axios";

export interface CreateCompanyI {
    name: string;
    image_url?: string;
}

export const getCompaniesService = async () => fetchApi({
    url: "/company",
    method: "GET"
});

export const addCompanyService = async (payload: CreateCompanyI) => fetchApi({
    url: "/company",
    method: "POST",
    data: payload
});

export const updateCompanyService = async (id: string, payload: CreateCompanyI) => fetchApi({
    url: `/company/${id}`,
    method: "PUT",
    data: payload
});

export const searchCompanyService = async (query: string) => fetchApi({
    url: `/company/search?query=${query}`,
    method: "GET"
});