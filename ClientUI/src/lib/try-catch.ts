export const tryCatch = async <T>(fn: () => Promise<T>): Promise<[T | null, string | null]> => {
    try {
        const res = await fn();
        return [res, null];
    } catch (error: any) {
        if (error.status === 401) {
            window.location.href = '/auth';
            return [null, 'Session expired'];
        }
        const message =
            error?.response?.data?.error ||
            error?.message ||
            "Unknown error";
        return [null, message];
    }
}