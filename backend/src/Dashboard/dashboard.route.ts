import { Router } from 'express';
import DashboardController from './dashboard.controller';
import { authMiddleware } from '../Auth/auth.middleware';

const router = Router();

router.use(authMiddleware as any);

// Get all dashboard statistics
router.get('/', DashboardController.getStats);

export default router;
