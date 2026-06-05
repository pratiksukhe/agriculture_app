import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ErrorState from '../../components/ui/ErrorState';

/**
 * Wraps component in MemoryRouter since ErrorState uses <Link>.
 */
const renderWithRouter = (ui: React.ReactElement) =>
    render(<MemoryRouter>{ui}</MemoryRouter>);

describe('ErrorState', () => {
    it('should render with default props', () => {
        renderWithRouter(<ErrorState />);
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText('Please try again later.')).toBeInTheDocument();
        expect(screen.getByText('Go Home')).toBeInTheDocument();
    });

    it('should render custom icon, title, and message', () => {
        renderWithRouter(
            <ErrorState
                icon="💥"
                title="Custom Error"
                message="Something specific went wrong"
            />,
        );
        expect(screen.getByText('💥')).toBeInTheDocument();
        expect(screen.getByText('Custom Error')).toBeInTheDocument();
        expect(screen.getByText('Something specific went wrong')).toBeInTheDocument();
    });

    it('should hide home link when showHomeLink is false', () => {
        renderWithRouter(<ErrorState showHomeLink={false} />);
        expect(screen.queryByText('Go Home')).not.toBeInTheDocument();
    });
});
