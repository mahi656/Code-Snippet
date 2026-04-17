import { Request, Response } from 'express';
import { AuthRequest } from '../Auth/auth.middleware';
import Share from './share.model';
import Snippet from '../Snippet/snippet.model';

class ShareController {

    // Generate a share link for a snippet
    public async createShareLink(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { snippetId, expiresIn } = req.body;
            const userId = req.user?.id;

            if (!snippetId) {
                res.status(400).json({ message: 'Snippet ID is required' });
                return;
            }

            // Verify the snippet belongs to this user
            const snippet = await Snippet.findOne({ _id: snippetId, userId, isDeleted: false });
            if (!snippet) {
                res.status(404).json({ message: 'Snippet not found' });
                return;
            }

            // Check if a share link already exists
            const existing = await Share.findOne({ snippetId, userId, isActive: true });
            if (existing) {
                res.status(200).json({
                    message: 'Share link already exists',
                    share: existing
                });
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

            res.status(201).json({
                message: 'Share link created',
                share
            });
        } catch (error) {
            console.error('Error creating share link:', error);
            res.status(500).json({ message: 'Server error creating share link' });
        }
    }

    // Access a shared snippet (public — no auth required)
    public async getSharedSnippet(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.params;

            const share = await Share.findOne({ shareToken: token, isActive: true });

            if (!share) {
                res.status(404).json({ message: 'Share link not found or inactive' });
                return;
            }

            // Check if expired
            if (share.expiresAt && share.expiresAt < new Date()) {
                res.status(410).json({ message: 'This share link has expired' });
                return;
            }

            const snippet = await Snippet.findOne({ _id: share.snippetId, isDeleted: false })
                .select('title description language framework code tags createdAt');

            if (!snippet) {
                res.status(404).json({ message: 'Shared snippet no longer exists' });
                return;
            }

            // Increment view count
            share.viewCount += 1;
            await share.save();

            res.status(200).json({
                snippet,
                viewCount: share.viewCount
            });
        } catch (error) {
            console.error('Error accessing shared snippet:', error);
            res.status(500).json({ message: 'Server error accessing shared snippet' });
        }
    }

    // Get all share links created by the user
    public async getMyShareLinks(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;

            const shares = await Share.find({ userId })
                .populate('snippetId', 'title language')
                .sort({ createdAt: -1 });

            res.status(200).json(shares);
        } catch (error) {
            console.error('Error fetching share links:', error);
            res.status(500).json({ message: 'Server error fetching share links' });
        }
    }

    // Deactivate a share link
    public async deactivateShareLink(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            const share = await Share.findOneAndUpdate(
                { _id: id, userId },
                { $set: { isActive: false } },
                { new: true }
            );

            if (!share) {
                res.status(404).json({ message: 'Share link not found' });
                return;
            }

            res.status(200).json({ message: 'Share link deactivated' });
        } catch (error) {
            console.error('Error deactivating share link:', error);
            res.status(500).json({ message: 'Server error deactivating share link' });
        }
    }
}

export default new ShareController();
