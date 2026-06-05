import type { IProduct } from '../../models/Product.js';
import type { CreateProductInput, UpdateProductInput } from '../../types/product.types.js';
import type { QueryOptions } from '../../types/common.types.js';

/**
 * Repository interface for Product data access.
 *
 * This abstraction allows the service layer to remain database-agnostic.
 * The concrete implementation uses Mongoose, but could be swapped for
 * any other data source (SQL, in-memory, etc.) without changing the
 * service or controller layers.
 *
 * Follows the Dependency Inversion Principle (DIP):
 * High-level modules (services) depend on this abstraction,
 * not on the concrete Mongoose implementation.
 */
export interface IProductRepository {
    /** Retrieve all products, with optional sorting/pagination. */
    findAll(options?: QueryOptions): Promise<IProduct[]>;

    /** Find a single product by its ID. Returns null if not found. */
    findById(id: string): Promise<IProduct | null>;

    /** Create a new product from the given input data. */
    create(data: CreateProductInput): Promise<IProduct>;

    /** Update an existing product. Returns null if not found. */
    update(id: string, data: UpdateProductInput): Promise<IProduct | null>;

    /** Delete a product by ID. Returns the deleted document or null. */
    delete(id: string): Promise<IProduct | null>;
}
