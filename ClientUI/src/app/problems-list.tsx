import { tryCatch } from '@/lib/try-catch'
import { getProblemByDifficultyService, getProblemsService, searchProblemService } from '@/services/problems.service'
import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { ProblemTable } from './problem-table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/lib/helpers';
import { useNavigate } from 'react-router';
import LoadingSpinner from './spinner/loading-spinner';

export const Difficulty = {
    Easy: "easy",
    Medium: "medium",
    Hard: "hard",
} as const;

export type DifficultyType = typeof Difficulty[keyof typeof Difficulty];

export const Visibility = {
    Public: "publice",
    Private: "private"
} as const;

export type VisibilityType = typeof Visibility[keyof typeof Visibility];

export interface ICompany {
    id: string;
    name: string;
    image_url?: string;
}

export interface ITestcase {
    input: string;
    output: string;
    id?: string;
}

export interface ISample {
    input: string;
    output: string;
    id: string;
}

export interface IProblem {
    id: string;
    title: string;
    description: string;
    testcases: ITestcase[];
    sample?: ISample[];
    company: ICompany[];
    difficulty: DifficultyType;
    createdAt: Date;
    updatedAt: Date;
    editorial?: string;
    visibility: VisibilityType;
    stub: string;
}

const ProblemsList = () => {
    const [problems, setProblems] = useState([]);
    const [filteredProblems, setFilteredProblems] = useState([]);
    const [query, setQuery] = useState<string>("");
    const debouncedQuery = useDebounce(query, 500);
    const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const getProblemsHandler = async () => {
        setIsLoading(true);
        const [data, error] = await tryCatch(() => getProblemsService());
        setIsLoading(false);
        if (error) {
            toast.error("Oops, An error occurred!", {
                description: error,
                closeButton: true,
            });
        }
        else {
            const problemsData = data?.data?.data?.problems || [];
            setProblems(problemsData);
            setFilteredProblems(problemsData);
        }
    }

    const searchProblemsHandler = async () => {
        if (!query) {
            return;
        }
        setIsLoading(true);
        const [data, error] = await tryCatch(() => searchProblemService(query));
        setIsLoading(false);
        if (error) {
            toast.error("Oops, An error occurred!", {
                description: error,
                closeButton: true,
            });
        }
        else {
            setFilteredProblems(data?.data?.data?.problems || []);
        }
    }

    const getProblemsByDifficultyHandler = async () => {
        if (!selectedDifficulty) {
            return;
        }
        setIsLoading(true);
        const [data, error] = await tryCatch(() => getProblemByDifficultyService(selectedDifficulty));
        setIsLoading(false);
        if (error) {
            toast.error("Oops, An error occurred!", {
                description: error,
                closeButton: true,
            });
        }
        else {
            setFilteredProblems(data?.data?.data?.problems || []);
        }
    }

    const handleDifficultyChange = (difficulty: DifficultyType | null) => {
        setSelectedDifficulty(difficulty);
        setQuery("");
    }

    const handleSearchChange = (value: string) => {
        setQuery(value);
        if (value.trim()) {
            setSelectedDifficulty(null);
        }
    }

    const navigateToProblemPageHandler = (id: string) => {
        navigate(`/problem/${id}`);
    }

    useEffect(() => {
        getProblemsHandler();
    }, []);

    useEffect(() => {
        if (debouncedQuery.trim()) {
            searchProblemsHandler();
        } else if (selectedDifficulty) {
            getProblemsByDifficultyHandler();
        } else {
            setFilteredProblems(problems);
        }
    }, [debouncedQuery, selectedDifficulty, problems]);

    return (
        <section className='mx-10 mt-10 min-h-screen flex items-center flex-col'>
            <div className='flex w-full gap-5 items-center'>
                <Input value={query} onChange={(e) => handleSearchChange(e.target.value)} placeholder='Search problems' />
                <div className='flex gap-2'>
                    <Badge className='cursor-pointer' onClick={() => {
                        handleDifficultyChange(null);
                        getProblemsHandler();
                    }} variant={selectedDifficulty === null ? "default" : "outline"}>All</Badge>
                    <Badge className='cursor-pointer' onClick={() => handleDifficultyChange("easy")} variant={selectedDifficulty === "easy" ? "default" : "outline"}>Easy</Badge>
                    <Badge className='cursor-pointer' onClick={() => handleDifficultyChange("medium")} variant={selectedDifficulty === "medium" ? "default" : "outline"}>Medium</Badge>
                    <Badge className='cursor-pointer' onClick={() => handleDifficultyChange("hard")} variant={selectedDifficulty === "hard" ? "default" : "outline"}>Hard</Badge>
                </div>
            </div>
            {isLoading && <div className='py-5 flex-1 flex flex-col justify-center items-center'><LoadingSpinner size="md" message="Loading problems..." /></div>}
            {!isLoading && <div className='flex-1 w-full'>
                {filteredProblems.length > 0 ? <ProblemTable problems={filteredProblems} onClickHandler={navigateToProblemPageHandler} /> : <div className='py-5'>
                    <p className='text-sm text-center'>No problems found.</p>
                </div>}
            </div>}
        </section>
    )
}

export default ProblemsList