import mongoose, { Document } from "mongoose";

export interface ICompany extends Document {
    name: string;
    image_url?: string;
    is_deleted: boolean;
}

const companySchema = new mongoose.Schema<ICompany>({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    image_url: {
        type: String,
        trim: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: {
        transform: (doc: Document, record: any) => {
            delete record.__v;
            record.id = record._id;
            delete record._id;
            return record;
        }
    }
});

companySchema.index({ name: 1 });

export const Company = mongoose.model<ICompany>("Company", companySchema);