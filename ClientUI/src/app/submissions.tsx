import { AuthContext } from "@/context/auth-context";
import { tryCatch } from "@/lib/try-catch";
import { getSubmissionsByUserAndProblemIdService } from "@/services/submission.service";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import moment from 'moment';
import { normalizeSubmissionStatusHandler } from "@/lib/helpers";
import SubmissionDetails from "./submission-details";
import LoadingSpinner from "./spinner/loading-spinner";

export interface ISubmission {
    id: string;
    language: string;
    status: "pending" | "time_limit_exceeded" | "wrong_answer" | "correct_answer" | "runtime_exception";
    problemId: string;
    userId: string;
    code: string;
    createdAt: Date;
    updatedAt: Date;
}

interface ISubmissionProps {
    problemId?: string;
}

export const STATUS_STYLES = {
    pending: "bg-blue-100 text-blue-700 border-blue-300",
    time_limit_exceeded: "bg-yellow-100 text-yellow-700 border-yellow-300",
    wrong_answer: "bg-red-100 text-red-700 border-red-300",
    correct_answer: "bg-green-100 text-green-700 border-green-300",
    runtime_exception: "bg-purple-100 text-purple-700 border-purple-300",
};


const Submissions = ({ problemId }: ISubmissionProps) => {
    const ctx = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [submissions, setSubmissions] = useState<ISubmission[]>([]);

    const getSubmissionsByUserAndProblemIdHandler = async () => {
        setIsLoading(true);
        const [data, error] = await tryCatch(() => getSubmissionsByUserAndProblemIdService(ctx.user?.id as string, problemId as string));
        setIsLoading(false);
        if (error) {
            toast.error("Oops, An error occurred!", {
                description: error,
                closeButton: true,
            });
        }
        else {
            const res = data?.data?.data;
            console.log(res)
            setSubmissions(res);
        }
    }

    useEffect(() => {
        getSubmissionsByUserAndProblemIdHandler();
    }, []);

    return (
        <section>
            <h1 className="text-2xl font-bold mb-7">Submissions</h1>
            {isLoading && <div className="mt-10">
                <LoadingSpinner size="md" message="Loading submissions..." />
            </div>}
            {!isLoading && submissions.length === 0 && <p className="text-center">No submissions found.</p>}
            {!isLoading && <div className="space-y-1">
                {submissions.map((submission: ISubmission) => {
                    return <SubmissionDetails data={submission}>
                        <div key={submission.id} className={`flex justify-between items-center px-4 py-3 shadow ${STATUS_STYLES[submission.status]}`}>
                            <p className={`${STATUS_STYLES[submission.status]}`}>{normalizeSubmissionStatusHandler(submission.status)}</p>
                            <p>{moment(submission.createdAt).format('DD/MM/YYYY hh:mm:ss A')}</p>
                        </div>
                    </SubmissionDetails>
                })}
            </div>}
        </section>
    )
}

export default Submissions