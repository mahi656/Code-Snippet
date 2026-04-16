import { Response } from 'express';
import { AuthRequest } from '../Auth/auth.middleware';
import Snippet from './snippet.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

class SnippetController {
    public createSnippet = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
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
            throw new ApiError(400, 'Title and code are required');
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

        res.status(201).json(new ApiResponse(201, { snippet: newSnippet }, 'Snippet created successfully'));
    });

    public getMySnippets = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user?.id;
        const snippets = await Snippet.find({ userId, isDeleted: false }).sort({ createdAt: -1 });
        res.status(200).json(new ApiResponse(200, snippets, 'Snippets fetched successfully'));
    });

    public getSnippetById = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        const userId = req.user?.id;

        const snippet = await Snippet.findOne({ _id: id, userId, isDeleted: false });
        if (!snippet) {
            throw new ApiError(404, 'Snippet not found');
        }

        res.status(200).json(new ApiResponse(200, snippet, 'Snippet fetched successfully'));
    });

    public updateSnippet = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        const userId = req.user?.id;
        const updates = req.body;

        const snippet = await Snippet.findOneAndUpdate(
            { _id: id, userId, isDeleted: false },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!snippet) {
            throw new ApiError(404, 'Snippet not found or unauthorized');
        }

        res.status(200).json(new ApiResponse(200, { snippet }, 'Snippet updated successfully'));
    });

    // Soft-delete: moves snippet to trash instead of permanent deletion
    public deleteSnippet = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        const userId = req.user?.id;

        const snippet = await Snippet.findOneAndUpdate(
            { _id: id, userId, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: new Date() } },
            { new: true }
        );

        if (!snippet) {
            throw new ApiError(404, 'Snippet not found or unauthorized');
        }

        res.status(200).json(new ApiResponse(200, null, 'Snippet moved to trash'));
    });
}

export default new SnippetController();
