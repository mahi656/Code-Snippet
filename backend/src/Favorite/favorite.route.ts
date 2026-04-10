import { Router } from 'express';
import FavoriteController from './favorite.controller';
import { authMiddleware } from '../Auth/auth.middleware';

const router = Router();

// Protect all favorite routes
router.use(authMiddleware as any);

router.post('/', FavoriteController.addFavorite);
router.get('/', FavoriteController.getMyFavorites);
router.delete('/:snippetId', FavoriteController.removeFavorite);

export default router;
