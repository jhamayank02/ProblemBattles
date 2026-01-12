import { Button } from '@/components/ui/button'
import { AuthContext } from '@/context/auth-context';
import { tryCatch } from '@/lib/try-catch';
import { logoutUserService } from '@/services/auth.service';
import { CodeIcon, LogOutIcon } from 'lucide-react'
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

const Navbar = () => {
    const navigate = useNavigate();
    const ctx = useContext(AuthContext);
    const isAdmin = ctx && ctx.roles?.includes("admin");

    const logoutHandler = async () => {
        const [_, error] = await tryCatch(() => logoutUserService());
        if (error) {
            toast.error("Oops, An error occurred!", {
                description: error,
                closeButton: true,
            });
        }
        else {
            ctx.setUser(null, null);
            toast.success("Success!", {
                description: "Logged out successfully",
                closeButton: true,
            });
            navigate('/auth');
        }
    }

    return (
        <nav className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
                <CodeIcon className="h-6 w-6" />
                <span>ProblemBattles</span>
            </Link>
            <div className="flex items-center gap-2">
                {isAdmin && <Link to="/admin" className='underline hover:opacity-80'>Admin Panel</Link>}
                {/* <ThemeToggle /> */}
                <Button variant="ghost" onClick={logoutHandler} className="flex items-center gap-2">
                    <LogOutIcon className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </nav>
    )
}

export default Navbar;