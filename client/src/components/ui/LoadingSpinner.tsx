interface LoadingSpinnerProps {
    /** Text displayed below the spinner. */
    message?: string;
    /** Use 'small' for inline spinners (e.g., inside buttons). */
    variant?: 'default' | 'small';
}

/**
 * Reusable loading spinner component.
 *
 * Extracted from multiple pages to follow DRY and SRP.
 */
export default function LoadingSpinner({
    message = 'Loading...',
    variant = 'default',
}: LoadingSpinnerProps) {
    if (variant === 'small') {
        return <div className="loading-spinner-small" />;
    }

    return (
        <div className="loading-screen">
            <div className="loading-spinner" />
            <p>{message}</p>
        </div>
    );
}
