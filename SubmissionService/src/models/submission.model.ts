import mongoose, { Schema } from "mongoose";

export enum SubmissionStatus {
    PENDING = "pending",
    TIME_LIMIT_EXCEEDED = "time_limit_exceeded",
    WRONG_ANSWER = "wrong_answer",
    CORRECT_ANSWER = "correct_answer",
    RUNTIME_EXCEPTION = "runtime_exception",
}

export enum SubmissionLanguage {
    CPP = "cpp",
    PYTHON = "python",
    JAVA = "java",
    JAVASCRIPT = "javascript"
}

export interface ISubmissionData extends Document {
    status: SubmissionStatus;
    output: string;
}

export interface ISubmission extends Document {
    id?: string;
    problemId: string;
    userId: string;
    code: string;
    language: SubmissionLanguage;
    status: SubmissionStatus;
    submissionData: ISubmissionData;
    createdAt: Date;
    updatedAt: Date;
}

const submissionSchema = new Schema<ISubmission>({
    problemId: {
        type: String,
        required: [true, "Problem Id required for evaluation"]
    },
    userId: {
        type: String,
        required: [true, "User Id required for evaluation"]
    },
    code: {
        type: String,
        required: [true, "Code is required for evaluation"]
    },
    language: {
        type: String,
        required: [true, "Language is required for evaluation"],
        enum: Object.values(SubmissionLanguage)
    },
    status: {
        type: String,
        required: true,
        default: SubmissionStatus.PENDING,
        enum: Object.values(SubmissionStatus)
    },
    submissionData: {
        type: Object,
        required: true,
        default: {}
    }
}, {
    timestamps: true,
    toJSON: {
        transform: (_, record: any) => {
            delete record.__v;
            record.id = record._id;
            delete record._id;
            return record;
        }
    }
});

submissionSchema.index({ status: 1, createdAt: -1 }, { unique: true });
export const Submission = mongoose.model<ISubmission>("Submission", submissionSchema);