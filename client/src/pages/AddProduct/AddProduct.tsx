import { Link } from 'react-router-dom';
import { useAddProductForm } from './useAddProductForm';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import type { IComposition } from '../../types/Product';
import './AddProduct.css';

/**
 * Add Product page.
 *
 * This component is purely presentational — all form state and logic
 * lives in the useAddProductForm hook (SRP).
 */
export default function AddProduct() {
    const form = useAddProductForm();

    return (
        <div className="add-product-page">
            <header className="form-header">
                <Link to="/" className="btn-back">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Back
                </Link>
                <h1>Add New Product</h1>
            </header>

            <form onSubmit={form.handleSubmit} className="product-form">
                {/* Basic Info */}
                <fieldset className="form-section">
                    <legend>
                        <span className="legend-icon">📦</span>
                        Product Information
                    </legend>
                    <div className="form-group">
                        <label htmlFor="name">Product Name *</label>
                        <input
                            id="name"
                            type="text"
                            value={form.name}
                            onChange={(e) => form.setName(e.target.value)}
                            placeholder="e.g. The Great Samrat"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="tagline">Tagline / Category *</label>
                        <input
                            id="tagline"
                            type="text"
                            value={form.tagline}
                            onChange={(e) => form.setTagline(e.target.value)}
                            placeholder="e.g. NPK Microbial Consortia"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            value={form.description}
                            onChange={(e) => form.setDescription(e.target.value)}
                            placeholder="Describe what this product does..."
                            rows={4}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Product Image</label>
                        <div className="image-upload-area">
                            {form.imagePreview ? (
                                <div className="image-preview">
                                    <img src={form.imagePreview} alt="Preview" />
                                    <button
                                        type="button"
                                        className="btn-remove-image"
                                        onClick={form.clearImage}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <label className="upload-label" htmlFor="image">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                    <span>Click to upload product photo</span>
                                    <span className="upload-hint">JPG, PNG, WebP — max 10MB</span>
                                </label>
                            )}
                            <input
                                id="image"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={form.handleImageChange}
                                className="file-input-hidden"
                            />
                        </div>
                    </div>
                </fieldset>

                {/* Manufacturer */}
                <fieldset className="form-section">
                    <legend>
                        <span className="legend-icon">🏭</span>
                        Manufacturer Details
                    </legend>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="mfgName">Company Name *</label>
                            <input
                                id="mfgName"
                                type="text"
                                value={form.mfgName}
                                onChange={(e) => form.setMfgName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="mfgAddress">Address *</label>
                            <input
                                id="mfgAddress"
                                type="text"
                                value={form.mfgAddress}
                                onChange={(e) => form.setMfgAddress(e.target.value)}
                                placeholder="e.g. Sinnar, Dist - Nashik"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="licenseNo">License No. *</label>
                            <input
                                id="licenseNo"
                                type="text"
                                value={form.licenseNo}
                                onChange={(e) => form.setLicenseNo(e.target.value)}
                                placeholder="e.g. LCBWD0220260078"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="licenseIssuedBy">Issued By *</label>
                            <input
                                id="licenseIssuedBy"
                                type="text"
                                value={form.licenseIssuedBy}
                                onChange={(e) => form.setLicenseIssuedBy(e.target.value)}
                                placeholder="e.g. Central Government of Maharashtra"
                                required
                            />
                        </div>
                    </div>
                </fieldset>

                {/* Composition */}
                <fieldset className="form-section">
                    <legend>
                        <span className="legend-icon">🧪</span>
                        Composition
                    </legend>
                    {form.composition.map((comp: IComposition, i: number) => (
                        <div className="dynamic-row" key={`comp-${i}`}>
                            <input
                                type="text"
                                placeholder="Component name"
                                value={comp.name}
                                onChange={(e) => form.updateComposition(i, 'name', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Percentage"
                                value={comp.percentage}
                                onChange={(e) => form.updateComposition(i, 'percentage', e.target.value)}
                                className="input-small"
                            />
                            <input
                                type="text"
                                placeholder="Note (optional)"
                                value={comp.note ?? ''}
                                onChange={(e) => form.updateComposition(i, 'note', e.target.value)}
                            />
                            {form.composition.length > 1 && (
                                <button
                                    type="button"
                                    className="btn-remove"
                                    onClick={() => form.removeComposition(i)}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="btn-add-item" onClick={form.addComposition}>
                        + Add Component
                    </button>

                    <div className="form-row" style={{ marginTop: '1rem' }}>
                        <div className="form-group">
                            <label htmlFor="pH">pH Value</label>
                            <input
                                id="pH"
                                type="text"
                                value={form.pH}
                                onChange={(e) => form.setPH(e.target.value)}
                                placeholder="e.g. 6 - 7 (1% Aqueous Solution)"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="bulkDensity">Bulk Density</label>
                            <input
                                id="bulkDensity"
                                type="text"
                                value={form.bulkDensity}
                                onChange={(e) => form.setBulkDensity(e.target.value)}
                                placeholder="e.g. 0.8 - 0.9"
                            />
                        </div>
                    </div>
                </fieldset>

                {/* Recommendations */}
                <fieldset className="form-section">
                    <legend>
                        <span className="legend-icon">💡</span>
                        Recommendations
                    </legend>
                    {form.recommendations.map((rec: string, i: number) => (
                        <div className="dynamic-row" key={`rec-${i}`}>
                            <input
                                type="text"
                                placeholder="e.g. Mix 5 kg with 200 liters of water for Drenching"
                                value={rec}
                                onChange={(e) => form.updateRecommendation(i, e.target.value)}
                            />
                            {form.recommendations.length > 1 && (
                                <button
                                    type="button"
                                    className="btn-remove"
                                    onClick={() => form.removeRecommendation(i)}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="btn-add-item" onClick={form.addRecommendation}>
                        + Add Recommendation
                    </button>
                </fieldset>

                {/* Crops */}
                <fieldset className="form-section">
                    <legend>
                        <span className="legend-icon">🌾</span>
                        Applicable Crops
                    </legend>
                    <div className="crops-input-grid">
                        {form.crops.map((crop: string, i: number) => (
                            <div className="dynamic-row crop-row" key={`crop-${i}`}>
                                <input
                                    type="text"
                                    placeholder="e.g. Ginger"
                                    value={crop}
                                    onChange={(e) => form.updateCrop(i, e.target.value)}
                                />
                                {form.crops.length > 1 && (
                                    <button
                                        type="button"
                                        className="btn-remove"
                                        onClick={() => form.removeCrop(i)}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button type="button" className="btn-add-item" onClick={form.addCrop}>
                        + Add Crop
                    </button>
                </fieldset>

                {/* Submit */}
                <div className="form-actions">
                    <Link to="/" className="btn-outline">Cancel</Link>
                    <button type="submit" className="btn-primary btn-submit" disabled={form.saving}>
                        {form.saving ? (
                            <>
                                <LoadingSpinner variant="small" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Save Product
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
