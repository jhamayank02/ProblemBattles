import { useEffect, useState } from "react";

export function capitalizeFirstLetter(str: string) {
    if (str.length === 0) {
        return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function normalizeSubmissionStatusHandler(str: string) {
    if (str.length === 0) {
        return "";
    }
    str = str.replace("_", " ");
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        }
    }, [value, delay]);

    return debouncedValue;
}