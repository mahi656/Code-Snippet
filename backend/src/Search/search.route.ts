import { Router } from 'express';
import SearchController from './search.controller';
import { authMiddleware } from '../Auth/auth.middleware';

const router = Router();

// Protect search routes
router.use(authMiddleware as any);

// Search snippets with query and optional filters
router.get('/', SearchController.searchSnippets);

export default router;
