import api from './api';

export const calendarApi = {
    // Fetch all user milestones
    getEvents: (month, year) => {
        const query = month && year ? `?month=${month}&year=${year}` : '';
        return api.get(`/api/calendar/events${query}`);
    },

    // Create a new milestone
    createEvent: (eventData) => {
        return api.post('/api/calendar/events', eventData);
    },

    // Remove a milestone
    deleteEvent: (id) => {
        return api.delete(`/api/calendar/events/${id}`);
    },

    // Fetch heatmap activity data
    getActivitySummary: (start, end) => {
        return api.get(`/api/calendar/activity?start=${start}&end=${end}`);
    },

    // Get snippets pinned to calendar
    getCalendarSnippets: () => {
        return api.get('/api/calendar/snippets');
    }
};

export default calendarApi;
