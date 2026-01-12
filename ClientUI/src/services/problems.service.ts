import type { DifficultyType, ITestcase } from "@/app/problems-list";
import { fetchApi } from "@/lib/axios";

type CreateProblemI = {
    title: string;
    description: string;
    editorial?: string;
    difficulty: string;
    visibility: string;
    company: string[];
    stub: string;
    testcases: ITestcase[]
}

type EditProblemI = {
    id?: string;
    title?: string;
    description?: string;
    editorial?: string;
    difficulty?: string;
    visibility?: string;
    company?: string[];
    stub?: string;
    testcases?: ITestcase[]
}

export const getAdminProblemsService = async () => fetchApi({
    url: "/problem",
    method: "GET"
});

export const getProblemsService = async () => fetchApi({
    url: "/problem",
    method: "GET"
});

export const searchProblemService = async (query: string) => fetchApi({
    url: `/problem/search?query=${query}`,
    method: "GET"
});

export const getProblemByDifficultyService = async (difficulty: DifficultyType) => fetchApi({
    url: `/problem/difficulty/${difficulty}`,
    method: "GET"
});

export const getProblemByIdService = async (id: string) => fetchApi({
    url: `/problem/${id}`,
    method: "GET"
});

export const addProblemService = async (payload: CreateProblemI) => fetchApi({
    url: `/problem`,
    method: "POST",
    data: payload
});

export const editProblemService = async (id: string, payload: EditProblemI) => fetchApi({
    url: `/problem/${id}`,
    method: "PUT",
    data: payload
});

export const getProblemExplanationByProblemIdService = async (problemId: string) => fetchApi({
    url: `/explanation/${problemId}`,
    method: "GET"
});