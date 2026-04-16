import { Router } from 'express';
import VersionController from './version.controller';
import { authMiddleware } from '../Auth/auth.middleware';

const router = Router();

// All version routes are protected
router.use(authMiddleware as any);

router.post('/', VersionController.createVersion);
router.get('/snippets/:snippetId', VersionController.getVersionsBySnippet);
router.get('/:id', VersionController.getVersionById);
router.delete('/:id', VersionController.deleteVersion);

export default router;
