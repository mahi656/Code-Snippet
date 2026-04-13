import { Router } from 'express';
import CalendarController from './calendar.controller';
import { authMiddleware } from '../Auth/auth.middleware';

const router = Router();

// Protect all calendar routes
router.use(authMiddleware as any);

// Routes for dedicated calendar events
router.post('/events', CalendarController.createEvent);
router.get('/events', CalendarController.getMyEvents);
router.delete('/events/:id', CalendarController.deleteEvent);

// Route for fetching snippets that are marked to show in calendar
router.get('/snippets', CalendarController.getCalendarSnippets);

export default router;
