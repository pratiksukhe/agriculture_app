import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import mongoose from 'mongoose';
import { config } from './config/index.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import type { ApiSuccessResponse } from './types/common.types.js';

/**
 * Creates and configures the Express application.
 *
 * Separated from server startup (index.ts) so the app can be:
 * - Imported in integration tests without starting the HTTP server
 * - Configured differently per environment
 * - Used with Supertest for API testing
 */
export const createApp = (): express.Application => {
    const app = express();

    // ─── Security Middleware ────────────────────────────────────────
    app.use(helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        crossOriginEmbedderPolicy: false,
    }));

    const corsOrigin = config.clientUrl === '*' ? true : config.clientUrl;
    app.use(cors({ origin: corsOrigin }));

    app.use(
        rateLimit({
            windowMs: config.rateLimit.windowMs,
            max: config.rateLimit.maxRequests,
            standardHeaders: true,
            legacyHeaders: false,
        }),
    );

    // ─── Body Parsing ──────────────────────────────────────────────
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // ─── Static Files ──────────────────────────────────────────────
    app.use(
        '/uploads',
        express.static(path.join(process.cwd(), config.upload.directory)),
    );

    // ─── API Routes (versioned) ────────────────────────────────────
    app.use('/api/v1', apiRoutes);

    // Backward compatibility: also mount on /api for existing clients
    app.use('/api', apiRoutes);

    // ─── Health Check ──────────────────────────────────────────────
    app.get('/api/health', (_req, res) => {
        const dbConnected = mongoose.connection.readyState === 1;
        const response: ApiSuccessResponse<{ db: boolean }> = {
            success: true,
            data: {
                db: dbConnected,
            },
            message: dbConnected ? 'All systems operational' : 'Database disconnected',
        };
        res.status(dbConnected ? 200 : 503).json(response);
    });

    // ─── Global Error Handler (must be last) ───────────────────────
    app.use(errorHandler);

    return app;
};
