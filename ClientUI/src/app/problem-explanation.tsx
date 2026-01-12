import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState, type ReactNode } from "react"
import { toast } from "sonner"
import { tryCatch } from "@/lib/try-catch"
import { getProblemExplanationByProblemIdService } from "@/services/problems.service"
import Markdown from "./admin/markdown"
import LoadingSpinner from "./spinner/loading-spinner"

interface IProblemExplanationProps {
    children: ReactNode,
    problemId: string
}

type IExplanation = {
    id: string;
    problemId: string;
    explanation: string;
    createdAt: string;
    updatedAt: string;
}

const ProblemExplanation = ({ children, problemId }: IProblemExplanationProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<IExplanation>();
    const [trigger, setTrigger] = useState(false);

    const getProblemExplanationHandler = async () => {
        setIsLoading(true);
        const [data, error] = await tryCatch(() => getProblemExplanationByProblemIdService(problemId as string));
        setIsLoading(false);
        if (error) {
            toast.error("Oops, An error occurred!", {
                description: error,
                closeButton: true,
            });
            setTrigger(false);
        }
        else {
            const res = data?.data?.data;
            setData(res);
        }
    }

    useEffect(() => {
        if (trigger) {
            getProblemExplanationHandler();
        }
    }, [trigger])

    return (
        <Dialog>
            <DialogTrigger asChild onClick={() => setTrigger(curr => !curr)}>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-auto">
                <div className="flex justify-center items-center gap-2">
                    {isLoading && <LoadingSpinner size="md" message="Generating explanation..." />}
                    {!isLoading && !data && <div>Something went wrong, please try again later.</div>}
                    {!isLoading && data && <div className="grid flex-1 gap-2">
                        <h1 className="text-lg font-medium">Explanation</h1>
                        <section className="mt-5">
                            <Markdown markdown={data.explanation} />
                        </section>
                    </div>}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProblemExplanation