import { useEffect, useState, useCallback } from 'react';
import { getProducts } from '../api/products';
import type { IProduct } from '../types/Product';

interface UseProductsReturn {
    products: IProduct[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

/**
 * Custom hook for fetching the product list.
 *
 * Encapsulates data fetching logic, loading/error states,
 * and provides a `refetch` function for manual refreshes.
 */
export function useProducts(): UseProductsReturn {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(() => {
        setLoading(true);
        setError(null);
        getProducts()
            .then((res) => {
                setProducts(res.data);
            })
            .catch((err: unknown) => {
                const message = err instanceof Error ? err.message : 'Failed to load products';
                setError(message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, loading, error, refetch: fetchProducts };
}
