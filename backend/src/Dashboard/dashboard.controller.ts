import { Response } from 'express';
import { AuthRequest } from '../Auth/auth.middleware';
import DashboardService from './dashboard.service';

class DashboardController {

    // Get dashboard statistics for the authenticated user
    public async getStats(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;

            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const stats = await DashboardService.getStats(userId);

            res.status(200).json(stats);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            res.status(500).json({ message: 'Server error fetching dashboard stats' });
        }
    }
}

export default new DashboardController();
