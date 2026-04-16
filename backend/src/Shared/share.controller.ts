import { Request, Response } from 'express';
import { AuthRequest } from '../Auth/auth.middleware';
import Share from './share.model';
import Snippet from '../Snippet/snippet.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

class ShareController {

    // Generate a share link for a snippet
    public createShareLink = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { snippetId, expiresIn } = req.body;
        const userId = req.user?.id;

        if (!snippetId) {
            throw new ApiError(400, 'Snippet ID is required');
        }

        // Verify the snippet belongs to this user
        const snippet = await Snippet.findOne({ _id: snippetId, userId, isDeleted: false });
        if (!snippet) {
            throw new ApiError(404, 'Snippet not found');
        }

        // Check if a share link already exists
        const existing = await Share.findOne({ snippetId, userId, isActive: true });
        if (existing) {
            res.status(200).json(new ApiResponse(200, { share: existing }, 'Share link already exists'));
            return;
        }

        // Calculate expiry if provided (in hours)
        let expiresAt;
        if (expiresIn) {
            expiresAt = new Date(Date.now() + expiresIn * 60 * 60 * 1000);
        }

        const share = new Share({
            snippetId,
            userId,
            expiresAt
        });

        await share.save();

        res.status(201).json(new ApiResponse(201, { share }, 'Share link created'));
    });

    // Access a shared snippet (public — no auth required)
    public getSharedSnippet = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { token } = req.params;

        const share = await Share.findOne({ shareToken: token, isActive: true });

        if (!share) {
            throw new ApiError(404, 'Share link not found or inactive');
        }

        // Check if expired
        if (share.expiresAt && share.expiresAt < new Date()) {
            throw new ApiError(410, 'This share link has expired');
        }

        const snippet = await Snippet.findOne({ _id: share.snippetId, isDeleted: false })
            .select('title description language framework code tags createdAt');

        if (!snippet) {
            throw new ApiError(404, 'Shared snippet no longer exists');
        }

        // Increment view count
        share.viewCount += 1;
        await share.save();

        res.status(200).json(new ApiResponse(200, {
            snippet,
            viewCount: share.viewCount
        }, 'Snippet fetched successfully'));
    });

    // Get all share links created by the user
    public getMyShareLinks = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user?.id;

        const shares = await Share.find({ userId })
            .populate('snippetId', 'title language')
            .sort({ createdAt: -1 });

        res.status(200).json(new ApiResponse(200, shares, 'Share links fetched successfully'));
    });

    // Deactivate a share link
    public deactivateShareLink = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        const userId = req.user?.id;

        const share = await Share.findOneAndUpdate(
            { _id: id, userId },
            { $set: { isActive: false } },
            { new: true }
        );

        if (!share) {
            throw new ApiError(404, 'Share link not found');
        }

        res.status(200).json(new ApiResponse(200, null, 'Share link deactivated'));
    });
}

export default new ShareController();
