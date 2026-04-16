import { Response } from 'express';
import { AuthRequest } from '../Auth/auth.middleware';
import UploadService from './upload.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

class UploadController {

    // Upload one or more files
    public uploadFiles = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            throw new ApiError(400, 'No files uploaded');
        }

        const files = req.files as Express.Multer.File[];
        const uploadedFiles = files.map(file => ({
            originalName: file.originalname,
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size,
            url: UploadService.getFileUrl(file.filename, UploadService.getSubfolder(file.mimetype))
        }));

        res.status(201).json(new ApiResponse(201, { files: uploadedFiles }, `${uploadedFiles.length} file(s) uploaded successfully`));
    });

    // Delete a file by filename
    public deleteFile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { filename } = req.params;

        if (!filename) {
            throw new ApiError(400, 'Filename is required');
        }

        // Try both folders
        const deletedFromFiles = UploadService.deleteFile(`/uploads/files/${filename}`);
        const deletedFromImages = UploadService.deleteFile(`/uploads/images/${filename}`);

        if (!deletedFromFiles && !deletedFromImages) {
            throw new ApiError(404, 'File not found');
        }

        res.status(200).json(new ApiResponse(200, null, 'File deleted successfully'));
    });
}

export default new UploadController();
