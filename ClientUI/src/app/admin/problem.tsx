import { useNavigate } from 'react-router';
import ProblemForm from './problem-form';

const AdminProblemPage = () => {
    const navigate = useNavigate();

    const onSubmitHandler = ()=>{
        navigate(-1);
    }

    return (
        <main className='w-full'>
            <section className='px-5 pb-10'>
                <ProblemForm onSubmit={onSubmitHandler} />
            </section>
        </main>
    )
}

export default AdminProblemPage