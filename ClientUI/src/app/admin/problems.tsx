import { useDebounce } from '@/lib/helpers';
import { useEffect, useState } from 'react'
import type { DifficultyType } from '../problems-list';
import { Link, useNavigate } from 'react-router';
import { tryCatch } from '@/lib/try-catch';
import { getAdminProblemsService, getProblemByDifficultyService, searchProblemService } from '@/services/problems.service';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AdminProblemTable } from './problem-list';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '../spinner/loading-spinner';

const AdminProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce(query, 500);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getProblemsHandler = async () => {
    setIsLoading(true);
    const [data, error] = await tryCatch(() => getAdminProblemsService());
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
    navigate('/admin/problem', { state: { problemId: id } });
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
    <main>
      {isLoading && <div className="mt-20 items-center justify-center"><LoadingSpinner size="md" message="Loading problems..." /></div>}
      {!isLoading && (<section className='mx-10 mt-10'>
        <div className='flex gap-5 items-center'>
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
          <Link to='/admin/problem'><Button>Add Problem</Button></Link>
        </div>
        <div>
            {filteredProblems.length > 0 ? <AdminProblemTable problems={filteredProblems} onClickHandler={navigateToProblemPageHandler} /> : <div className='py-5'>
              <p className='text-sm text-center'>No problems found.</p>
            </div>}
        </div>
      </section>)}
    </main>
  )
}

export default AdminProblemsPage