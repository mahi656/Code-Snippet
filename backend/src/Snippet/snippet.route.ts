import { Router } from 'express';
import SnippetController from './snippet.controller';
import { authMiddleware } from '../Auth/auth.middleware';

const router = Router();

// All snippet routes are protected
router.use(authMiddleware as any);

router.post('/', SnippetController.createSnippet);
router.get('/', SnippetController.getMySnippets);
router.get('/:id', SnippetController.getSnippetById);
router.put('/:id', SnippetController.updateSnippet);
router.delete('/:id', SnippetController.deleteSnippet);

export default router;
