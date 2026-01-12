import { Outlet, useNavigate } from 'react-router'
import Navbar from './navbar'
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/auth-context';
import { tryCatch } from '@/lib/try-catch';
import { validateUserSessionService } from '@/services/auth.service';

const SiteLayout = () => {
    const navigate = useNavigate();
    const ctx = useContext(AuthContext);

    async function validateUserSession() {
        const [res, error]: [any, any] = await tryCatch(() => validateUserSessionService());
        if (error || !res) {
            navigate('/auth');
        }
        else {
            ctx.setUser(res?.data?.data?.user, res?.data?.data?.roles);
            navigate('/');
        }
    }

    useEffect(() => {
        validateUserSession();
    }, []);

    return (
        <main className='min-h-screen w-full'>
            <Navbar />
            <Outlet />
        </main>
    )
}

export default SiteLayout