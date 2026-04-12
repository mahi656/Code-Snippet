import { Response } from 'express';
import { AuthRequest } from '../Auth/auth.middleware';
import Version from './version.model';

class VersionController {
    public async createVersion(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { snippetId, code, changeNote } = req.body;
            const userId = req.user?.id;

            if (!snippetId || !code) {
                res.status(400).json({ message: 'Snippet ID and code are required' });
                return;
            }

            const newVersion = new Version({
                snippetId,
                code,
                changeNote,
                userId
            });

            await newVersion.save();

            res.status(201).json({
                message: 'Version created successfully',
                version: newVersion
            });
        } catch (error) {
            console.error('Error creating version:', error);
            res.status(500).json({ message: 'Server error creating version' });
        }
    }

    public async getVersionsBySnippet(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { snippetId } = req.params;
            const userId = req.user?.id;

            const versions = await Version.find({ snippetId, userId }).sort({ createdAt: -1 });
            res.status(200).json(versions);
        } catch (error) {
            console.error('Error fetching versions:', error);
            res.status(500).json({ message: 'Server error fetching versions' });
        }
    }

    public async getVersionById(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            const version = await Version.findOne({ _id: id, userId });
            if (!version) {
                res.status(404).json({ message: 'Version not found' });
                return;
            }

            res.status(200).json(version);
        } catch (error) {
            console.error('Error fetching version:', error);
            res.status(500).json({ message: 'Server error fetching version' });
        }
    }

    public async deleteVersion(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            const version = await Version.findOneAndDelete({ _id: id, userId });

            if (!version) {
                res.status(404).json({ message: 'Version not found or unauthorized' });
                return;
            }

            res.status(200).json({ message: 'Version deleted successfully' });
        } catch (error) {
            console.error('Error deleting version:', error);
            res.status(500).json({ message: 'Server error deleting version' });
        }
    }
}

export default new VersionController();
