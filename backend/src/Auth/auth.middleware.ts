import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';

export interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}

export const authMiddleware = (req: any, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return next(new ApiError(401, 'No token, authorization denied'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123') as { user: { id: string } };
        req.user = decoded.user;
        next();
    } catch (error) {
        next(new ApiError(401, 'Token is not valid'));
    }
};
