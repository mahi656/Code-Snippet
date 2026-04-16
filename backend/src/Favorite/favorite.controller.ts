import { Response } from 'express';
import { AuthRequest } from '../Auth/auth.middleware';
import Favorite from './favorite.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

class FavoriteController {
    public addFavorite = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { snippetId } = req.body;
        const userId = req.user?.id;

        if (!snippetId) {
            throw new ApiError(400, 'Snippet ID is required');
        }

        // Check if already favorited to prevent duplicates
        const existingFavorite = await Favorite.findOne({ snippetId, userId });
        if (existingFavorite) {
            throw new ApiError(400, 'Snippet is already in favorites');
        }

        const newFavorite = new Favorite({ snippetId, userId });
        await newFavorite.save();

        res.status(201).json(new ApiResponse(201, { favorite: newFavorite }, 'Added to favorites successfully'));
    });

    public removeFavorite = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { snippetId } = req.params;
        const userId = req.user?.id;

        const favorite = await Favorite.findOneAndDelete({ snippetId, userId });

        if (!favorite) {
            throw new ApiError(404, 'Favorite not found');
        }

        res.status(200).json(new ApiResponse(200, null, 'Removed from favorites successfully'));
    });

    public getMyFavorites = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user?.id;

        // Fetch favorites and populate the snippet details so the frontend gets the full snippet info
        const favorites = await Favorite.find({ userId })
            .populate('snippetId')
            .sort({ createdAt: -1 });

        res.status(200).json(new ApiResponse(200, favorites, 'Favorites fetched successfully'));
    });
}

export default new FavoriteController();
