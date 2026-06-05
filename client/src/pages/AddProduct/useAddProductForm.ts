import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../api/products';
import type { IComposition } from '../../types/Product';
import { DEFAULT_MANUFACTURER_NAME } from '../../constants';

/**
 * Custom hook encapsulating all AddProduct form logic.
 *
 * Extracts the 15+ useState calls and helper functions from the
 * AddProduct component into a focused, testable hook.
 *
 * Follows SRP: the component handles rendering, this hook handles state.
 */
export function useAddProductForm() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [tagline, setTagline] = useState('');
    const [description, setDescription] = useState('');
    const [mfgName, setMfgName] = useState(DEFAULT_MANUFACTURER_NAME);
    const [mfgAddress, setMfgAddress] = useState('');
    const [licenseNo, setLicenseNo] = useState('');
    const [licenseIssuedBy, setLicenseIssuedBy] = useState('');
    const [composition, setComposition] = useState<IComposition[]>([
        { name: '', percentage: '', note: '' },
    ]);
    const [pH, setPH] = useState('');
    const [bulkDensity, setBulkDensity] = useState('');
    const [recommendations, setRecommendations] = useState<string[]>(['']);
    const [crops, setCrops] = useState<string[]>(['']);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');

    // Clean up blob URL on unmount or when preview changes (fix memory leak)
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    // ─── Composition helpers ───────────────────────────────────
    const addComposition = useCallback(() => {
        setComposition((prev) => [...prev, { name: '', percentage: '', note: '' }]);
    }, []);

    const removeComposition = useCallback((index: number) => {
        setComposition((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const updateComposition = useCallback(
        (index: number, field: keyof IComposition, value: string) => {
            setComposition((prev) => {
                const updated = [...prev];
                const item = updated[index];
                if (item) {
                    updated[index] = { ...item, [field]: value };
                }
                return updated;
            });
        },
        [],
    );

    // ─── Recommendations helpers ───────────────────────────────
    const addRecommendation = useCallback(() => {
        setRecommendations((prev) => [...prev, '']);
    }, []);

    const removeRecommendation = useCallback((index: number) => {
        setRecommendations((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const updateRecommendation = useCallback((index: number, value: string) => {
        setRecommendations((prev) => {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });
    }, []);

    // ─── Crops helpers ─────────────────────────────────────────
    const addCrop = useCallback(() => {
        setCrops((prev) => [...prev, '']);
    }, []);

    const removeCrop = useCallback((index: number) => {
        setCrops((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const updateCrop = useCallback((index: number, value: string) => {
        setCrops((prev) => {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });
    }, []);

    // ─── Image handler ─────────────────────────────────────────
    const handleImageChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                // Revoke the previous blob URL to prevent memory leak
                if (imagePreview) {
                    URL.revokeObjectURL(imagePreview);
                }
                setImage(file);
                setImagePreview(URL.createObjectURL(file));
            }
        },
        [imagePreview],
    );

    const clearImage = useCallback(() => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImage(null);
        setImagePreview('');
    }, [imagePreview]);

    // ─── Submit ────────────────────────────────────────────────
    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setSaving(true);

            const productData = {
                name,
                tagline,
                description,
                manufacturer: {
                    name: mfgName,
                    address: mfgAddress,
                    licenseNo,
                    licenseIssuedBy,
                },
                composition: composition.filter((c) => c.name.trim()),
                pH,
                bulkDensity,
                recommendations: recommendations.filter((r) => r.trim()),
                crops: crops.filter((c) => c.trim()),
            };

            const formData = new FormData();
            formData.append('data', JSON.stringify(productData));
            if (image) {
                formData.append('image', image);
            }

            try {
                await createProduct(formData);
                navigate('/');
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : 'Failed to create product';
                alert(message);
                console.error('Create product error:', err);
            } finally {
                setSaving(false);
            }
        },
        [
            name, tagline, description, mfgName, mfgAddress,
            licenseNo, licenseIssuedBy, composition, pH, bulkDensity,
            recommendations, crops, image, navigate,
        ],
    );

    return {
        // State
        saving,
        name, setName,
        tagline, setTagline,
        description, setDescription,
        mfgName, setMfgName,
        mfgAddress, setMfgAddress,
        licenseNo, setLicenseNo,
        licenseIssuedBy, setLicenseIssuedBy,
        composition,
        pH, setPH,
        bulkDensity, setBulkDensity,
        recommendations,
        crops,
        imagePreview,

        // Actions
        addComposition, removeComposition, updateComposition,
        addRecommendation, removeRecommendation, updateRecommendation,
        addCrop, removeCrop, updateCrop,
        handleImageChange, clearImage,
        handleSubmit,
    };
}
