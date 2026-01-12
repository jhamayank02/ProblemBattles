import { createContext } from "react";

export interface IUser {
    id: string;
    name: string;
    email: string;
}

interface IAuthContext {
    user: IUser | null;
    roles: string[] | null;
    setUser: (user: IUser | null, roles: string[] | null) => void;
}

export const AuthContext = createContext<IAuthContext>({
    user: null,
    roles: null,
    setUser: () => {}
});