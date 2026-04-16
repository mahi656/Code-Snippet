import { Response } from 'express';
import { AuthRequest } from '../Auth/auth.middleware';
import DashboardService from './dashboard.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

class DashboardController {

    // Get dashboard statistics for the authenticated user
    public getStats = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user?.id;

        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }

        const stats = await DashboardService.getStats(userId);

        res.status(200).json(new ApiResponse(200, stats, 'Dashboard stats fetched successfully'));
    });
}

export default new DashboardController();
