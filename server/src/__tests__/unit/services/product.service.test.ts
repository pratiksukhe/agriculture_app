import { jest } from '@jest/globals';
import { ProductService } from '../../../services/product.service';
import type { IProductRepository } from '../../../repositories/interfaces/product.repository.interface';
import type { IProduct } from '../../../models/Product';
import { ApiError } from '../../../utils/ApiError';

/**
 * Unit tests for ProductService.
 *
 * The service is tested with a fully mocked repository,
 * demonstrating the value of the DIP — no database needed.
 */

// Factory for creating a mock product document
const createMockProduct = (overrides: Partial<IProduct> = {}): IProduct =>
    ({
        _id: '507f1f77bcf86cd799439011',
        name: 'Test Product',
        tagline: 'Test Tagline',
        description: 'Test description',
        manufacturer: {
            name: 'Test Mfg',
            address: '123 Test St',
            licenseNo: 'TEST123',
            licenseIssuedBy: 'Test Authority',
        },
        composition: [{ name: 'Component A', percentage: '50%', note: '' }],
        pH: '7',
        bulkDensity: '0.9',
        recommendations: ['Mix well'],
        crops: ['Wheat'],
        image: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    }) as unknown as IProduct;

// Factory for creating a mock repository
const createMockRepo = (): jest.Mocked<IProductRepository> => ({
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
});

describe('ProductService', () => {
    let service: ProductService;
    let mockRepo: jest.Mocked<IProductRepository>;

    beforeEach(() => {
        mockRepo = createMockRepo();
        service = new ProductService(mockRepo);
    });

    // ─── getAllProducts ──────────────────────────────────────────

    describe('getAllProducts', () => {
        it('should return all products sorted by createdAt desc', async () => {
            const products = [createMockProduct({ name: 'A' }), createMockProduct({ name: 'B' })];
            mockRepo.findAll.mockResolvedValue(products);

            const result = await service.getAllProducts();

            expect(result).toHaveLength(2);
            expect(mockRepo.findAll).toHaveBeenCalledWith({ sort: { createdAt: -1 } });
        });

        it('should return empty array when no products exist', async () => {
            mockRepo.findAll.mockResolvedValue([]);

            const result = await service.getAllProducts();

            expect(result).toEqual([]);
        });
    });

    // ─── getProductById ─────────────────────────────────────────

    describe('getProductById', () => {
        it('should return the product when found', async () => {
            const product = createMockProduct();
            mockRepo.findById.mockResolvedValue(product);

            const result = await service.getProductById('507f1f77bcf86cd799439011');

            expect(result).toEqual(product);
            expect(mockRepo.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
        });

        it('should throw ApiError 404 when product not found', async () => {
            mockRepo.findById.mockResolvedValue(null);

            await expect(service.getProductById('nonexistent'))
                .rejects
                .toThrow(ApiError);

            try {
                await service.getProductById('nonexistent');
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).statusCode).toBe(404);
            }
        });
    });

    // ─── createProduct ──────────────────────────────────────────

    describe('createProduct', () => {
        it('should create and return a new product', async () => {
            const input = {
                name: 'New Product',
                tagline: 'New Tagline',
                description: 'New description',
                manufacturer: {
                    name: 'Mfg',
                    address: 'Addr',
                    licenseNo: 'LIC',
                    licenseIssuedBy: 'Auth',
                },
                composition: [{ name: 'Comp', percentage: '100%' }],
                recommendations: ['Use well'],
                crops: ['Rice'],
            };
            const created = createMockProduct(input);
            mockRepo.create.mockResolvedValue(created);

            const result = await service.createProduct(input);

            expect(result.name).toBe('New Product');
            expect(mockRepo.create).toHaveBeenCalledWith(input);
        });
    });

    // ─── updateProduct ──────────────────────────────────────────

    describe('updateProduct', () => {
        it('should update and return the product', async () => {
            const updated = createMockProduct({ name: 'Updated Name' });
            mockRepo.update.mockResolvedValue(updated);

            const result = await service.updateProduct('507f1f77bcf86cd799439011', {
                name: 'Updated Name',
            });

            expect(result.name).toBe('Updated Name');
        });

        it('should throw ApiError 404 when product not found', async () => {
            mockRepo.update.mockResolvedValue(null);

            await expect(service.updateProduct('nonexistent', { name: 'X' }))
                .rejects
                .toThrow(ApiError);
        });
    });

    // ─── deleteProduct ──────────────────────────────────────────

    describe('deleteProduct', () => {
        it('should delete the product successfully', async () => {
            const product = createMockProduct();
            mockRepo.delete.mockResolvedValue(product);

            await expect(service.deleteProduct('507f1f77bcf86cd799439011'))
                .resolves
                .toBeUndefined();
            expect(mockRepo.delete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
        });

        it('should throw ApiError 404 when product not found', async () => {
            mockRepo.delete.mockResolvedValue(null);

            await expect(service.deleteProduct('nonexistent'))
                .rejects
                .toThrow(ApiError);
        });
    });
});
