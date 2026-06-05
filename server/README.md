# Sahyadri Agritech — Server API

Backend REST API for the Sahyadri Agritech QR Product Management System. Built with a layered architecture following industry best practices and SOLID principles.

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 22+ | Runtime |
| **TypeScript** | ^5.7 | Type safety with strict mode |
| **Express** | ^4.21 | HTTP framework |
| **Mongoose** | ^8.10 | MongoDB ODM |
| **Zod** | ^4.4 | Runtime input validation |
| **Helmet** | ^8.2 | HTTP security headers |
| **express-rate-limit** | ^8.5 | API rate limiting |
| **Multer** | ^1.4 | File upload handling |
| **Jest** | ^30.4 | Test runner |
| **ts-jest** | ^29.4 | TypeScript support for Jest |
| **Supertest** | ^7.2 | HTTP integration testing |
| **mongodb-memory-server** | ^11.2 | In-memory MongoDB for tests |

## Architecture

The server follows a **layered architecture** pattern:

```
Route → Controller → Service → Repository → Database
```

| Layer | Responsibility |
|-------|---------------|
| **Routes** | HTTP method + URL mapping only |
| **Controllers** | Parse requests, format responses (thin) |
| **Services** | Business logic, orchestration, error handling |
| **Repositories** | Data access via interfaces (DIP) |
| **Middleware** | Cross-cutting: error handling, validation, uploads |

## Project Structure

```
server/
├── src/
│   ├── __tests__/
│   │   ├── integration/
│   │   │   └── product.routes.test.ts    # API integration tests
│   │   └── unit/
│   │       ├── services/
│   │       │   └── product.service.test.ts
│   │       └── validators/
│   │           └── product.validator.test.ts
│   ├── config/
│   │   ├── index.ts                      # Centralized env config
│   │   └── database.ts                   # MongoDB connection
│   ├── controllers/
│   │   └── product.controller.ts         # HTTP request handling
│   ├── middleware/
│   │   ├── errorHandler.ts               # Global error handler
│   │   ├── upload.ts                     # Multer file upload config
│   │   └── validate.ts                   # Zod validation middleware
│   ├── models/
│   │   └── Product.ts                    # Mongoose schema
│   ├── repositories/
│   │   ├── interfaces/
│   │   │   └── product.repository.interface.ts
│   │   └── product.repository.ts         # Mongoose implementation
│   ├── routes/
│   │   ├── index.ts                      # Route aggregator (/api/v1)
│   │   └── product.routes.ts             # Product route definitions
│   ├── scripts/
│   │   └── seed.ts                       # Database seed script
│   ├── services/
│   │   └── product.service.ts            # Business logic
│   ├── types/
│   │   ├── common.types.ts               # ApiResponse, HttpStatus
│   │   └── product.types.ts              # Product DTOs
│   ├── utils/
│   │   ├── ApiError.ts                   # Custom error class
│   │   └── asyncHandler.ts               # Async route wrapper
│   ├── validators/
│   │   └── product.validator.ts          # Zod schemas
│   ├── app.ts                            # Express app factory
│   └── index.ts                          # Entry point (bootstrap)
├── uploads/                              # Product images (gitignored)
├── .env.example                          # Environment variable template
├── .gitignore
├── jest.config.ts
├── tsconfig.json                         # IDE config (includes tests)
├── tsconfig.build.json                   # Production build config (excludes tests)
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 22+
- MongoDB running locally (or a remote URI)

### Installation

```bash
cd server
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/sahyadri-agritech
CLIENT_URL=http://localhost:5173
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload (tsx watch) |
| `npm run build` | Compile TypeScript to `dist/` for production |
| `npm start` | Run the compiled production build |
| `npm run seed` | Seed the database with sample data |
| `npm test` | Run all tests (unit + integration) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

### Running the Server

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build
npm start
```

### Seeding the Database

```bash
npm run seed
```

This adds a sample product ("The Great Samrat") to the database. The script is idempotent — it skips if the product already exists.

## API Endpoints

All endpoints are available under `/api/v1` (with backward compatibility on `/api`).

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/products` | List all products |
| `GET` | `/api/v1/products/:id` | Get a single product |
| `POST` | `/api/v1/products` | Create a product (multipart/form-data) |
| `PUT` | `/api/v1/products/:id` | Update a product (multipart/form-data) |
| `DELETE` | `/api/v1/products/:id` | Delete a product |
| `GET` | `/api/health` | Health check (includes DB status) |

### Request Format (Create/Update)

Products are sent as `multipart/form-data` with:
- `data` — JSON string containing the product fields
- `image` — (optional) Product image file (jpg, png, webp, max 10MB)

### Response Format

All responses follow a consistent structure:

```json
// Success
{
  "success": true,
  "data": { ... },
  "message": "Product created successfully"
}

// Error
{
  "success": false,
  "message": "Product with id 'xyz' not found",
  "errors": { "name": ["Product name is required"] }
}
```

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

### Test Structure

| Suite | Type | Tests | What It Tests |
|-------|------|-------|---------------|
| `product.validator.test.ts` | Unit | 17 | Zod schema validation (valid/invalid inputs, trimming, max length) |
| `product.service.test.ts` | Unit | 9 | Business logic with mocked repository |
| `product.routes.test.ts` | Integration | 14 | Full HTTP lifecycle (Route → Controller → Service → Repository → DB) |

**Integration tests** use `mongodb-memory-server` (isolated in-memory database) and `supertest` (HTTP requests without starting a real server).

## Security

- **Helmet** — Sets secure HTTP headers (X-Content-Type-Options, CSP, etc.)
- **Rate Limiting** — 100 requests per 15 minutes per IP
- **CORS** — Configured to allow only the client origin
- **Input Validation** — Zod schemas validate all incoming data
- **Error Sanitization** — Internal errors are never leaked to clients
- **File Upload Limits** — 10MB max, only jpg/png/webp allowed

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Repository interface (DIP) | Services depend on abstractions, not Mongoose. Enables testing with mocks and future DB swaps. |
| `ApiError` class with factories | Consistent error handling: `ApiError.notFound()`, `ApiError.badRequest()`. `isOperational` flag separates expected vs unexpected errors. |
| `asyncHandler` utility | Eliminates try/catch boilerplate in every route handler. |
| App factory pattern (`createApp()`) | Express app can be imported in tests without starting the HTTP server. |
| `as const` over enums | `HttpStatus` uses const object — better tree-shaking, no runtime overhead. |
| Zod over manual validation | Type inference from schemas (single source of truth), runtime safety, better error messages. |
