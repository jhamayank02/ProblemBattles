import mongoose from "mongoose";

export interface ITestcase extends mongoose.Document {
    input: string;
    output: string;
}

export interface ISample extends mongoose.Document {
    input: string;
    output: string;
}

export interface IProblem extends mongoose.Document {
    title: string;
    description: string;
    difficulty: "easy" | "medium" | "hard";
    createdAt: Date;
    updatedAt: Date;
    editorial?: string;
    testcases: ITestcase[];
    visibility: "public" | "private";
    company?: string[];
    stub: string;
    driver_code: string;
    sample?: ISample[];
}

const testcaseSchema = new mongoose.Schema<ITestcase>({
    input: {
        type: String,
        required: [true, "Input is required"],
        trim: true
    },
    output: {
        type: String,
        required: [true, "Output is required"],
        trim: true
    }
}, {
    toJSON: {
        transform: (_, record) => {
            delete (record as any).__v;
            record.id = record._id,
            delete (record as any)._id;
            return record;
        }
    }
});

const sampleSchema = new mongoose.Schema<ISample>({
    input: {
        type: String,
        required: [true, "Input is required"],
        trim: true
    },
    output: {
        type: String,
        required: [true, "Output is required"],
        trim: true
    }
}, {
    toJSON: {
        transform: (_, record) => {
            delete (record as any).__v;
            record.id = record._id,
            delete (record as any)._id;
            return record;
        }
    }
});

const problemSchema = new mongoose.Schema<IProblem>({
    title: {
        type: String,
        required: [true, "Title is required"],
        maxLength: [100, "Title must be less than 100 characters"],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    difficulty: {
        type: String,
        enum: {
            values: ["easy", "medium", "hard"],
            message: "Invalid difficulty level",
        },
        default: "easy",
        required: [true, "Difficulty level is required"]
    },
    editorial: {
        type: String,
        trim: true
    },
    visibility: {
        type: String,
        enum: {
            values: ["public", "private"],
            message: "Invalid visibility"
        },
        default: "public"
    },
    company: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    }],
    testcases: [testcaseSchema],
    stub: {
        type: String,
        trim: true,
        required: [true, "Stub is required"]
    },
    driver_code: {
        type: String,
        trim: true,
        required: [true, "Stub is required"]
    },
    sample: [sampleSchema]
}, {
    timestamps: true,
    toJSON: {
        transform: (_, record) => {
            delete (record as any).__v;
            record.id = record._id,
            delete (record as any)._id;
            return record;
        }
    }
});

problemSchema.index({ difficulty: 1 });

export const Problem = mongoose.model<IProblem>("Problem", problemSchema);