/**
 * Common type definitions shared across the server application.
 */

/** Standard API response wrapper for successful responses. */
export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
    message?: string;
}

/** Standard API response wrapper for error responses. */
export interface ApiErrorResponse {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
}

/** Union type for all API responses. */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/** Options for querying collections. */
export interface QueryOptions {
    sort?: Record<string, 1 | -1>;
    limit?: number;
    skip?: number;
}

/** HTTP status codes used throughout the application. */
export const HttpStatus = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatusCode = (typeof HttpStatus)[keyof typeof HttpStatus];
