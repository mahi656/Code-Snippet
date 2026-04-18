import mongoose from 'mongoose';
import Snippet from '../Snippet/snippet.model';

class SearchService {

    // Build a MongoDB query to search snippets across multiple fields.
    public buildSearchQuery(userId: string, query: string, filters: any) {
        const conditions: any[] = [
            { userId: new mongoose.Types.ObjectId(userId) }
        ];

        // Ensure we only show non-deleted snippets unless specifically searching trash
        if (filters.isDeleted !== undefined) {
            conditions.push({ isDeleted: filters.isDeleted === 'true' });
        } else {
            conditions.push({ isDeleted: false });
        }

        // Text search across title, tags, and language
        if (query) {
            const regex = new RegExp(query, 'i');
            conditions.push({
                $or: [
                    { title: regex },
                    { tags: regex },
                    { language: regex }
                ]
            });
        }

        // Optional filters
        if (filters.language) {
            conditions.push({ language: filters.language.toLowerCase() });
        }

        if (filters.framework && filters.framework !== 'none') {
            conditions.push({ framework: filters.framework.toLowerCase() });
        }

        if (filters.tag) {
            conditions.push({ tags: filters.tag.toLowerCase() });
        }

        if (filters.visibility) {
            conditions.push({ visibility: filters.visibility });
        }

        if (filters.isFavorite !== undefined) {
            conditions.push({ isFavorite: filters.isFavorite === 'true' });
        }

        return { $and: conditions };
    }

    // Execute search and return results
    public async search(userId: string, query: string, filters: any) {
        const mongoQuery = this.buildSearchQuery(userId, query, filters);

        const snippets = await Snippet.find(mongoQuery)
            .sort({ createdAt: -1 })
            .lean();

        return snippets;
    }
}

export default new SearchService();
