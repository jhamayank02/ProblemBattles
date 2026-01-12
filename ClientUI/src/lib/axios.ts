import axios from 'axios';

export interface AxiosPayloadI {
    data?: any,
    url: string,
    headers?: Record<string, string>,
    method: "GET" | "POST" | "PUT" | "DELETE"
}

const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_BACKEND_URL,
    // timeout: 1000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export const fetchApi = async (payload: AxiosPayloadI) => {
    try {
        const res = instance(payload);
        return res;
    } catch (err) {
        throw err;
    }
}