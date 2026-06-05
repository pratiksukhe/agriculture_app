import { createProductSchema, updateProductSchema } from '../../../validators/product.validator';

/**
 * Unit tests for product validation schemas.
 *
 * Tests that Zod schemas correctly accept valid inputs
 * and reject invalid inputs with appropriate error messages.
 */

const validProductInput = {
    name: 'The Great Samrat',
    tagline: 'NPK Microbial Consortia',
    description: 'A product that releases organic acids and growth hormones.',
    manufacturer: {
        name: 'Sahyadri Agritech',
        address: 'C103, MIDC, Musalgaon',
        licenseNo: 'LCBWD0220260078',
        licenseIssuedBy: 'Central Government of Maharashtra',
    },
    composition: [
        { name: 'Microbial Consortia', percentage: '78%', note: '% by min weight' },
    ],
    recommendations: ['Mix 5 kg with 200 liters of water'],
    crops: ['Ginger', 'Potato'],
};

describe('createProductSchema', () => {
    it('should accept a valid complete product input', () => {
        const result = createProductSchema.safeParse(validProductInput);
        expect(result.success).toBe(true);
    });

    it('should accept valid input with optional fields', () => {
        const input = {
            ...validProductInput,
            pH: '6 - 7',
            bulkDensity: '0.8 - 0.9',
        };
        const result = createProductSchema.safeParse(input);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.pH).toBe('6 - 7');
            expect(result.data.bulkDensity).toBe('0.8 - 0.9');
        }
    });

    it('should trim whitespace from string fields', () => {
        const input = {
            ...validProductInput,
            name: '  The Great Samrat  ',
            tagline: '  NPK Microbial Consortia  ',
        };
        const result = createProductSchema.safeParse(input);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.name).toBe('The Great Samrat');
            expect(result.data.tagline).toBe('NPK Microbial Consortia');
        }
    });

    it('should reject when name is missing', () => {
        const { name: _, ...input } = validProductInput;
        const result = createProductSchema.safeParse(input);
        expect(result.success).toBe(false);
    });

    it('should reject when name is empty string', () => {
        const input = { ...validProductInput, name: '' };
        const result = createProductSchema.safeParse(input);
        expect(result.success).toBe(false);
    });

    it('should reject when name is only whitespace', () => {
        const input = { ...validProductInput, name: '   ' };
        const result = createProductSchema.safeParse(input);
        expect(result.success).toBe(false);
    });

    it('should reject when description is missing', () => {
        const { description: _, ...input } = validProductInput;
        const result = createProductSchema.safeParse(input);
        expect(result.success).toBe(false);
    });

    it('should reject when manufacturer is incomplete', () => {
        const input = {
            ...validProductInput,
            manufacturer: { name: 'Sahyadri' },
        };
        const result = createProductSchema.safeParse(input);
        expect(result.success).toBe(false);
    });

    it('should reject when composition is empty array', () => {
        const input = { ...validProductInput, composition: [] };
        const result = createProductSchema.safeParse(input);
        expect(result.success).toBe(false);
    });

    it('should reject when recommendations is empty array', () => {
        const input = { ...validProductInput, recommendations: [] };
        const result = createProductSchema.safeParse(input);
        expect(result.success).toBe(false);
    });

    it('should reject when crops is empty array', () => {
        const input = { ...validProductInput, crops: [] };
        const result = createProductSchema.safeParse(input);
        expect(result.success).toBe(false);
    });

    it('should reject name exceeding max length', () => {
        const input = { ...validProductInput, name: 'a'.repeat(201) };
        const result = createProductSchema.safeParse(input);
        expect(result.success).toBe(false);
    });

    it('should default optional fields to empty string', () => {
        const result = createProductSchema.safeParse(validProductInput);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.pH).toBe('');
            expect(result.data.bulkDensity).toBe('');
        }
    });
});

describe('updateProductSchema', () => {
    it('should accept a partial update with only name', () => {
        const result = updateProductSchema.safeParse({ name: 'New Name' });
        expect(result.success).toBe(true);
    });

    it('should accept an empty object (no fields to update)', () => {
        const result = updateProductSchema.safeParse({});
        expect(result.success).toBe(true);
    });

    it('should accept a full product input', () => {
        const result = updateProductSchema.safeParse(validProductInput);
        expect(result.success).toBe(true);
    });

    it('should still validate field constraints on partial data', () => {
        const result = updateProductSchema.safeParse({ name: '' });
        expect(result.success).toBe(false);
    });
});
