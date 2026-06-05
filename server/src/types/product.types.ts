/**
 * Product-specific type definitions and DTOs.
 *
 * These types are decoupled from Mongoose to keep the service/controller
 * layers database-agnostic.
 */

/** Composition component within a product. */
export interface CompositionDto {
    name: string;
    percentage: string;
    note?: string;
}

/** Manufacturer details for a product. */
export interface ManufacturerDto {
    name: string;
    address: string;
    licenseNo: string;
    licenseIssuedBy: string;
}

/** Full product representation returned by the API. */
export interface ProductDto {
    _id: string;
    name: string;
    tagline: string;
    description: string;
    manufacturer: ManufacturerDto;
    composition: CompositionDto[];
    pH?: string;
    bulkDensity?: string;
    recommendations: string[];
    crops: string[];
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

/** Input payload for creating a new product (before image handling). */
export interface CreateProductInput {
    name: string;
    tagline: string;
    description: string;
    manufacturer: ManufacturerDto;
    composition: CompositionDto[];
    pH?: string;
    bulkDensity?: string;
    recommendations: string[];
    crops: string[];
    image?: string;
}

/** Input payload for updating an existing product. */
export type UpdateProductInput = Partial<CreateProductInput>;
