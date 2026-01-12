import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import type { ReactNode } from "react"
import type { ISubmission } from "./submissions"
import { normalizeSubmissionStatusHandler } from "@/lib/helpers"
import moment from "moment"

interface ISubmissionDetailsProps {
    children: ReactNode,
    data: ISubmission
}

const SubmissionDetails = ({ children, data }: ISubmissionDetailsProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-1/2 max-h-[90vh] overflow-auto">
                <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                        <h1 className="text-lg font-medium">{normalizeSubmissionStatusHandler(data.status)}</h1>
                        <h3 className="text-base">
                            <p>Language: {data.language}</p>
                            <p>Submitted on: {moment(data.createdAt).format('DD/MM/YYYY hh:mm:ss A')}</p>
                        </h3>
                        <section className="bg-gray-100 rounded-sm p-1 mt-5">
                            <pre>
                                {data.code}
                            </pre>
                        </section>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SubmissionDetails