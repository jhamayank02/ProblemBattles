import { Outlet, useNavigate } from 'react-router'
import AdminNavbar from './navbar'
import { AuthContext } from '@/context/auth-context';
import { useContext, useEffect } from 'react';
import { tryCatch } from '@/lib/try-catch';
import { validateUserSessionService } from '@/services/auth.service';

const AdminLayout = () => {
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
            <AdminNavbar />
            <section className='px-8 mt-8'>
                <Outlet />
            </section>
        </main>
    )
}

export default AdminLayout