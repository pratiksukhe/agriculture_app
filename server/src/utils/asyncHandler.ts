import type { Request, Response, NextFunction } from 'express';

/**
 * Wraps an async Express route handler to automatically catch
 * rejected promises and forward them to the error-handling middleware.
 *
 * Without this, every async handler needs its own try/catch block.
 *
 * @example
 * ```ts
 * router.get('/', asyncHandler(async (req, res) => {
 *     const data = await service.getAll();
 *     res.json({ success: true, data });
 * }));
 * ```
 */
export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
