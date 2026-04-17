import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';

export interface IShare extends Document {
    snippetId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    shareToken: string;
    expiresAt?: Date;
    isActive: boolean;
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const ShareSchema: Schema = new Schema({
    snippetId: { type: Schema.Types.ObjectId, ref: 'Snippet', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shareToken: { type: String, required: true, unique: true, default: () => crypto.randomBytes(16).toString('hex') },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
    viewCount: { type: Number, default: 0 }
}, { timestamps: true });

// Composite index for quick search
ShareSchema.index({ snippetId: 1, userId: 1 });

export default mongoose.model<IShare>('Share', ShareSchema);
