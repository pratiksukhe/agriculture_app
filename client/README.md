# Sahyadri Agritech — Client

Frontend application for the Sahyadri Agritech QR Product Management System. A React SPA that provides an admin dashboard for managing agriculture products and generates QR codes linking to mobile-optimized product pages.

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | ^19.2 | UI library |
| **TypeScript** | ~5.9 | Type safety with strict mode |
| **Vite** | ^7.3 | Build tool + dev server |
| **React Router** | ^7.13 | Client-side routing |
| **Axios** | ^1.13 | HTTP client with interceptors |
| **QRCode** | ^1.5 | QR code generation on canvas |
| **Vitest** | ^4.1 | Test runner (Vite-native) |
| **React Testing Library** | ^16.3 | Component testing |
| **ESLint** | ^9.39 | Code linting |

## Features

- **Admin Dashboard** — Grid view of all products with QR codes
- **Product Creation** — Form with dynamic fields (composition, recommendations, crops)
- **QR Code Generation** — Generates downloadable QR codes linking to product pages
- **Product Pages** — Mobile-first pages optimized for QR code scanning
- **Image Upload** — Product photo upload with preview and validation

## Project Structure

```
client/
├── src/
│   ├── __tests__/
│   │   ├── components/
│   │   │   ├── EmptyState.test.tsx
│   │   │   ├── ErrorState.test.tsx
│   │   │   └── LoadingSpinner.test.tsx
│   │   └── setup.ts                       # jest-dom matchers setup
│   ├── api/
│   │   ├── httpClient.ts                  # Axios instance + interceptors
│   │   └── products.ts                    # Product API functions
│   ├── components/
│   │   ├── product/
│   │   │   └── QRCodeView.tsx             # QR code display + download
│   │   └── ui/
│   │       ├── EmptyState.tsx             # Zero-data state component
│   │       ├── ErrorState.tsx             # Error display component
│   │       └── LoadingSpinner.tsx         # Loading indicator
│   ├── constants/
│   │   └── index.ts                       # App-wide constants
│   ├── hooks/
│   │   ├── useProduct.ts                  # Single product data hook
│   │   └── useProducts.ts                 # Product list data hook
│   ├── pages/
│   │   ├── AddProduct/
│   │   │   ├── AddProduct.tsx             # Add product form (view)
│   │   │   ├── AddProduct.css             # Page-specific styles
│   │   │   └── useAddProductForm.ts       # Form state + logic (hook)
│   │   ├── AdminDashboard/
│   │   │   ├── AdminDashboard.tsx         # Product grid + QR codes
│   │   │   └── AdminDashboard.css
│   │   └── ProductPage/
│   │       ├── ProductPage.tsx            # Public product page (QR target)
│   │       └── ProductPage.css
│   ├── styles/
│   │   ├── buttons.css                    # Button variants
│   │   ├── forms.css                      # Form components
│   │   ├── index.css                      # Entry point (imports all)
│   │   ├── reset.css                      # Global reset + base
│   │   └── variables.css                  # Design tokens (CSS custom properties)
│   ├── types/
│   │   └── Product.ts                     # Product type definitions
│   ├── App.tsx                            # Root component + routing
│   └── main.tsx                           # Entry point
├── .env.example                           # Environment variable template
├── vite.config.ts                         # Vite + Vitest configuration
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 22+
- Server running on port 5001 (see `../server/README.md`)

### Installation

```bash
cd client
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Edit `.env` if the API server runs on a different URL:

```env
VITE_API_URL=http://localhost:5001
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload (Vite) |
| `npm run build` | TypeScript check + Vite production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint on all files |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

### Running the Client

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

The dev server starts at `http://localhost:5173`.

## Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `AdminDashboard` | Product grid with QR codes and management actions |
| `/admin/add` | `AddProduct` | Form to create a new product |
| `/product/:id` | `ProductPage` | Public product page (QR code destination) |

## Testing

### Run All Tests

```bash
npm test
```

### Watch Mode (re-runs on file changes)

```bash
npm run test:watch
```

### With Coverage Report

```bash
npm run test:coverage
```

### Linting

```bash
npm run lint
```

### Test Structure

| Suite | Tests | What It Tests |
|-------|-------|---------------|
| `LoadingSpinner.test.tsx` | 3 | Default/custom message, small inline variant |
| `ErrorState.test.tsx` | 3 | Default rendering, custom props, conditional home link |
| `EmptyState.test.tsx` | 5 | Icon, title, description, action button rendering |

Tests use:
- **Vitest** as the test runner (native Vite integration, same API as Jest)
- **React Testing Library** for rendering and querying components
- **jsdom** as the browser environment
- **jest-dom** matchers (`toBeInTheDocument`, `toHaveAttribute`, etc.)

## Architecture Patterns

### Custom Hooks (State Management)

Data fetching and form state are extracted into custom hooks, keeping components purely presentational:

```
useProducts()        → fetches product list, provides { products, loading, error, refetch }
useProduct(id)       → fetches single product, provides { product, loading, error }
useAddProductForm()  → manages all form state (15+ fields), provides handlers + submit
```

### HTTP Client

All API calls go through a centralized Axios instance ([httpClient.ts](src/api/httpClient.ts)):
- Base URL from environment variables
- Request interceptors (ready for auth token injection)
- Response interceptors (error message normalization)
- 15s timeout

### CSS Organization

Styles are split into modular partials following the **ITCSS-inspired** approach:

```
variables.css  → Design tokens (colors, shadows, radii)
reset.css      → Global reset + base typography
buttons.css    → Button variants (primary, outline, danger, ghost)
forms.css      → Form inputs, fieldsets, dynamic rows, upload area
index.css      → Entry point + shared utilities (loading, error, empty states)
```

Page-specific styles are co-located with their components (e.g., `AdminDashboard/AdminDashboard.css`).

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Folder-based pages | Co-locating CSS + hooks + component per page improves discoverability |
| Custom hooks over context | Simple data flow without unnecessary global state; easier to test |
| Centralized httpClient | Single place for base URL, auth tokens, error normalization |
| CSS custom properties | Design tokens without build-time dependencies (no Tailwind/SASS needed) |
| `URL.revokeObjectURL()` | Prevents memory leaks from blob URLs created during image preview |
| Vitest for testing | Zero-config with Vite, reuses the same transform pipeline |

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+

The app is **mobile-first** — the product pages are designed for QR code scanning on mobile devices.
