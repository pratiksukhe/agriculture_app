import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import type { ApiErrorResponse } from '../types/common.types.js';

/**
 * Global error-handling middleware for Express.
 *
 * This MUST be registered after all routes. Express identifies error handlers
 * by the 4-parameter signature (err, req, res, next).
 *
 * Responsibilities:
 * - Distinguish operational errors (ApiError) from unexpected crashes
 * - Sanitize error responses so internal details are never leaked to clients
 * - Log unexpected errors for debugging
 */
export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    // Handle known operational errors
    if (err instanceof ApiError) {
        const response: ApiErrorResponse = {
            success: false,
            message: err.message,
        };
        res.status(err.statusCode).json(response);
        return;
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        const response: ApiErrorResponse = {
            success: false,
            message: 'Validation failed',
        };
        res.status(400).json(response);
        return;
    }

    // Handle Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        const response: ApiErrorResponse = {
            success: false,
            message: 'Invalid resource ID format',
        };
        res.status(400).json(response);
        return;
    }

    // Handle JSON parse errors
    if (err instanceof SyntaxError && 'body' in err) {
        const response: ApiErrorResponse = {
            success: false,
            message: 'Invalid JSON in request body',
        };
        res.status(400).json(response);
        return;
    }

    // Unexpected errors — log and send generic message
    console.error('💥 Unexpected error:', err);

    const response: ApiErrorResponse = {
        success: false,
        message: 'An unexpected error occurred',
    };
    res.status(500).json(response);
};
