import mongoose, { Schema, Document } from 'mongoose';

export interface IQRSession extends Document {
    token: string;
    status: 'pending' | 'scanned' | 'verified' | 'expired';
    userId?: mongoose.Types.ObjectId;
    expiresAt: Date;
}

const QRSessionSchema: Schema = new Schema({
    token: { type: String, required: true, unique: true },
    status: {
        type: String,
        enum: ['pending', 'scanned', 'verified', 'expired'],
        default: 'pending'
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // Auto-delete documents when expiresAt is reached
    }
}, { timestamps: true });

export default mongoose.model<IQRSession>('QRSession', QRSessionSchema);
