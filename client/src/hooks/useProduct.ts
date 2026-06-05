import { useEffect, useState } from 'react';
import { getProduct } from '../api/products';
import type { IProduct } from '../types/Product';

interface UseProductReturn {
    product: IProduct | null;
    loading: boolean;
    error: string | null;
}

/**
 * Custom hook for fetching a single product by ID.
 *
 * Handles loading state, error state, and the product data.
 * Returns null product and appropriate error for missing/invalid IDs.
 */
export function useProduct(id: string | undefined): UseProductReturn {
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError('No product ID provided');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        getProduct(id)
            .then((res) => {
                setProduct(res.data);
            })
            .catch(() => {
                setError('Product not found');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    return { product, loading, error };
}
