import { Response } from 'express';
import { AuthRequest } from '../Auth/auth.middleware';
import Snippet from '../Snippet/snippet.model';

class TrashController {

    // Get all trashed snippets for the user
    public async getTrashedSnippets(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;

            const trashed = await Snippet.find({ userId, isDeleted: true })
                .sort({ deletedAt: -1 });

            res.status(200).json(trashed);
        } catch (error) {
            console.error('Error fetching trashed snippets:', error);
            res.status(500).json({ message: 'Server error fetching trashed snippets' });
        }
    }

    // Restore a snippet from trash
    public async restoreSnippet(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            const snippet = await Snippet.findOneAndUpdate(
                { _id: id, userId, isDeleted: true },
                { $set: { isDeleted: false }, $unset: { deletedAt: '' } },
                { new: true }
            );

            if (!snippet) {
                res.status(404).json({ message: 'Trashed snippet not found' });
                return;
            }

            res.status(200).json({
                message: 'Snippet restored successfully',
                snippet
            });
        } catch (error) {
            console.error('Error restoring snippet:', error);
            res.status(500).json({ message: 'Server error restoring snippet' });
        }
    }

    // Permanently delete a snippet from trash
    public async permanentlyDelete(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            const snippet = await Snippet.findOneAndDelete({ _id: id, userId, isDeleted: true });

            if (!snippet) {
                res.status(404).json({ message: 'Trashed snippet not found' });
                return;
            }

            res.status(200).json({ message: 'Snippet permanently deleted' });
        } catch (error) {
            console.error('Error permanently deleting snippet:', error);
            res.status(500).json({ message: 'Server error permanently deleting snippet' });
        }
    }

    // Empty entire trash for the user
    public async emptyTrash(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;

            const result = await Snippet.deleteMany({ userId, isDeleted: true });

            res.status(200).json({
                message: `Permanently deleted ${result.deletedCount} snippet(s) from trash`
            });
        } catch (error) {
            console.error('Error emptying trash:', error);
            res.status(500).json({ message: 'Server error emptying trash' });
        }
    }
}

export default new TrashController();
