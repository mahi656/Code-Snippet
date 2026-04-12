import mongoose, { Schema, Document } from "mongoose";

export interface IVersion extends Document {
    snippetId: mongoose.Types.ObjectId;
    code: string;
    changeNote?: string;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const VersionSchema: Schema = new Schema({
    snippetId: { type: Schema.Types.ObjectId, ref: 'Snippet', required: true },
    code: { type: String, required: true },
    changeNote: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model<IVersion>("Version", VersionSchema);
