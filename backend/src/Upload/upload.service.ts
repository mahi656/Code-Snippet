import fs from 'fs';
import path from 'path';
import { Request } from 'express';

class UploadService {
    private uploadDir: string;

    constructor() {
        // Store uploads in backend/uploads/
        this.uploadDir = path.resolve(__dirname, '../../uploads');
        this.ensureDirectories();
    }

    // Create upload directories if they don't exist
    private ensureDirectories(): void {
        const dirs = [
            this.uploadDir,
            path.join(this.uploadDir, 'images'),
            path.join(this.uploadDir, 'files'),
            path.join(this.uploadDir, 'temp')
        ];

        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    // Get the file URL path for a stored file
    public getFileUrl(filename: string, subfolder: string = 'files'): string {
        return `/uploads/${subfolder}/${filename}`;
    }

    // Delete a file from disk
    public deleteFile(filePath: string): boolean {
        try {
            const fullPath = path.resolve(__dirname, '../..', filePath.replace(/^\//, ''));
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }

    // Determine subfolder based on file mime type
    public getSubfolder(mimetype: string): string {
        if (mimetype.startsWith('image/')) return 'images';
        return 'files';
    }
}

export default new UploadService();
