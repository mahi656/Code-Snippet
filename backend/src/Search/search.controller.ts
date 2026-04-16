import { Response } from 'express';
import { AuthRequest } from '../Auth/auth.middleware';
import SearchService from './search.service';

class SearchController {

    // Search snippets by query string across multiple fields.
    // GET /api/search?q=react&language=javascript&framework=nextjs&tag=hooks&visibility=private&isFavorite=true
    public async searchSnippets(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;

            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const query = (req.query.q as string) || '';
            const filters = {
                language: req.query.language as string,
                framework: req.query.framework as string,
                tag: req.query.tag as string,
                visibility: req.query.visibility as string,
                isFavorite: req.query.isFavorite as string
            };

            // At least a query or one filter is required
            const hasFilter = Object.values(filters).some(v => v !== undefined);
            if (!query && !hasFilter) {
                res.status(400).json({ message: 'Search query or at least one filter is required' });
                return;
            }

            const results = await SearchService.search(userId, query, filters);

            res.status(200).json({
                count: results.length,
                results
            });
        } catch (error) {
            console.error('Error searching snippets:', error);
            res.status(500).json({ message: 'Server error searching snippets' });
        }
    }
}

export default new SearchController();
