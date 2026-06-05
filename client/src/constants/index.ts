/**
 * Application constants.
 *
 * Centralizes magic strings, URLs, and configuration values
 * that would otherwise be scattered across components.
 */

/** Base URL for the API server. */
export const API_BASE_URL =
    import.meta.env.VITE_API_URL ?? `http://${window.location.hostname}:5001`;

/** Default company name for new products. */
export const DEFAULT_MANUFACTURER_NAME = 'Sahyadri Agritech';

/** Application display name. */
export const APP_NAME = 'Sahyadri Agritech';

/** Tagline shown in the admin dashboard header. */
export const APP_TAGLINE = 'Product QR Code Manager';
