import type { Request, Response } from 'express';
import { ProductService } from '../services/product.service.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { HttpStatus } from '../types/common.types.js';
import type { CreateProductInput, UpdateProductInput } from '../types/product.types.js';
import type { ApiSuccessResponse } from '../types/common.types.js';
import type { IProduct } from '../models/Product.js';

/**
 * Product controller — thin layer responsible for:
 * 1. Parsing HTTP request data
 * 2. Delegating to the service layer
 * 3. Formatting HTTP responses
 *
 * Contains NO business logic or direct database access.
 */

// Instantiate the service with its repository dependency
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);

/**
 * GET /api/v1/products
 * Retrieve all products.
 */
export const getAll = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const products = await productService.getAllProducts();

    const response: ApiSuccessResponse<IProduct[]> = {
        success: true,
        data: products,
    };
    res.status(HttpStatus.OK).json(response);
});

/**
 * GET /api/v1/products/:id
 * Retrieve a single product by ID.
 */
export const getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'];
    if (!id || typeof id !== 'string') {
        throw ApiError.badRequest('Missing product ID');
    }
    const product = await productService.getProductById(id);

    const response: ApiSuccessResponse<IProduct> = {
        success: true,
        data: product,
    };
    res.status(HttpStatus.OK).json(response);
});

/**
 * POST /api/v1/products
 * Create a new product.
 * Expects multipart/form-data with a 'data' JSON field and optional 'image' file.
 */
export const create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const rawData: string | undefined = req.body?.data;
    if (!rawData || typeof rawData !== 'string') {
        throw ApiError.badRequest('Missing required "data" field in form body');
    }

    let productData: CreateProductInput;
    try {
        productData = JSON.parse(rawData) as CreateProductInput;
    } catch {
        throw ApiError.badRequest('Invalid JSON in "data" field');
    }

    if (req.file) {
        productData.image = req.file.filename;
    }

    const product = await productService.createProduct(productData);

    const response: ApiSuccessResponse<IProduct> = {
        success: true,
        data: product,
        message: 'Product created successfully',
    };
    res.status(HttpStatus.CREATED).json(response);
});

/**
 * PUT /api/v1/products/:id
 * Update an existing product.
 */
export const update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const rawData: string | undefined = req.body?.data;
    if (!rawData || typeof rawData !== 'string') {
        throw ApiError.badRequest('Missing required "data" field in form body');
    }

    let productData: UpdateProductInput;
    try {
        productData = JSON.parse(rawData) as UpdateProductInput;
    } catch {
        throw ApiError.badRequest('Invalid JSON in "data" field');
    }

    if (req.file) {
        productData.image = req.file.filename;
    }

    const id = req.params['id'];
    if (!id || typeof id !== 'string') {
        throw ApiError.badRequest('Missing product ID');
    }
    const product = await productService.updateProduct(id, productData);

    const response: ApiSuccessResponse<IProduct> = {
        success: true,
        data: product,
        message: 'Product updated successfully',
    };
    res.status(HttpStatus.OK).json(response);
});

/**
 * DELETE /api/v1/products/:id
 * Delete a product and its associated image.
 */
export const remove = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'];
    if (!id || typeof id !== 'string') {
        throw ApiError.badRequest('Missing product ID');
    }
    await productService.deleteProduct(id);

    const response: ApiSuccessResponse<null> = {
        success: true,
        data: null,
        message: 'Product deleted successfully',
    };
    res.status(HttpStatus.OK).json(response);
});
