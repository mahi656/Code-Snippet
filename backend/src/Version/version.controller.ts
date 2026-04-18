import { Response } from 'express';
import { AuthRequest } from '../Auth/auth.middleware';
import Version from './version.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

class VersionController {
    public createVersion = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { snippetId, code, changeNote } = req.body;
        const userId = req.user?.id;

        if (!snippetId || !code) {
            throw new ApiError(400, 'Snippet ID and code are required');
        }

        const newVersion = new Version({
            snippetId,
            code,
            title: req.body.title || 'Untitled Snippet',
            description: req.body.description || '',
            language: req.body.language || 'javascript',
            framework: req.body.framework || 'none',
            tags: req.body.tags || [],
            changeNote,
            userId
        });

        await newVersion.save();

        res.status(201).json(new ApiResponse(201, { version: newVersion }, 'Version created successfully'));
    });

    public getVersionsBySnippet = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { snippetId } = req.params;
        const userId = req.user?.id;

        // Fetch versions and populate the parent snippet to use for metadata fallbacks
        const versions = await Version.find({ snippetId, userId }).populate('snippetId').sort({ createdAt: -1 });
        
        // Lazy Migration: If an old version is missing metadata, fill it from the current snippet state
        const migratedVersions = versions.map(v => {
            const versionObj = v.toObject();
            const snippet = v.snippetId as any;
            
            if (snippet && !versionObj.title) {
                versionObj.title = snippet.title;
                versionObj.description = snippet.description;
                versionObj.language = snippet.language;
                versionObj.framework = snippet.framework;
                versionObj.tags = snippet.tags;
            }
            return versionObj;
        });

        res.status(200).json(new ApiResponse(200, migratedVersions, 'Versions fetched successfully with metadata fallbacks'));
    });

    public getMyVersions = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user?.id;

        // Fetch all versions for the user and populate the snippet title so we know which snippet was edited
        const versions = await Version.find({ userId })
            .populate('snippetId', 'title')
            .sort({ createdAt: -1 })
            .limit(50); // Limit to last 50 edits for performance

        res.status(200).json(new ApiResponse(200, versions, 'Global history fetched successfully'));
    });

    public getVersionById = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        const userId = req.user?.id;

        const version = await Version.findOne({ _id: id, userId });
        if (!version) {
            throw new ApiError(404, 'Version not found');
        }

        res.status(200).json(new ApiResponse(200, version, 'Version fetched successfully'));
    });

    public deleteVersion = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        const userId = req.user?.id;

        const version = await Version.findOneAndDelete({ _id: id, userId });

        if (!version) {
            throw new ApiError(404, 'Version not found or unauthorized');
        }

        res.status(200).json(new ApiResponse(200, null, 'Version deleted successfully'));
    });
}

export default new VersionController();
