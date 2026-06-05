import { HttpStatusCode } from '../types/common.types.js';

/**
 * Custom error class for operational errors.
 *
 * Extends the native Error with an HTTP status code and an `isOperational`
 * flag so the global error handler can distinguish expected errors
 * (validation, not-found) from unexpected crashes.
 */
export class ApiError extends Error {
    public readonly statusCode: HttpStatusCode;
    public readonly isOperational: boolean;

    constructor(
        statusCode: HttpStatusCode,
        message: string,
        isOperational = true,
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        // Maintains proper prototype chain for instanceof checks
        Object.setPrototypeOf(this, new.target.prototype);

        // Captures the stack trace, excluding the constructor call
        Error.captureStackTrace(this, this.constructor);
    }

    /** Factory for 400 Bad Request errors. */
    static badRequest(message: string): ApiError {
        return new ApiError(400, message);
    }

    /** Factory for 404 Not Found errors. */
    static notFound(message: string): ApiError {
        return new ApiError(404, message);
    }

    /** Factory for 422 Unprocessable Entity errors. */
    static unprocessable(message: string): ApiError {
        return new ApiError(422, message);
    }

    /** Factory for 500 Internal Server Error. */
    static internal(message: string): ApiError {
        return new ApiError(500, message, false);
    }
}
