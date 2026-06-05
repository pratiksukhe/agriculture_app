import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';
import { uploadProductImage } from '../middleware/upload.js';

/**
 * Product routes.
 *
 * This file contains ONLY route definitions — no business logic,
 * no middleware configuration, no database access.
 *
 * Route → Controller → Service → Repository
 */
const router = Router();

/** GET /api/v1/products — List all products */
router.get('/', productController.getAll);

/** GET /api/v1/products/:id — Get single product */
router.get('/:id', productController.getById);

/** POST /api/v1/products — Create a new product */
router.post('/', uploadProductImage, productController.create);

/** PUT /api/v1/products/:id — Update a product */
router.put('/:id', uploadProductImage, productController.update);

/** DELETE /api/v1/products/:id — Delete a product */
router.delete('/:id', productController.remove);

export default router;
