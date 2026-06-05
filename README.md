# 🌱 Sahyadri Agritech — QR Product Management System

A full-stack agriculture product management application that generates QR codes for products. Farmers and distributors can scan QR codes to view detailed product information including composition, recommendations, and manufacturer details.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 · TypeScript · Vite · React Router · Axios |
| **Backend** | Node.js · Express · TypeScript · Mongoose · Zod |
| **Database** | MongoDB |
| **Testing** | Jest (Server) · Vitest + React Testing Library (Client) |
| **Security** | Helmet · CORS · Rate Limiting · Input Validation |

## Project Structure

```
agriculture_app/
├── client/          # React SPA (Vite)
│   ├── src/
│   │   ├── api/         # HTTP client + API functions
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page components (folder-based)
│   │   ├── styles/      # Modular CSS (design tokens, reset, buttons, forms)
│   │   └── types/       # TypeScript type definitions
│   └── ...
├── server/          # Express REST API
│   ├── src/
│   │   ├── config/         # Centralized environment config
│   │   ├── controllers/    # HTTP request handlers
│   │   ├── middleware/     # Error handler, validation, file upload
│   │   ├── models/         # Mongoose schemas
│   │   ├── repositories/   # Data access layer (Repository Pattern)
│   │   ├── routes/         # Route definitions (versioned: /api/v1)
│   │   ├── services/       # Business logic layer
│   │   ├── validators/     # Zod validation schemas
│   │   └── types/          # TypeScript type definitions
│   └── ...
└── README.md
```

## Architecture

The backend follows a **layered architecture** with SOLID principles:

```
Route → Controller → Service → Repository → Database
```

- **Repository Pattern** — Data access via interfaces (Dependency Inversion)
- **Service Layer** — All business logic centralized
- **Thin Controllers** — Parse requests, delegate to services, format responses
- **Zod Validation** — Runtime type safety with schemas

## Quick Start

### Prerequisites

- Node.js 22+
- MongoDB running locally (or provide a remote URI)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/agriculture_app.git
cd agriculture_app
```

### 2. Setup the Server

```bash
cd server
npm install
cp .env.example .env    # Edit with your MongoDB URI
npm run seed            # (Optional) Add sample data
npm run dev             # Starts on http://localhost:5001
```

### 3. Setup the Client (new terminal)

```bash
cd client
npm install
cp .env.example .env
npm run dev             # Starts on http://localhost:5173
```

### 4. Open the App

- **Admin Dashboard:** http://localhost:5173
- **API Health:** http://localhost:5001/api/health

## Available Scripts

### Server (`cd server`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript for production |
| `npm start` | Run production build |
| `npm run seed` | Seed database with sample data |
| `npm test` | Run all tests (Jest) |
| `npm run test:watch` | Watch mode |
| `npm run test:coverage` | Coverage report |

### Client (`cd client`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + Vite build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run all tests (Vitest) |
| `npm run test:watch` | Watch mode |
| `npm run test:coverage` | Coverage report |

## Testing

| Repo | Runner | Tests | Coverage |
|------|--------|-------|----------|
| Server | Jest + Supertest + mongodb-memory-server | 40 (17 unit + 9 unit + 14 integration) | `npm run test:coverage` |
| Client | Vitest + React Testing Library | 11 component tests | `npm run test:coverage` |

```bash
# Run all server tests
cd server && npm test

# Run all client tests
cd client && npm test
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/products` | List all products |
| `GET` | `/api/v1/products/:id` | Get single product |
| `POST` | `/api/v1/products` | Create product (multipart/form-data) |
| `PUT` | `/api/v1/products/:id` | Update product |
| `DELETE` | `/api/v1/products/:id` | Delete product |
| `GET` | `/api/health` | Health check |

## Features

- 📦 **Product Management** — CRUD operations with image upload
- 📱 **QR Code Generation** — Downloadable QR codes linking to product pages
- 🔍 **Mobile-First Product Pages** — Optimized for QR code scanning
- 🛡️ **Security** — Helmet, rate limiting, CORS, input validation
- 🧪 **Testing** — Unit, integration, and component tests
- 📐 **TypeScript Strict Mode** — Full type safety across both repos

## License

MIT
