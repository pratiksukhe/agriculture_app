import fs from 'fs/promises';
import path from 'path';
import type { IProduct } from '../models/Product.js';
import type { IProductRepository } from '../repositories/interfaces/product.repository.interface.js';
import type { CreateProductInput, UpdateProductInput } from '../types/product.types.js';
import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/index.js';

/**
 * Product service — contains all business logic for product operations.
 *
 * This layer orchestrates between the repository (data access) and
 * the controller (HTTP handling). It is responsible for:
 * - Enforcing business rules
 * - Orchestrating multi-step operations (e.g., delete product + clean up image)
 * - Throwing domain-specific errors (via ApiError)
 *
 * The service depends on the IProductRepository interface (not the concrete
 * Mongoose implementation), making it testable with mock repositories.
 */
export class ProductService {
    constructor(private readonly productRepo: IProductRepository) {}

    /**
     * Retrieve all products, sorted by creation date (newest first).
     */
    async getAllProducts(): Promise<IProduct[]> {
        return this.productRepo.findAll({ sort: { createdAt: -1 } });
    }

    /**
     * Retrieve a single product by ID.
     * @throws ApiError (404) if the product does not exist.
     */
    async getProductById(id: string): Promise<IProduct> {
        const product = await this.productRepo.findById(id);
        if (!product) {
            throw ApiError.notFound(`Product with id '${id}' not found`);
        }
        return product;
    }

    /**
     * Create a new product.
     */
    async createProduct(data: CreateProductInput): Promise<IProduct> {
        return this.productRepo.create(data);
    }

    /**
     * Update an existing product by ID.
     * @throws ApiError (404) if the product does not exist.
     */
    async updateProduct(id: string, data: UpdateProductInput): Promise<IProduct> {
        const product = await this.productRepo.update(id, data);
        if (!product) {
            throw ApiError.notFound(`Product with id '${id}' not found`);
        }
        return product;
    }

    /**
     * Delete a product and clean up its associated image file.
     * @throws ApiError (404) if the product does not exist.
     */
    async deleteProduct(id: string): Promise<void> {
        const product = await this.productRepo.delete(id);
        if (!product) {
            throw ApiError.notFound(`Product with id '${id}' not found`);
        }

        // Clean up the associated image file (if any)
        if (product.image) {
            await this.removeImageFile(product.image);
        }
    }

    /**
     * Safely removes an image file from the uploads directory.
     * Silently ignores if the file doesn't exist (idempotent).
     */
    private async removeImageFile(filename: string): Promise<void> {
        const imagePath = path.join(process.cwd(), config.upload.directory, filename);
        try {
            await fs.access(imagePath);
            await fs.unlink(imagePath);
        } catch {
            // File doesn't exist — no action needed
        }
    }
}
