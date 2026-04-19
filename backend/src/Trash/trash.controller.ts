import { Response } from 'express';
import { AuthRequest } from '../Auth/auth.middleware';
import Snippet from '../Snippet/snippet.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

class TrashController {

    // Get all trashed snippets for the user
    public getTrashedSnippets = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user?.id;

        const trashed = await Snippet.find({ userId, isDeleted: true })
            .sort({ deletedAt: -1 });

        res.status(200).json(new ApiResponse(200, trashed, 'Trashed snippets fetched successfully'));
    });

    // Restore a snippet from trash
    public restoreSnippet = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        const userId = req.user?.id;

        const snippet = await Snippet.findOneAndUpdate(
            { _id: id, userId }, // Relaxed from isDeleted: true
            { $set: { isDeleted: false }, $unset: { deletedAt: '' } },
            { new: true }
        );

        if (!snippet) {
            throw new ApiError(404, 'Snippet not found or unauthorized to restore');
        }

        res.status(200).json(new ApiResponse(200, { snippet }, 'Snippet restored successfully'));
    });

    // Permanently delete a snippet from trash
    public permanentlyDelete = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        const userId = req.user?.id;

        // Relaxed query: search by ID and UserID. If it's being deleted from the Trash context,
        // we'll remove it regardless of the 'isDeleted' flag to ensure the UI stays in sync.
        const snippet = await Snippet.findOneAndDelete({ _id: id, userId });

        if (!snippet) {
            throw new ApiError(404, 'Snippet not found or unauthorized to delete');
        }

        res.status(200).json(new ApiResponse(200, null, 'Snippet permanently deleted'));
    });

    // Empty entire trash for the user
    public emptyTrash = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user?.id;

        const result = await Snippet.deleteMany({ userId, isDeleted: true });

        res.status(200).json(new ApiResponse(200, null, `Permanently deleted ${result.deletedCount} snippet(s) from trash`));
    });
}

export default new TrashController();
