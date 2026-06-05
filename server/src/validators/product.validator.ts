import { z } from 'zod';

/**
 * Zod validation schemas for product-related API inputs.
 *
 * These schemas serve dual purposes:
 * 1. Runtime validation in the validate middleware
 * 2. Type inference via z.infer<> (single source of truth)
 */

/** Schema for a composition entry. */
const compositionSchema = z.object({
    name: z.string().trim().min(1, 'Composition name is required'),
    percentage: z.string().trim().min(1, 'Percentage is required'),
    note: z.string().trim().optional().default(''),
});

/** Schema for manufacturer details. */
const manufacturerSchema = z.object({
    name: z.string().trim().min(1, 'Manufacturer name is required'),
    address: z.string().trim().min(1, 'Manufacturer address is required'),
    licenseNo: z.string().trim().min(1, 'License number is required'),
    licenseIssuedBy: z.string().trim().min(1, 'License issuer is required'),
});

/** Schema for creating a new product. */
export const createProductSchema = z.object({
    name: z.string().trim().min(1, 'Product name is required').max(200),
    tagline: z.string().trim().min(1, 'Tagline is required').max(300),
    description: z.string().trim().min(1, 'Description is required').max(5000),
    manufacturer: manufacturerSchema,
    composition: z
        .array(compositionSchema)
        .min(1, 'At least one composition entry is required'),
    pH: z.string().trim().optional().default(''),
    bulkDensity: z.string().trim().optional().default(''),
    recommendations: z
        .array(z.string().trim().min(1))
        .min(1, 'At least one recommendation is required'),
    crops: z
        .array(z.string().trim().min(1))
        .min(1, 'At least one crop is required'),
});

/** Schema for updating a product (all fields optional). */
export const updateProductSchema = createProductSchema.partial();

/** Inferred types from schemas — single source of truth. */
export type CreateProductSchemaType = z.infer<typeof createProductSchema>;
export type UpdateProductSchemaType = z.infer<typeof updateProductSchema>;
