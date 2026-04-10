import mongoose, { Schema, Document } from 'mongoose';

export interface IFavorite extends Document {
    snippetId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const FavoriteSchema: Schema = new Schema({
    snippetId: { type: Schema.Types.ObjectId, ref: 'Snippet', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Prevent duplicate favorites from the exact same user at the database level
FavoriteSchema.index({ snippetId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IFavorite>('Favorite', FavoriteSchema);
