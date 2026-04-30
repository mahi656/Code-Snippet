import { Router } from 'express';
import projectController from './project.controller';
import { authMiddleware } from '../Auth/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', projectController.getProjects);
router.put('/', projectController.updateProjects);

export default router;
