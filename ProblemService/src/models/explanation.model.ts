import mongoose, { Document, Schema } from "mongoose";

export interface IExplanation extends Document {
    problemId: any;
    explanation: string;
    createdAt: Date;
    updatedAt: Date;
}

const explanationSchema = new Schema<IExplanation>({
    problemId: {
        type: Schema.Types.ObjectId,
        ref: "Problem",
        unique: true,
        required: [true, 'problem id is required']
    },
    explanation: {
        type: String,
        trim: true
    }
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

export const Explanation = mongoose.model<IExplanation>("Explanation", explanationSchema);