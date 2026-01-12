import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { tryCatch } from '@/lib/try-catch';
import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import type { IProblem } from './problems-list';
import { useNavigate, useParams } from 'react-router';
import { getProblemByIdService } from '@/services/problems.service';
import { getDifficultyClass } from './problem-table';
import CodeEditor from './code-editor';
import { capitalizeFirstLetter } from '@/lib/helpers';
import { CompanyLogos } from './company-logo';
import Markdown from "./admin/markdown";
import { Group, Separator, Panel } from 'react-resizable-panels';
import Submissions from "./submissions";
import { Sparkles } from "lucide-react";
import ProblemExplanation from "./problem-explanation";
import LoadingSpinner from "./spinner/loading-spinner";
import ErrorComponent from "./error/error";

const ProblemPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { problemId } = useParams();
    const [problemData, setProblemData] = useState<null | IProblem>();
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState('description');

    const getProblemByIdHandler = async () => {
        setIsLoading(true);
        const [data, error] = await tryCatch(() => getProblemByIdService(problemId as string));
        setIsLoading(false);
        if (error) {
            toast.error("Oops, An error occurred!", {
                description: error,
                closeButton: true,
            });
        }
        else {
            const res = data?.data?.data;
            setProblemData(res);
        }
    }

    const onSubmissionResultHandler = () => {
        setCurrentTab("submissions");
    }

    useEffect(() => {
        if (!problemId) {
            navigate(-1);
        }
        else {
            getProblemByIdHandler();
        }
    }, [problemId]);

    return (
        <>
            {isLoading && <div className="mt-20"><LoadingSpinner size="md" message="Loading problem..." /></div>}
            {!isLoading && !problemData && <ErrorComponent />}
            {!isLoading && problemData && <Group className='flex px-1 w-full max-h-screen overflow-hidden gap-2'>
                <Panel minSize="20">
                    <section className='flex-1 w-full'>
                        <Tabs defaultValue={currentTab} value={currentTab}>
                            <TabsList className="w-full">
                                <TabsTrigger value="description" onClick={() => setCurrentTab("description")}>Description</TabsTrigger>
                                {problemData.editorial && <TabsTrigger value="editorial" onClick={() => setCurrentTab("editorial")}>Editorial</TabsTrigger>}
                                <TabsTrigger value="submissions" onClick={() => setCurrentTab("submissions")}>Submissions</TabsTrigger>
                            </TabsList>
                            <TabsContent value="description">
                                {/* Problem Description */}
                                <div className="h-[90vh] overflow-auto bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6 overflow-y-auto">
                                    <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
                                        <span>{problemData.title}</span>
                                        <ProblemExplanation problemId={problemId as string}><Sparkles size={20} color="#ffb500" className="cursor-pointer" /></ProblemExplanation>
                                    </h1>
                                    <div className='flex items-center gap-2 mb-4'>
                                        <p className={`font-semibold ${getDifficultyClass(problemData.difficulty)}`}>
                                            {capitalizeFirstLetter(problemData.difficulty)}
                                        </p>
                                        <CompanyLogos companies={problemData.company} />
                                    </div>

                                    <Markdown markdown={problemData.description} />
                                </div>
                            </TabsContent>
                            <TabsContent value="editorial">
                                <div className="h-[90vh] overflow-auto bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6 overflow-y-auto">
                                    <h1 className="text-2xl font-bold mb-2">Editorial</h1>
                                    {problemData.editorial && <Markdown markdown={problemData.editorial} />}
                                </div>
                            </TabsContent>
                            <TabsContent value="submissions">
                                <div className="h-[90vh] overflow-auto bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6 overflow-y-auto">
                                    <Submissions problemId={problemId} />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </section>
                </Panel>
                <Separator />
                <Panel minSize="20">
                    <section className='flex-1 w-full'>
                        <CodeEditor problemId={problemId as string} onResult={onSubmissionResultHandler} stub={problemData.stub} />
                    </section>
                </Panel>
            </Group >}
        </>
    )
}

export default ProblemPage