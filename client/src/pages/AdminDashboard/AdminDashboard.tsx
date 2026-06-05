import { useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteProduct, getImageUrl } from '../../api/products';
import { useProducts } from '../../hooks/useProducts';
import QRCodeView from '../../components/product/QRCodeView';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { APP_NAME, APP_TAGLINE } from '../../constants';
import './AdminDashboard.css';

/**
 * Admin dashboard page.
 *
 * Displays the product grid with QR codes and management actions.
 * Uses the useProducts hook for data fetching (SRP).
 */
export default function AdminDashboard() {
    const { products, loading, refetch } = useProducts();
    const [baseUrl, setBaseUrl] = useState(window.location.origin);
    const [showUrlInput, setShowUrlInput] = useState(false);

    const handleDelete = async (id: string, name: string): Promise<void> => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
        try {
            await deleteProduct(id);
            refetch();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to delete product';
            alert(message);
        }
    };

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <header className="admin-header">
                <div className="admin-header-content">
                    <div className="admin-logo">
                        <div className="logo-icon">🌱</div>
                        <div>
                            <h1>{APP_NAME}</h1>
                            <p className="admin-subtitle">{APP_TAGLINE}</p>
                        </div>
                    </div>
                    <Link to="/admin/add" className="btn-primary btn-add">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Product
                    </Link>
                </div>
            </header>

            {/* Base URL Config */}
            <div className="url-config">
                <button
                    className="btn-ghost"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    QR Base URL Settings
                </button>
                {showUrlInput && (
                    <div className="url-input-row">
                        <label>Base URL for QR codes:</label>
                        <input
                            type="url"
                            value={baseUrl}
                            onChange={(e) => setBaseUrl(e.target.value)}
                            placeholder="https://your-domain.com"
                        />
                        <p className="url-hint">
                            Set this to your deployed URL so QR codes work when printed. Currently using: <code>{baseUrl}</code>
                        </p>
                    </div>
                )}
            </div>

            {/* Products Grid */}
            {loading ? (
                <LoadingSpinner message="Loading products..." />
            ) : products.length === 0 ? (
                <EmptyState
                    title="No Products Yet"
                    description="Add your first agriculture product to generate QR codes."
                    actionLabel="Add Your First Product"
                    actionTo="/admin/add"
                />
            ) : (
                <div className="products-grid">
                    {products.map((product) => (
                        <div className="product-card" key={product._id}>
                            <div className="card-header">
                                {product.image ? (
                                    <img
                                        src={getImageUrl(product.image)}
                                        alt={product.name}
                                        className="card-image"
                                    />
                                ) : (
                                    <div className="card-image-placeholder">🌿</div>
                                )}
                                <div className="card-info">
                                    <h3>{product.name}</h3>
                                    <span className="card-tagline">{product.tagline}</span>
                                </div>
                            </div>

                            <div className="card-qr">
                                <QRCodeView
                                    url={`${baseUrl}/product/${product._id}`}
                                    size={180}
                                    productName={product.name}
                                />
                            </div>

                            <div className="card-url">
                                <code>{`${baseUrl}/product/${product._id}`}</code>
                            </div>

                            <div className="card-actions">
                                <Link
                                    to={`/product/${product._id}`}
                                    className="btn-outline"
                                    target="_blank"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                    View Page
                                </Link>
                                <button
                                    className="btn-danger"
                                    onClick={() => handleDelete(product._id, product.name)}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
