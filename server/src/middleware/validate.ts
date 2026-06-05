import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema, ZodError } from 'zod';
import type { ApiErrorResponse } from '../types/common.types.js';

/**
 * Creates a validation middleware from a Zod schema.
 *
 * Parses the request body against the provided schema.
 * On success, replaces `req.body` with the validated (and transformed) data.
 * On failure, returns a 422 response with structured error details.
 *
 * @param schema - A Zod schema to validate req.body against
 *
 * @example
 * ```ts
 * router.post('/', validate(createProductSchema), controller.create);
 * ```
 */
export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const zodError: ZodError = result.error;

            const errors: Record<string, string[]> = {};
            for (const issue of zodError.issues) {
                const path = issue.path.join('.') || '_root';
                if (!errors[path]) {
                    errors[path] = [];
                }
                errors[path].push(issue.message);
            }

            const response: ApiErrorResponse = {
                success: false,
                message: 'Validation failed',
                errors,
            };

            res.status(422).json(response);
            return;
        }

        // Replace body with validated + transformed data
        req.body = result.data;
        next();
    };
};
