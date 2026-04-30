import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    fullName?: string;
    username: string;
    email?: string;
    password?: string;
    githubId?: string;
    avatar_url?: string;
    bio?: string;
    followers?: number;
    public_repos?: number;
    projects: {
        name: string;
        files: { id: number; name: string }[];
        folders: { id: number; name: string }[];
    }[];
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema: Schema = new Schema({
    fullName: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String },
    password: { type: String },
    githubId: { type: String, unique: true, sparse: true },
    avatar_url: { type: String },
    bio: { type: String },
    followers: { type: Number },
    public_repos: { type: Number },
    projects: [{
        name: { type: String, required: true },
        files: [{ id: Number, name: String }],
        folders: [{ id: Number, name: String }]
    }]
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
