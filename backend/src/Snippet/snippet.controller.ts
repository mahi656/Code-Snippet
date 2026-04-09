import { Response } from 'express';
import { AuthRequest } from '../Auth/auth.middleware';
import Snippet from './snippet.model';

class SnippetController {
    public async createSnippet(req: AuthRequest, res: Response): Promise<void> {
        try {
            const {
                title,
                description,
                language,
                framework,
                visibility,
                dependencies,
                code,
                tags,
                isFavorite,
                showInCalendar,
                calendarDate,
                changeNote,
                attachments
            } = req.body;

            const userId = req.user?.id;

            if (!title || !code) {
                res.status(400).json({ message: 'Title and code are required' });
                return;
            }

            const newSnippet = new Snippet({
                title,
                description,
                language,
                framework,
                visibility,
                dependencies,
                code,
                tags,
                isFavorite,
                showInCalendar,
                calendarDate,
                changeNote,
                attachments,
                userId
            });

            await newSnippet.save();

            res.status(201).json({
                message: 'Snippet created successfully',
                snippet: newSnippet
            });
        } catch (error) {
            console.error('Error creating snippet:', error);
            res.status(500).json({ message: 'Server error creating snippet' });
        }
    }

    public async getMySnippets(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            const snippets = await Snippet.find({ userId }).sort({ createdAt: -1 });
            res.status(200).json(snippets);
        } catch (error) {
            console.error('Error fetching snippets:', error);
            res.status(500).json({ message: 'Server error fetching snippets' });
        }
    }

    public async getSnippetById(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            const snippet = await Snippet.findOne({ _id: id, userId });
            if (!snippet) {
                res.status(404).json({ message: 'Snippet not found' });
                return;
            }

            res.status(200).json(snippet);
        } catch (error) {
            console.error('Error fetching snippet:', error);
            res.status(500).json({ message: 'Server error fetching snippet' });
        }
    }

    public async updateSnippet(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            const updates = req.body;

            const snippet = await Snippet.findOneAndUpdate(
                { _id: id, userId },
                { $set: updates },
                { new: true, runValidators: true }
            );

            if (!snippet) {
                res.status(404).json({ message: 'Snippet not found or unauthorized' });
                return;
            }

            res.status(200).json({
                message: 'Snippet updated successfully',
                snippet
            });
        } catch (error) {
            console.error('Error updating snippet:', error);
            res.status(500).json({ message: 'Server error updating snippet' });
        }
    }

    public async deleteSnippet(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            const snippet = await Snippet.findOneAndDelete({ _id: id, userId });

            if (!snippet) {
                res.status(404).json({ message: 'Snippet not found or unauthorized' });
                return;
            }

            res.status(200).json({ message: 'Snippet deleted successfully' });
        } catch (error) {
            console.error('Error deleting snippet:', error);
            res.status(500).json({ message: 'Server error deleting snippet' });
        }
    }
}

export default new SnippetController();
