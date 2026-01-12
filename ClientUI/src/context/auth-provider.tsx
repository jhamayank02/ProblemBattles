import { useState, type ReactNode } from "react"
import { AuthContext, type IUser } from "./auth-context"

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [roles, setRoles] = useState<string[] | null>(null);

    const setUserHandler = (user: IUser | null, roles: string[] | null) => {
        setUser(user);
        setRoles(roles);
    }

    return (
        <AuthContext.Provider value={{
            user,
            roles,
            setUser: setUserHandler
        }}>
            {children}
        </AuthContext.Provider>
    )
}