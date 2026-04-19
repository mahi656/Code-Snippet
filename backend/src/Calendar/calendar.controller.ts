import { Response } from 'express';
import mongoose, { Types } from 'mongoose';
import { AuthRequest } from '../Auth/auth.middleware';
import CalendarEvent from './calendar.model';
import Snippet from '../Snippet/snippet.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

class CalendarController {
    public createEvent = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { title, description, date, snippetId } = req.body;
        const userId = req.user?.id;

        if (!title || !date) {
            throw new ApiError(400, 'Title and date are required');
        }

        const newEvent = new CalendarEvent({
            title,
            description,
            date,
            userId,
            snippetId
        });

        await newEvent.save();

        res.status(201).json(new ApiResponse(201, { event: newEvent }, 'Event created successfully'));
    });

    public getMyEvents = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user?.id;
        const { month, year } = req.query;

        let query: any = { userId };

        if (month && year) {
            const startDate = new Date(Number(year), Number(month) - 1, 1);
            const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);
            query.date = { $gte: startDate, $lte: endDate };
        }

        const events = await CalendarEvent.find(query).sort({ date: 1 }).populate('snippetId');
        res.status(200).json(new ApiResponse(200, events, 'Events fetched successfully'));
    });

    public getCalendarSnippets = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user?.id;
        // Snag any snippet that the user explicitly flagged to show up on their calendar
        const snippets = await Snippet.find({ userId, showInCalendar: true }).sort({ calendarDate: 1 });
        res.status(200).json(new ApiResponse(200, snippets, 'Calendar snippets fetched successfully'));
    });

    public deleteEvent = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        const userId = req.user?.id;

        const event = await CalendarEvent.findOneAndDelete({ _id: id, userId });

        if (!event) {
            throw new ApiError(404, 'Event not found or unauthorized');
        }

        res.status(200).json(new ApiResponse(200, null, 'Event deleted successfully'));
    });

    /**
     * Get a summary of activity (snippet creations/updates) for the heat map
     */
    public getActivitySummary = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user?.id;
        const { start, end } = req.query;

        if (!start || !end) {
            throw new ApiError(400, 'Start and end dates are required');
        }

        const startDate = new Date(start as string);
        const endDate = new Date(end as string);
        endDate.setHours(23, 59, 59, 999); // Ensure full inclusive day

        // Aggregate snippets modified in this range
        const activity = await Snippet.aggregate([
            {
                $match: {
                    userId: new Types.ObjectId(userId),
                    updatedAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    count: 1
                }
            },
            { $sort: { date: 1 } }
        ]);

        res.status(200).json(new ApiResponse(200, activity, 'Activity summary fetched successfully'));
    });
}

export default new CalendarController();
