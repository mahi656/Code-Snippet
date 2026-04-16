import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../Auth/auth.middleware';
import Snippet from '../Snippet/snippet.model';

class LanguageController {

    // Get all unique languages from the user's snippets with their snippet count.
    public async getMyLanguages(req: AuthRequest, res: Response): Promise<void> {
        try {
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

            res.status(200).json(result);
        } catch (error) {
            console.error('Error fetching languages:', error);
            res.status(500).json({ message: 'Server error fetching languages' });
        }
    }

    // Get all snippets that use a specific language.
    public async getSnippetsByLanguage(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            const { languageName } = req.params;

            if (!languageName) {
                res.status(400).json({ message: 'Language name is required' });
                return;
            }

            const snippets = await Snippet.find({
                userId,
                language: (languageName as string).toLowerCase()
            }).sort({ createdAt: -1 });

            res.status(200).json(snippets);
        } catch (error) {
            console.error('Error fetching snippets by language:', error);
            res.status(500).json({ message: 'Server error fetching snippets by language' });
        }
    }
}

export default new LanguageController();
