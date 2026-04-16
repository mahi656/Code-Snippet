import { Router } from 'express';
import TrashController from './trash.controller';
import { authMiddleware } from '../Auth/auth.middleware';

const router = Router();

router.use(authMiddleware as any);

// Get all trashed snippets
router.get('/', TrashController.getTrashedSnippets);

// Restore a snippet from trash
router.patch('/restore/:id', TrashController.restoreSnippet);

// Permanently delete a single snippet
router.delete('/:id', TrashController.permanentlyDelete);

// Empty entire trash
router.delete('/', TrashController.emptyTrash);

export default router;
