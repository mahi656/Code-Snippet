import mongoose, { Schema, Document } from "mongoose";

export interface ISnippet extends Document {
    title: string;
    description?: string;
    language: string;
    framework?: string;
    visibility: 'public' | 'private' | 'unlisted';
    dependencies?: string;
    code: string;
    tags?: string[];
    isFavorite: boolean;
    showInCalendar: boolean;
    calendarDate?: Date;
    changeNote?: string;
    attachments?: string[];
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const SnippetSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    language: { type: String, required: true, default: 'javascript' },
    framework: { type: String, default: 'none' },
    visibility: { 
        type: String, 
        required: true, 
        enum: ['public', 'private', 'unlisted'], 
        default: 'private' 
    },
    dependencies: { type: String },
    code: { type: String, required: true },
    tags: { type: [String], default: [] },
    isFavorite: { type: Boolean, default: false },
    showInCalendar: { type: Boolean, default: false },
    calendarDate: { type: Date },
    changeNote: { type: String },
    attachments: { type: [String], default: [] },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model<ISnippet>("Snippet", SnippetSchema);