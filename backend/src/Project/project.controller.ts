import { Request, Response } from 'express';
import User from '../Auth/auth.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

class ProjectController {
    public getProjects = asyncHandler(async (req: any, res: Response) => {
        const user = await User.findById(req.user.id);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        res.status(200).json(new ApiResponse(200, user.projects, 'Projects fetched successfully'));
    });

    public updateProjects = asyncHandler(async (req: any, res: Response) => {
        const { projects } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { projects } },
            { new: true }
        );

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        res.status(200).json(new ApiResponse(200, user.projects, 'Projects updated successfully'));
    });
}

export default new ProjectController();
