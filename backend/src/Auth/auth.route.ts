import { Router } from 'express';
import authController from './auth.controller';
import { authMiddleware } from './auth.middleware';

class AuthRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/signup', authController.signup);
        this.router.post('/login', authController.login);
        this.router.get('/:username', authMiddleware, authController.getUserByUsername);
    }
}

export default new AuthRoutes().router;
