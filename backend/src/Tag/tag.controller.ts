import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../Auth/auth.middleware';
import Snippet from '../Snippet/snippet.model';

class TagController {

    // Get all unique tags from the user's snippets with their snippet count.
    public async getMyTags(req: AuthRequest, res: Response): Promise<void> {
        try {
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

            res.status(200).json(result);
        } catch (error) {
            console.error('Error fetching tags:', error);
            res.status(500).json({ message: 'Server error fetching tags' });
        }
    }


    //  * Get all snippets that have a specific tag.
    public async getSnippetsByTag(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            const { tagName } = req.params;

            if (!tagName) {
                res.status(400).json({ message: 'Tag name is required' });
                return;
            }

            const snippets = await Snippet.find({
                userId,
                tags: (tagName as string).toLowerCase()
            }).sort({ createdAt: -1 });

            res.status(200).json(snippets);
        } catch (error) {
            console.error('Error fetching snippets by tag:', error);
            res.status(500).json({ message: 'Server error fetching snippets by tag' });
        }
    }
}

export default new TagController();
