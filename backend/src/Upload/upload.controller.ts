import { Response } from 'express';
import { AuthRequest } from '../Auth/auth.middleware';
import UploadService from './upload.service';

class UploadController {

    // Upload one or more files
    public async uploadFiles(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
                res.status(400).json({ message: 'No files uploaded' });
                return;
            }

            const files = req.files as Express.Multer.File[];
            const uploadedFiles = files.map(file => ({
                originalName: file.originalname,
                filename: file.filename,
                mimetype: file.mimetype,
                size: file.size,
                url: UploadService.getFileUrl(file.filename, UploadService.getSubfolder(file.mimetype))
            }));

            res.status(201).json({
                message: `${uploadedFiles.length} file(s) uploaded successfully`,
                files: uploadedFiles
            });
        } catch (error) {
            console.error('Error uploading files:', error);
            res.status(500).json({ message: 'Server error uploading files' });
        }
    }

    // Delete a file by filename
    public async deleteFile(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { filename } = req.params;

            if (!filename) {
                res.status(400).json({ message: 'Filename is required' });
                return;
            }

            // Try both folders
            const deletedFromFiles = UploadService.deleteFile(`/uploads/files/${filename}`);
            const deletedFromImages = UploadService.deleteFile(`/uploads/images/${filename}`);

            if (!deletedFromFiles && !deletedFromImages) {
                res.status(404).json({ message: 'File not found' });
                return;
            }

            res.status(200).json({ message: 'File deleted successfully' });
        } catch (error) {
            console.error('Error deleting file:', error);
            res.status(500).json({ message: 'Server error deleting file' });
        }
    }
}

export default new UploadController();
