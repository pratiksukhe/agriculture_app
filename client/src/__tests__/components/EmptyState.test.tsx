import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EmptyState from '../../components/ui/EmptyState';

const renderWithRouter = (ui: React.ReactElement) =>
    render(<MemoryRouter>{ui}</MemoryRouter>);

describe('EmptyState', () => {
    it('should render title and description', () => {
        renderWithRouter(
            <EmptyState
                title="No Products"
                description="Add your first product."
            />,
        );
        expect(screen.getByText('No Products')).toBeInTheDocument();
        expect(screen.getByText('Add your first product.')).toBeInTheDocument();
    });

    it('should render default icon', () => {
        renderWithRouter(
            <EmptyState title="Empty" description="Nothing here." />,
        );
        expect(screen.getByText('📦')).toBeInTheDocument();
    });

    it('should render custom icon', () => {
        renderWithRouter(
            <EmptyState icon="🌱" title="Empty" description="Nothing here." />,
        );
        expect(screen.getByText('🌱')).toBeInTheDocument();
    });

    it('should render action button when provided', () => {
        renderWithRouter(
            <EmptyState
                title="No Products"
                description="Start adding."
                actionLabel="Add Product"
                actionTo="/admin/add"
            />,
        );
        const link = screen.getByText('Add Product');
        expect(link).toBeInTheDocument();
        expect(link.closest('a')).toHaveAttribute('href', '/admin/add');
    });

    it('should not render action button when not provided', () => {
        renderWithRouter(
            <EmptyState title="Empty" description="Nothing here." />,
        );
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
});
