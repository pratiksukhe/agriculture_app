import { useParams } from 'react-router-dom';
import { getImageUrl } from '../../api/products';
import { useProduct } from '../../hooks/useProduct';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import { APP_NAME } from '../../constants';
import './ProductPage.css';

/**
 * Public product page — the QR code destination.
 *
 * Mobile-first design, optimized for scanning.
 * Uses the useProduct hook for data fetching.
 */
export default function ProductPage() {
    const { id } = useParams<{ id: string }>();
    const { product, loading, error } = useProduct(id);

    if (loading) {
        return <LoadingSpinner message="Loading product..." />;
    }

    if (error || !product) {
        return (
            <ErrorState
                icon="🔍"
                title="Product Not Found"
                message="The product you're looking for doesn't exist or has been removed."
            />
        );
    }

    return (
        <div className="product-page">
            {/* Hero Section */}
            <div className="product-hero">
                <div className="hero-badge">{product.tagline}</div>
                {product.image && (
                    <div className="hero-image-wrapper">
                        <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="hero-image"
                        />
                    </div>
                )}
                <h1 className="product-title">{product.name}</h1>
                <div className="manufacturer-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    {product.manufacturer.name}
                </div>
            </div>

            {/* Description */}
            <section className="product-section">
                <div className="section-header">
                    <div className="section-icon">📋</div>
                    <h2>About This Product</h2>
                </div>
                <p className="product-description">{product.description}</p>
            </section>

            {/* Composition */}
            {product.composition.length > 0 && (
                <section className="product-section">
                    <div className="section-header">
                        <div className="section-icon">🧪</div>
                        <h2>Composition</h2>
                    </div>
                    <div className="composition-card">
                        <table className="composition-table">
                            <thead>
                                <tr>
                                    <th>Component</th>
                                    <th>Percentage</th>
                                    <th>Note</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product.composition.map((comp, i) => (
                                    <tr key={`${comp.name}-${i}`}>
                                        <td className="comp-name">{comp.name}</td>
                                        <td className="comp-percentage">
                                            <span className="percentage-badge">{comp.percentage}</span>
                                        </td>
                                        <td className="comp-note">{comp.note || '–'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* pH and Bulk Density */}
                        {(product.pH || product.bulkDensity) && (
                            <div className="properties-row">
                                {product.pH && (
                                    <div className="property-chip">
                                        <span className="property-label">pH</span>
                                        <span className="property-value">{product.pH}</span>
                                    </div>
                                )}
                                {product.bulkDensity && (
                                    <div className="property-chip">
                                        <span className="property-label">Bulk Density</span>
                                        <span className="property-value">{product.bulkDensity}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Recommendations */}
            {product.recommendations.length > 0 && (
                <section className="product-section">
                    <div className="section-header">
                        <div className="section-icon">💡</div>
                        <h2>Recommendations</h2>
                    </div>
                    <div className="recommendations-list">
                        {product.recommendations.map((rec, i) => (
                            <div className="recommendation-item" key={`rec-${i}`}>
                                <div className="rec-number">{i + 1}</div>
                                <p>{rec}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Applicable Crops */}
            {product.crops.length > 0 && (
                <section className="product-section">
                    <div className="section-header">
                        <div className="section-icon">🌾</div>
                        <h2>Applicable Crops</h2>
                    </div>
                    <div className="crops-grid">
                        {product.crops.map((crop, i) => (
                            <span className="crop-tag" key={`crop-${i}`}>
                                {crop}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* Manufacturer & License */}
            <section className="product-section manufacturer-section">
                <div className="section-header">
                    <div className="section-icon">🏭</div>
                    <h2>Manufacturer Details</h2>
                </div>
                <div className="manufacturer-card">
                    <div className="mfg-detail">
                        <span className="mfg-label">Company</span>
                        <span className="mfg-value">{product.manufacturer.name}</span>
                    </div>
                    <div className="mfg-detail">
                        <span className="mfg-label">Address</span>
                        <span className="mfg-value">{product.manufacturer.address}</span>
                    </div>
                    <div className="mfg-detail">
                        <span className="mfg-label">License No.</span>
                        <span className="mfg-value license-number">{product.manufacturer.licenseNo}</span>
                    </div>
                    <div className="mfg-detail">
                        <span className="mfg-label">Issued By</span>
                        <span className="mfg-value">{product.manufacturer.licenseIssuedBy}</span>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="product-footer">
                <div className="footer-brand">
                    <span className="brand-dot" />
                    {APP_NAME}
                </div>
                <p className="footer-text">For Agricultural Use Only</p>
            </footer>
        </div>
    );
}
