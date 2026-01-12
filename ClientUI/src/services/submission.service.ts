import { fetchApi } from "@/lib/axios";

interface ICreateSubmission {
    problemId: string,
    code: string,
    language: string
}

export const createSubmissionService = async (payload: ICreateSubmission) => fetchApi({
    url: "/submission",
    method: "POST",
    data: payload
});

export const getSubmissionsByUserAndProblemIdService = async (userId: string, problemId: string) => fetchApi({
    url: `/submission/user/${userId}/${problemId}`,
    method: "GET"
});