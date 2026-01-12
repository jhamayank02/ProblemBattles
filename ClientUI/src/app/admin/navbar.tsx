import { Button } from '@/components/ui/button'
import { AuthContext } from '@/context/auth-context';
import { tryCatch } from '@/lib/try-catch';
import { logoutUserService } from '@/services/auth.service';
import { BuildingIcon, CodeIcon, LogOutIcon } from 'lucide-react'
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

const AdminNavbar = () => {
    const ctx = useContext(AuthContext);
    const navigate = useNavigate();

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
        <header className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-20">
            <nav className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-16">
                <div className="flex items-center gap-4">
                    <Link to="/admin" className="flex items-center gap-2 text-xl font-bold">
                        <CodeIcon className="h-6 w-6" />
                        <span>ProblemBattles</span>
                    </Link>
                    <span className="text-xs font-mono bg-purple-100 text-purple-700 border border-purple-200 rounded px-2 py-0.5 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700/50">
                        ADMIN
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Link to="/" className='underline hover:opacity-80 mr-3'>Solve Problems</Link>
                    <Link to=''>
                        <Button
                            // variant={view === 'problems' ? 'default' : 'ghost'}
                            // onClick={() => setView('problems')}
                            className="hidden sm:flex items-center gap-2"
                        >
                            <CodeIcon className="h-4 w-4" />
                            Problems
                        </Button>
                    </Link>
                    <Link to='company'>
                        <Button
                            // variant={view === 'companies' ? 'default' : 'ghost'}
                            // onClick={() => setView('companies')}
                            className="hidden sm:flex items-center gap-2"
                        >
                            <BuildingIcon className="h-4 w-4" />
                            Companies
                        </Button>
                    </Link>
                    <Button variant="ghost" onClick={logoutHandler} className="flex items-center gap-2">
                        <LogOutIcon className="h-4 w-4" />
                        Logout
                    </Button>
                    {/* <ThemeToggle /> */}
                </div>
            </nav>
        </header>
    )
}

export default AdminNavbar