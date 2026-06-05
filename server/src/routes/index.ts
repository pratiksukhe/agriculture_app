import { Router } from 'express';
import productRoutes from './product.routes.js';

/**
 * Route aggregator — mounts all feature routes under the /api/v1 prefix.
 *
 * Adding a new resource is as simple as:
 * 1. Create a new routes file (e.g., user.routes.ts)
 * 2. Mount it here with router.use('/users', userRoutes)
 *
 * API versioning via the /v1 prefix enables backward-compatible evolution.
 */
const router = Router();

router.use('/products', productRoutes);

export default router;
