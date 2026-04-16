import mongoose from 'mongoose';
import Snippet from '../Snippet/snippet.model';

class DashboardService {

    // Get all dashboard statistics for a user
    public async getStats(userId: string) {
        const uid = new mongoose.Types.ObjectId(userId);

        // Run all aggregations in parallel for speed
        const [
            totalSnippets,
            favoriteCount,
            trashedCount,
            languageBreakdown,
            tagBreakdown,
            visibilityBreakdown,
            recentSnippets,
            calendarCount
        ] = await Promise.all([
            // Total active snippets
            Snippet.countDocuments({ userId: uid, isDeleted: false }),

            // Favorite count
            Snippet.countDocuments({ userId: uid, isDeleted: false, isFavorite: true }),

            // Trashed count
            Snippet.countDocuments({ userId: uid, isDeleted: true }),

            // Snippets per language
            Snippet.aggregate([
                { $match: { userId: uid, isDeleted: false } },
                { $group: { _id: { $toLower: '$language' }, count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $project: { _id: 0, name: '$_id', count: 1 } }
            ]),

            // Top tags
            Snippet.aggregate([
                { $match: { userId: uid, isDeleted: false } },
                { $unwind: '$tags' },
                { $group: { _id: { $toLower: '$tags' }, count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 },
                { $project: { _id: 0, name: '$_id', count: 1 } }
            ]),

            // Visibility breakdown
            Snippet.aggregate([
                { $match: { userId: uid, isDeleted: false } },
                { $group: { _id: '$visibility', count: { $sum: 1 } } },
                { $project: { _id: 0, visibility: '$_id', count: 1 } }
            ]),

            // 5 most recent snippets
            Snippet.find({ userId: uid, isDeleted: false })
                .sort({ createdAt: -1 })
                .limit(5)
                .select('title language tags createdAt')
                .lean(),

            // Calendar snippets count
            Snippet.countDocuments({ userId: uid, isDeleted: false, showInCalendar: true })
        ]);

        return {
            overview: {
                totalSnippets,
                favoriteCount,
                trashedCount,
                calendarCount
            },
            languageBreakdown,
            tagBreakdown,
            visibilityBreakdown,
            recentSnippets
        };
    }
}

export default new DashboardService();
