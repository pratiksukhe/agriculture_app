import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { createApp } from '../../app';
import Product from '../../models/Product';

/**
 * Integration tests for the Product API routes.
 *
 * Uses mongodb-memory-server for an isolated, in-process database.
 * Uses supertest to send HTTP requests without starting a real server.
 *
 * This validates the full request lifecycle:
 * Route → Controller → Service → Repository → MongoDB
 */

let mongoServer: MongoMemoryServer;
const app = createApp();
const request = supertest(app);

const validProductPayload = {
    name: 'Integration Test Product',
    tagline: 'Test Tagline',
    description: 'A product for integration testing.',
    manufacturer: {
        name: 'Test Manufacturer',
        address: '123 Test Road',
        licenseNo: 'TEST-LIC-001',
        licenseIssuedBy: 'Test Authority',
    },
    composition: [
        { name: 'Component A', percentage: '60%', note: 'by weight' },
        { name: 'Component B', percentage: '40%', note: '' },
    ],
    pH: '6.5',
    bulkDensity: '0.85',
    recommendations: ['Apply 5kg per acre', 'Mix with water'],
    crops: ['Wheat', 'Rice'],
};

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await Product.deleteMany({});
});

describe('GET /api/v1/products', () => {
    it('should return empty array when no products exist', async () => {
        const res = await request.get('/api/v1/products');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual([]);
    });

    it('should return all products', async () => {
        await Product.create(validProductPayload);
        await Product.create({ ...validProductPayload, name: 'Second Product' });

        const res = await request.get('/api/v1/products');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveLength(2);
    });
});

describe('GET /api/v1/products/:id', () => {
    it('should return a product by ID', async () => {
        const product = await Product.create(validProductPayload);
        const id = String(product._id);

        const res = await request.get(`/api/v1/products/${id}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('Integration Test Product');
    });

    it('should return 400 for invalid ID format', async () => {
        const res = await request.get('/api/v1/products/invalid-id');

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('should return 404 for non-existent product', async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();

        const res = await request.get(`/api/v1/products/${fakeId}`);

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });
});

describe('POST /api/v1/products', () => {
    it('should create a new product', async () => {
        const res = await request
            .post('/api/v1/products')
            .field('data', JSON.stringify(validProductPayload));

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('Integration Test Product');
        expect(res.body.message).toBe('Product created successfully');

        // Verify it was persisted
        const count = await Product.countDocuments();
        expect(count).toBe(1);
    });

    it('should return 400 when data field is missing', async () => {
        const res = await request
            .post('/api/v1/products')
            .send({});

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid JSON in data field', async () => {
        const res = await request
            .post('/api/v1/products')
            .field('data', '{ invalid json }');

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });
});

describe('PUT /api/v1/products/:id', () => {
    it('should update an existing product', async () => {
        const product = await Product.create(validProductPayload);
        const id = String(product._id);

        const updateData = { ...validProductPayload, name: 'Updated Product Name' };

        const res = await request
            .put(`/api/v1/products/${id}`)
            .field('data', JSON.stringify(updateData));

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('Updated Product Name');
    });

    it('should return 404 when updating non-existent product', async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();

        const res = await request
            .put(`/api/v1/products/${fakeId}`)
            .field('data', JSON.stringify(validProductPayload));

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });
});

describe('DELETE /api/v1/products/:id', () => {
    it('should delete an existing product', async () => {
        const product = await Product.create(validProductPayload);
        const id = String(product._id);

        const res = await request.delete(`/api/v1/products/${id}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);

        // Verify it was deleted
        const count = await Product.countDocuments();
        expect(count).toBe(0);
    });

    it('should return 404 when deleting non-existent product', async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();

        const res = await request.delete(`/api/v1/products/${fakeId}`);

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });
});

describe('GET /api/health', () => {
    it('should return healthy status when DB is connected', async () => {
        const res = await request.get('/api/health');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.db).toBe(true);
    });
});

describe('Backward Compatibility (api/ without v1)', () => {
    it('should serve products on /api/products as well', async () => {
        await Product.create(validProductPayload);

        const res = await request.get('/api/products');

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
    });
});
