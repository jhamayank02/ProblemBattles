import { AuthContext } from '@/context/auth-context';
import { useContext, type ReactNode } from 'react'
import { useNavigate } from 'react-router';

const AdminRoute = ({ children }: { children: ReactNode }) => {
    const ctx = useContext(AuthContext);
    const navigate = useNavigate();

    if (!ctx.roles?.includes("admin")) {
        navigate('/auth');
    }

    return children;
}

export default AdminRoute;