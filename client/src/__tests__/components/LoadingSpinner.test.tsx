import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

describe('LoadingSpinner', () => {
    it('should render default spinner with message', () => {
        render(<LoadingSpinner />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render custom message', () => {
        render(<LoadingSpinner message="Fetching products..." />);
        expect(screen.getByText('Fetching products...')).toBeInTheDocument();
    });

    it('should render small variant without message', () => {
        const { container } = render(<LoadingSpinner variant="small" />);
        const spinner = container.querySelector('.loading-spinner-small');
        expect(spinner).toBeInTheDocument();
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
});
