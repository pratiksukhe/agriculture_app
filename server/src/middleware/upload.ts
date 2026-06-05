import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from '../config/index.js';

/**
 * Multer configuration for handling file uploads.
 *
 * Extracted from the routes file to follow SRP — upload configuration
 * is infrastructure concern, not route logic.
 */

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        const uploadDir = path.join(process.cwd(), config.upload.directory);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `product-${uniqueSuffix}${ext}`);
    },
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
    const extValid = config.upload.allowedExtensions.test(
        path.extname(file.originalname).toLowerCase(),
    );
    const mimeValid = (config.upload.allowedMimeTypes as readonly string[]).includes(
        file.mimetype,
    );

    if (extValid && mimeValid) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (jpg, png, webp) are allowed'));
    }
};

/** Configured multer instance for single product image uploads. */
export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: config.upload.maxFileSizeBytes },
});

/** Middleware for uploading a single product image. */
export const uploadProductImage = upload.single('image');
