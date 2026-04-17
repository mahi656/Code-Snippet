import { Router } from 'express';
import ShareController from './share.controller';
import { authMiddleware } from '../Auth/auth.middleware';

const router = Router();

// Public route — no auth needed to view a shared snippet
router.get('/public/:token', ShareController.getSharedSnippet);

// Protected routes
router.use(authMiddleware as any);

// Create a share link
router.post('/', ShareController.createShareLink);

// Get all my share links
router.get('/', ShareController.getMyShareLinks);

// Deactivate a share link
router.patch('/:id/deactivate', ShareController.deactivateShareLink);

export default router;
