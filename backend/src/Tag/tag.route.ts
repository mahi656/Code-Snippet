import { Router } from 'express';
import TagController from './tag.controller';
import { authMiddleware } from '../Auth/auth.middleware';

const router = Router();

// Protect all tag routes
router.use(authMiddleware as any);

// Get all unique tags (auto-derived from snippets)
router.get('/', TagController.getMyTags);

// Get snippets filtered by tag name
router.get('/snippets/:tagName', TagController.getSnippetsByTag);

export default router;
