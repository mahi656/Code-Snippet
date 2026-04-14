import mongoose, { Schema, Document } from 'mongoose';

export interface ITag extends Document {
    name: string;
    color?: string;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const TagSchema: Schema = new Schema({
    name: { type: String, required: true, trim: true, lowercase: true },
    color: { type: String, default: '#a78bfa' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Prevent duplicate tag names for the same user
TagSchema.index({ name: 1, userId: 1 }, { unique: true });

export default mongoose.model<ITag>('Tag', TagSchema);
