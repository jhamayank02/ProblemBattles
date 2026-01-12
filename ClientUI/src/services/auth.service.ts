import { fetchApi } from "@/lib/axios";

export interface UserSigninI {
    email: string;
    password: string;
}

export interface UserSignupI {
    email: string;
    password: string;
    username: string;
}

export const loginUserService =
    async (payload: UserSigninI) => fetchApi({
        url: '/auth/signin',
        method: "POST",
        data: payload
    });

export const validateUserSessionService =
    async () => fetchApi({
        url: '/auth/validate-session',
        method: "GET"
    });

export const registerUserService =
    async (payload: UserSignupI) => fetchApi({
        url: '/auth/signup',
        method: "POST",
        data: payload
    });

export const logoutUserService =
    async () => fetchApi({
        url: '/auth/logout',
        method: "GET"
    });