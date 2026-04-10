import { Response } from 'express';
import { AuthRequest } from '../Auth/auth.middleware';
import Favorite from './favorite.model';

class FavoriteController {
    public async addFavorite(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { snippetId } = req.body;
            const userId = req.user?.id;

            if (!snippetId) {
                res.status(400).json({ message: 'Snippet ID is required' });
                return;
            }

            // Check if already favorited to prevent duplicates
            const existingFavorite = await Favorite.findOne({ snippetId, userId });
            if (existingFavorite) {
                res.status(400).json({ message: 'Snippet is already in favorites' });
                return;
            }

            const newFavorite = new Favorite({ snippetId, userId });
            await newFavorite.save();

            res.status(201).json({
                message: 'Added to favorites successfully',
                favorite: newFavorite
            });
        } catch (error) {
            console.error('Error adding favorite:', error);
            res.status(500).json({ message: 'Server error adding favorite' });
        }
    }

    public async removeFavorite(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { snippetId } = req.params;
            const userId = req.user?.id;

            const favorite = await Favorite.findOneAndDelete({ snippetId, userId });

            if (!favorite) {
                res.status(404).json({ message: 'Favorite not found' });
                return;
            }

            res.status(200).json({ message: 'Removed from favorites successfully' });
        } catch (error) {
            console.error('Error removing favorite:', error);
            res.status(500).json({ message: 'Server error removing favorite' });
        }
    }

    public async getMyFavorites(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;

            // Fetch favorites and populate the snippet details so the frontend gets the full snippet info
            const favorites = await Favorite.find({ userId })
                .populate('snippetId')
                .sort({ createdAt: -1 });

            res.status(200).json(favorites);
        } catch (error) {
            console.error('Error fetching favorites:', error);
            res.status(500).json({ message: 'Server error fetching favorites' });
        }
    }
}

export default new FavoriteController();
