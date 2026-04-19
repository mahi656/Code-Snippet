import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../Auth/auth.middleware';
import Snippet from '../Snippet/snippet.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

class TagController {

    // Get all unique tags from the user's snippets with their snippet count.
    public getMyTags = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user?.id;

        const result = await Snippet.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $unwind: '$tags' },
            {
                $group: {
                    _id: { $toLower: '$tags' },
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

        res.status(200).json(new ApiResponse(200, result, 'Tags fetched successfully'));
    });


    //  * Get all snippets that have a specific tag.
    public getSnippetsByTag = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user?.id;
        const { tagName } = req.params;

        if (!tagName) {
            throw new ApiError(400, 'Tag name is required');
        }

        const snippets = await Snippet.find({
            userId,
            tags: (tagName as string).toLowerCase(),
            isDeleted: { $ne: true }
        }).sort({ createdAt: -1 });

        res.status(200).json(new ApiResponse(200, snippets, 'Snippets fetched successfully'));
    });
}

export default new TagController();
