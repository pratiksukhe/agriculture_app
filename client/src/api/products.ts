import httpClient from './httpClient';
import type { IProduct } from '../types/Product';
import { API_BASE_URL } from '../constants';

/**
 * Product API functions.
 *
 * Each function returns a typed Axios response.
 * The httpClient handles base URL, interceptors, and error normalization.
 */

/** Fetch all products. */
export const getProducts = () =>
    httpClient.get<IProduct[]>('/products');

/** Fetch a single product by ID. */
export const getProduct = (id: string) =>
    httpClient.get<IProduct>(`/products/${id}`);

/** Create a new product with multipart form data. */
export const createProduct = (data: FormData) =>
    httpClient.post<IProduct>('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

/** Update an existing product with multipart form data. */
export const updateProduct = (id: string, data: FormData) =>
    httpClient.put<IProduct>(`/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

/** Delete a product by ID. */
export const deleteProduct = (id: string) =>
    httpClient.delete(`/products/${id}`);

/** Get the full URL for an uploaded product image. */
export const getImageUrl = (filename: string): string =>
    `${API_BASE_URL}/uploads/${filename}`;
