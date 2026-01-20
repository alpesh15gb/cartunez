# Car Tunez 🚗

> Premium car accessories ecommerce platform

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router) + TypeScript + Tailwind |
| **Backend** | MedusaJS v2 + Express |
| **Database** | PostgreSQL 15 |
| **Cache** | Redis 7 |
| **Search** | Meilisearch |
| **Storage** | MinIO (S3-compatible) |
| **Payments** | Razorpay |
| **Shipping** | Shiprocket |

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- npm or yarn

### Development (Docker)

```bash
# Start infrastructure services
docker-compose up postgres redis meilisearch minio -d

# Install backend dependencies
cd backend && npm install

# Run database migrations
npm run migrations:run

# Start backend dev server
npm run dev

# In another terminal - start storefront
cd storefront && npm install && npm run dev
```

### Development (Full Docker)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Environment Setup

1. Copy `.env.example` to `.env`
2. Update values for your environment
3. For Razorpay, use test keys from dashboard

## Project Structure

```
CarTunez/
├── backend/          # MedusaJS API server
│   ├── src/
│   │   ├── api/      # Custom API routes
│   │   ├── modules/  # Custom modules (vehicle fitment)
│   │   └── services/ # Business logic
│   └── medusa-config.ts
├── storefront/       # Next.js frontend
│   ├── src/
│   │   ├── app/      # App Router pages
│   │   ├── components/
│   │   └── lib/      # Utils, hooks, API client
│   └── next.config.ts
├── nginx/            # Reverse proxy config
├── docker-compose.yml
└── .env
```

## Key Features

- 🚗 **Vehicle Fitment** - Shop by Make → Model → Year
- 🔍 **Smart Search** - Typo-tolerant with autocomplete
- 💳 **India Payments** - Razorpay + COD
- 📦 **Shipping** - Shiprocket integration
- 📱 **Mobile-first** - Responsive design
- 🔐 **OTP Login** - Phone-based authentication

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /store/products` | List products |
| `GET /store/products/:id` | Product detail |
| `POST /store/carts` | Create cart |
| `POST /store/orders` | Place order |
| `GET /admin/*` | Admin API (requires auth) |

## Deployment

### Production

```bash
# Build and start with Docker
docker-compose --profile production up -d --build

# Or deploy to cloud
# See deployment docs for AWS/GCP/DigitalOcean guides
```

## License

Private - All rights reserved
