# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **will.lending** - a P2P crowdlending platform specialized in Revenue-Based Financing (RBF) for SaaS companies in Series A/B. The platform connects investors with SaaS companies seeking non-dilutive capital, using real-time metrics monitoring and blockchain transparency.

### Monorepo Structure

- **Root**: PNPM workspace with shared configurations
- **web/**: Next.js 15 web application (main platform)
- **bruno/**: API collection for testing endpoints
- **plans/**: Project planning and documentation

## Development Commands

### Core Development
```bash
# Install dependencies (from root)
pnpm install

# Development server with Turbopack
cd web && pnpm dev

# Build production
cd web && pnpm build

# Start production server
cd web && pnpm start
```

### Code Quality
```bash
# Lint and fix code
cd web && pnpm lint

# Lint check only
cd web && pnpm lint:check

# Generate Prisma client
cd web && pnpm postinstall
```

### Testing
```bash
# Unit/Integration tests with Vitest
cd web && pnpm test

# Watch mode for tests
cd web && pnpm test:watch

# E2E tests with Playwright
cd web && pnpm test:e2e

# Run all tests
cd web && pnpm test:complete

# Test coverage
cd web && pnpm coverage
```

## Architecture

### Database & ORM
- **PostgreSQL** with Prisma ORM
- **Custom Prisma output**: `web/src/generated/prisma`
- **Schema**: Complex financial data model covering investors, borrowers, contracts, payments, and risk scoring
- **Key entities**: Investidor, Tomador, Empresa, Contrato, Proposta, MetricasMensais, Score

### Authentication
- **Better Auth** with Prisma adapter
- **Email/password** authentication enabled
- **Custom session** with role-based access
- **Expo plugin** for mobile compatibility

### Project Structure
```
web/src/
├── app/
│   ├── (backend)/          # Backend logic (route groups)
│   │   ├── api/           # API routes
│   │   ├── services/      # Business logic services
│   │   └── schemas/       # Validation schemas
│   ├── (frontend)/        # Frontend route groups
│   │   ├── (auth)/        # Authentication pages
│   │   ├── (user-protected)/ # Protected user areas
│   │   └── admin/         # Admin interface
│   └── dashboard/         # Main dashboard
├── components/            # Reusable React components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
└── utils/                # Helper functions
```

### Key Technologies
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **UI Components**: Radix UI primitives, shadcn/ui
- **Charts**: Recharts for financial dashboards
- **State**: React hooks, server components
- **Email**: Resend with React Email templates
- **Analytics**: PostHog integration via rewrites

### Testing Strategy
- **Unit/Integration**: Vitest with jsdom environment
- **E2E**: Playwright across chromium, firefox, webkit
- **Coverage**: V8 coverage with HTML reports
- **Test directories**: `tests/integration/` and `tests/e2e/`

## API Architecture

The platform uses Next.js App Router API routes in `(backend)/api/`:
- **RESTful endpoints** for CRUD operations
- **Validation** with Zod schemas
- **Route groups** for logical organization
- **Bruno collection** for API testing

Key API patterns:
- `/api/investidor` - Investor management
- `/api/tomador` - Borrower management
- `/api/insights` - Risk and analytics data

## Development Notes

### Database Workflow
1. Update `prisma/schema.prisma`
2. Run `pnpm postinstall` to regenerate client
3. Database migrations handled separately

### Testing Approach
- Use Vitest for business logic testing
- Use Playwright for user journey testing
- Mock external APIs in tests
- Focus on critical financial calculation paths

### Code Standards
- TypeScript strict mode enabled
- ESLint configuration in `eslint.config.mjs`
- Path aliases configured: `@/backend`, `@/frontend`, `@`
- Components use shadcn/ui patterns

## Blockchain Integration

The platform includes blockchain functionality for transparency:
- **Account Abstraction** for seamless user experience
- **Smart contracts** for automated payments
- **Oracle integration** for real-time MRR data
- **Web3 abstraction** - users don't need crypto knowledge