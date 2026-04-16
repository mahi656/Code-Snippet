import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = err;

    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        error = new ApiError(statusCode, message, error?.errors || [], error.stack);
    }

    res.status(error.statusCode).json({
        success: error.success,
        message: error.message,
        errors: error.errors,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
};
