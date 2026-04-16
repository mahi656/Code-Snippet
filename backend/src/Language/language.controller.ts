import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../Auth/auth.middleware';
import Snippet from '../Snippet/snippet.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

class LanguageController {

    // Get all unique languages from the user's snippets with their snippet count.
    public getMyLanguages = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user?.id;

        const result = await Snippet.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: { $toLower: '$language' },
                    snippetCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    snippetCount: 1
                }
            }
        ]);

        res.status(200).json(new ApiResponse(200, result, 'Languages fetched successfully'));
    });

    // Get all snippets that use a specific language.
    public getSnippetsByLanguage = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user?.id;
        const { languageName } = req.params;

        if (!languageName) {
            throw new ApiError(400, 'Language name is required');
        }

        const snippets = await Snippet.find({
            userId,
            language: (languageName as string).toLowerCase()
        }).sort({ createdAt: -1 });

        res.status(200).json(new ApiResponse(200, snippets, 'Snippets fetched successfully'));
    });
}

export default new LanguageController();
