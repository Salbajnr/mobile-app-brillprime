
# BrillPrime Monorepo

This is a monorepo containing the BrillPrime application suite built with React Native (mobile), Next.js (web + admin), and Firebase.

## Project Structure

```
packages/
├── admin/          # Admin dashboard (Next.js)
├── web/            # Customer web app (Next.js)  
├── mobile/         # React Native mobile app
└── shared/         # Shared backend logic, database, and components
```

## Getting Started

### Install Dependencies
```bash
npm run install:all
```

### Development

**Web App (Customer)**
```bash
npm run dev:web
# Runs on http://localhost:3000
```

**Admin Dashboard**
```bash
npm run dev:admin  
# Runs on http://localhost:9002
```

**Mobile App**
```bash
npm run dev:mobile
# Opens Expo development tools
```

### Building

**Build All**
```bash
npm run build
```

**Build Individual Packages**
```bash
npm run build:web
npm run build:admin
npm run build:shared
```

## Package Details

### @brillprime/shared
Contains shared logic used across all applications:
- Database schema and queries
- AI/ML flows with GenKit
- UI components
- Utility functions

### @brillprime/admin
Admin dashboard for managing:
- User management
- Escrow transactions
- Security & fraud detection
- Support tickets
- Demand planning

### @brillprime/web
Customer-facing web application for:
- User authentication
- Digital payments
- E-market browsing
- Order management

### @brillprime/mobile
React Native mobile app (coming soon)

## Environment Variables

Create `.env.local` files in each package as needed:
- `packages/admin/.env.local`
- `packages/web/.env.local`
- `packages/shared/.env.local`

Common variables:
```
DATABASE_URL=postgresql://localhost:5432/brillprime
GOOGLE_AI_API_KEY=your_api_key
```
