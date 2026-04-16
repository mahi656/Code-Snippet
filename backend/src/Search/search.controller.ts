import { Response } from 'express';
import { AuthRequest } from '../Auth/auth.middleware';
import SearchService from './search.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

class SearchController {

    // Search snippets by query string across multiple fields.
    // GET /api/search?q=react&language=javascript&framework=nextjs&tag=hooks&visibility=private&isFavorite=true
    public searchSnippets = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user?.id;

        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
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
            throw new ApiError(400, 'Search query or at least one filter is required');
        }

        const results = await SearchService.search(userId, query, filters);

        res.status(200).json(new ApiResponse(200, {
            count: results.length,
            results
        }, 'Search completed successfully'));
    });
}

export default new SearchController();
