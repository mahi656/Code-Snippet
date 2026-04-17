import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authMiddleware } from '../Auth/auth.middleware';
import UploadController from './upload.controller';

// Configure multer storage
const storage = multer.diskStorage({
    destination: (_req, file, cb) => {
        const subfolder = file.mimetype.startsWith('image/') ? 'images' : 'files';
        cb(null, path.resolve(__dirname, `../../uploads/${subfolder}`));
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (_req, file, cb) => {
        // Allow common file types
        const allowed = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
            'application/pdf', 'text/plain', 'text/csv',
            'application/json', 'application/zip',
            'application/javascript', 'text/typescript',
            'text/html', 'text/css', 'text/markdown'
        ];
        if (allowed.includes(file.mimetype) || file.mimetype.startsWith('text/')) {
            cb(null, true);
        } else {
            cb(new Error(`File type ${file.mimetype} is not allowed`));
        }
    }
});

const router = Router();

router.use(authMiddleware as any);

// Upload up to 5 files at once
router.post('/', upload.array('files', 5), UploadController.uploadFiles);

// Delete a file
router.delete('/:filename', UploadController.deleteFile);

export default router;
