import dotenv from 'dotenv';

dotenv.config();

/**
 * Centralized application configuration.
 *
 * All environment variables are read and validated here at startup.
 * The rest of the application imports from this module instead of
 * reading process.env directly.
 */
export const config = {
    port: parseInt(process.env['PORT'] ?? '5000', 10),
    mongodbUri: process.env['MONGODB_URI'] ?? 'mongodb://localhost:27017/sahyadri-agritech',
    clientUrl: process.env['CLIENT_URL'] ?? 'http://localhost:5173',

    /** Upload constraints */
    upload: {
        maxFileSizeBytes: 10 * 1024 * 1024, // 10 MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'] as const,
        allowedExtensions: /\.(jpeg|jpg|png|webp)$/i,
        directory: 'uploads',
    },

    /** Rate limiting configuration */
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100,
    },
} as const;

export type AppConfig = typeof config;
