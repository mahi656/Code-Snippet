import mongoose, { Schema, Document } from 'mongoose';

export interface ICalendarEvent extends Document {
    title: string;
    description?: string;
    date: Date;
    userId: mongoose.Types.ObjectId;
    snippetId?: mongoose.Types.ObjectId;
    isCompleted?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CalendarEventSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    snippetId: { type: Schema.Types.ObjectId, ref: 'Snippet' },
    isCompleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<ICalendarEvent>('CalendarEvent', CalendarEventSchema);
