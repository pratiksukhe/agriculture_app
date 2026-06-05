import { Link } from 'react-router-dom';

interface ErrorStateProps {
    /** Icon displayed above the message. */
    icon?: string;
    /** Main heading text. */
    title?: string;
    /** Descriptive message below the heading. */
    message?: string;
    /** If provided, shows a "Go Home" link. */
    showHomeLink?: boolean;
}

/**
 * Reusable error state component for displaying user-friendly error messages.
 */
export default function ErrorState({
    icon = '🔍',
    title = 'Something went wrong',
    message = 'Please try again later.',
    showHomeLink = true,
}: ErrorStateProps) {
    return (
        <div className="error-screen">
            <div className="error-icon">{icon}</div>
            <h2>{title}</h2>
            <p>{message}</p>
            {showHomeLink && (
                <Link to="/" className="btn-primary">
                    Go Home
                </Link>
            )}
        </div>
    );
}
