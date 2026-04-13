import { Response } from 'express';
import { AuthRequest } from '../Auth/auth.middleware';
import CalendarEvent from './calendar.model';
import Snippet from '../Snippet/snippet.model';

class CalendarController {
    public async createEvent(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { title, description, date, snippetId } = req.body;
            const userId = req.user?.id;

            if (!title || !date) {
                res.status(400).json({ message: 'Title and date are required' });
                return;
            }

            const newEvent = new CalendarEvent({
                title,
                description,
                date,
                userId,
                snippetId
            });

            await newEvent.save();

            res.status(201).json({
                message: 'Event created successfully',
                event: newEvent
            });
        } catch (error) {
            console.error('Error creating calendar event:', error);
            res.status(500).json({ message: 'Server error creating event' });
        }
    }

    public async getMyEvents(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            const { month, year } = req.query;

            let query: any = { userId };

            if (month && year) {
                const startDate = new Date(Number(year), Number(month) - 1, 1);
                const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);
                query.date = { $gte: startDate, $lte: endDate };
            }

            const events = await CalendarEvent.find(query).sort({ date: 1 }).populate('snippetId');
            res.status(200).json(events);
        } catch (error) {
            console.error('Error fetching calendar events:', error);
            res.status(500).json({ message: 'Server error fetching events' });
        }
    }

    public async getCalendarSnippets(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            // Snag any snippet that the user explicitly flagged to show up on their calendar
            const snippets = await Snippet.find({ userId, showInCalendar: true }).sort({ calendarDate: 1 });
            res.status(200).json(snippets);
        } catch (error) {
            console.error('Error fetching calendar snippets:', error);
            res.status(500).json({ message: 'Server error fetching calendar snippets' });
        }
    }

    public async deleteEvent(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            const event = await CalendarEvent.findOneAndDelete({ _id: id, userId });

            if (!event) {
                res.status(404).json({ message: 'Event not found or unauthorized' });
                return;
            }

            res.status(200).json({ message: 'Event deleted successfully' });
        } catch (error) {
            console.error('Error deleting calendar event:', error);
            res.status(500).json({ message: 'Server error deleting event' });
        }
    }
}

export default new CalendarController();
