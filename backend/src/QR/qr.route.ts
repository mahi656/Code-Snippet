import { Router } from 'express';
import qrController from './qr.controller';
import { authMiddleware } from '../Auth/auth.middleware';

const router = Router();

// Public routes for the primary device (browser)
router.get('/config', qrController.getConfig);
router.post('/generate', qrController.generate);
router.get('/status/:token', qrController.checkStatus);

// Private route for the secondary device (mobile browser)
// Requires the user to be logged in on the scanning device
router.post('/verify', authMiddleware, qrController.verify);

export default router;
