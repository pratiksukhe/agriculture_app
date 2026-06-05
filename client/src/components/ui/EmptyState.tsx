import { Link } from 'react-router-dom';

interface EmptyStateProps {
    /** Emoji icon displayed above the heading. */
    icon?: string;
    /** Main heading text. */
    title: string;
    /** Descriptive text below the heading. */
    description: string;
    /** If provided, renders a primary action button as a link. */
    actionLabel?: string;
    /** Link destination for the action button. */
    actionTo?: string;
}

/**
 * Reusable empty state component for zero-data screens.
 */
export default function EmptyState({
    icon = '📦',
    title,
    description,
    actionLabel,
    actionTo,
}: EmptyStateProps) {
    return (
        <div className="empty-state">
            <div className="empty-icon">{icon}</div>
            <h2>{title}</h2>
            <p>{description}</p>
            {actionLabel && actionTo && (
                <Link to={actionTo} className="btn-primary">
                    {actionLabel}
                </Link>
            )}
        </div>
    );
}
