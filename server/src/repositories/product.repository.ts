import Product, { type IProduct } from '../models/Product.js';
import type { CreateProductInput, UpdateProductInput } from '../types/product.types.js';
import type { QueryOptions } from '../types/common.types.js';
import type { IProductRepository } from './interfaces/product.repository.interface.js';

/**
 * Mongoose implementation of the Product repository.
 *
 * This is the only layer that directly interacts with the Mongoose model.
 * All database-specific logic (query building, population, etc.) lives here.
 */
export class ProductRepository implements IProductRepository {
    async findAll(options?: QueryOptions): Promise<IProduct[]> {
        const query = Product.find();

        if (options?.sort) {
            query.sort(options.sort);
        }
        if (options?.limit) {
            query.limit(options.limit);
        }
        if (options?.skip) {
            query.skip(options.skip);
        }

        return query.exec();
    }

    async findById(id: string): Promise<IProduct | null> {
        return Product.findById(id).exec();
    }

    async create(data: CreateProductInput): Promise<IProduct> {
        const product = new Product(data);
        return product.save();
    }

    async update(id: string, data: UpdateProductInput): Promise<IProduct | null> {
        return Product.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).exec();
    }

    async delete(id: string): Promise<IProduct | null> {
        return Product.findByIdAndDelete(id).exec();
    }
}
