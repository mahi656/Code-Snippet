import { Response } from 'express';
import { AuthRequest } from '../Auth/auth.middleware';
import Snippet from './snippet.model';
import Version from '../Version/version.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

class SnippetController {

    // Helper method to check if a snippet title already exists for a user.
    private checkDuplicateTitle = async (userId: string, title: string, excludeId?: string): Promise<void> => {
        if (!title) return;

        // Escape special characters (like parentheses) so they don't break the search
        const escapedTitle = title.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Look for another snippet with the same title that hasn't been deleted
        const existingSnippet = await Snippet.findOne({
            title: { $regex: new RegExp(`^${escapedTitle}$`, 'i') },
            userId,
            isDeleted: false,
            // If we are updating, skip the current snippet we're editing
            ...(excludeId && { _id: { $ne: excludeId } })
        });

        if (existingSnippet) {
            throw new ApiError(400, `A snippet with the title "${title}" already exists`);
        }
    };


    //  CREATE: Saves a new code snippet to the database.
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

        // Validation: Every snippet MUST have a title and code
        if (!title || !code) {
            throw new ApiError(400, 'Title and code are required');
        }

        // Don't allow two snippets with the same name
        if (userId) {
            await this.checkDuplicateTitle(userId, title);
        }

        // Create the new snippet object
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
        })
        await newSnippet.save();

        // Feature: Also save this as the "Initial Version" in history
        const initialVersion = new Version({
            snippetId: newSnippet._id,
            code: newSnippet.code,
            changeNote: 'Initial Version',
            userId: userId
        });
        await initialVersion.save();

        res.status(201).json(new ApiResponse(201, { snippet: newSnippet, version: initialVersion }, 'Snippet created successfully with initial version tracked'));
    });


    //Fetches all active snippets belonging to the logged-in user.

    public getMySnippets = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user?.id
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

    // UPDATE: Modifies an existing snippet's details.

    public updateSnippet = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        const userId = req.user?.id;
        const { changeNote, ...updates } = req.body;

        // If the title is being changed, make sure the new name isn't already taken
        if (updates.title && userId) {
            await this.checkDuplicateTitle(userId, updates.title, id as string);
        }

        // Find the snippet and apply only the fields provided in 'updates'
        const snippet = await Snippet.findOneAndUpdate(
            { _id: id, userId, isDeleted: false },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!snippet) {
            throw new ApiError(404, 'Snippet not found or unauthorized');
        }

        // Feature: Automatically create a new version record for this update
        // We save the latest code state as a new version
        const newVersion = new Version({
            snippetId: snippet._id,
            code: snippet.code,
            changeNote: changeNote || 'Updated snippet details',
            userId: userId
        });
        await newVersion.save();

        res.status(200).json(new ApiResponse(200, { snippet, version: newVersion }, 'Snippet updated successfully and new version created'));
    });


    // DELETE: Moves a snippet to the trash (Soft Delete).
    // It doesn't permanently delete it yet so user can restore it from Trash.
    public deleteSnippet = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        const userId = req.user?.id;

        // Instead of deleting, we set 'isDeleted' to true and record the time
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
