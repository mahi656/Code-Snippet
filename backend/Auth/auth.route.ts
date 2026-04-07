import { Router } from 'express';
import authController from './auth.controller';

class AuthRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/signup', authController.signup);
        this.router.post('/login', authController.login);
    }
}

export default new AuthRoutes().router;
