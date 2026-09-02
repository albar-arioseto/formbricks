# Repository Guidelines

## Project Overview

Formbricks is an open-source survey platform (self-hosted or cloud). It provides a Preact-based embeddable survey widget, a Next.js admin dashboard, and a background pipeline for processing responses. The codebase is a pnpm monorepo orchestrated by Turborepo with 2 apps and ~17 packages.

## Architecture & Data Flow

**Three-layer architecture:**

1. **Embedded Widget** (`packages/surveys/`) — Preact-based survey renderer with imperative `SurveyState` + `ResponseQueue`. No React context; offline-capable with IndexedDB-backed submission.

2. **Web Application** (`apps/web/`) — Next.js 16 App Router with modular `modules/` feature architecture. RSC + server actions for state. Handles survey CRUD, analytics, integrations, auth, and API endpoints.

3. **Shared Foundation** (`packages/types/`, `packages/database/`) — Zod schemas as single source of truth, Prisma/PostgreSQL, BullMQ jobs, Redis cache, S3 storage.

**Data flow:**
```
Survey created in editor (apps/web)
  → stored as JSON in PostgreSQL (packages/database)
  → fetched by JS SDK (packages/js-core)
  → rendered by Preact widget (packages/surveys)
  → responses accumulated client-side (ResponseQueue)
  → submitted via REST API (/api/v2/client)
  → background pipeline triggers integrations/webhooks/emails/workflows
```

## Key Directories

| Path | Purpose |
|------|---------|
| `apps/web/` | Next.js 16 admin dashboard & API |
| `apps/web/modules/` | Feature modules (survey editor, response pipeline, auth, etc.) |
| `apps/web/lib/` | Shared services (survey CRUD, response handling, i18n) |
| `packages/types/` | Zod schemas + TypeScript types (single source of truth) |
| `packages/types/surveys/` | Survey, element, block, logic, and response type definitions |
| `packages/surveys/` | Preact survey widget (embedded renderer) |
| `packages/js-core/` | JavaScript SDK for embedding |
| `packages/database/` | Prisma schema, migrations, generated client |
| `packages/survey-ui/` | Shared survey UI components (CTA, ending cards, etc.) |
| `packages/ai/` | AI integration utilities |
| `packages/cache/` | Redis caching layer |
| `packages/jobs/` | Background job definitions (BullMQ) |
| `packages/email/` | Email templates |
| `packages/i18n-utils/` | Internationalization utilities |
| `packages/workflows/` | Workflow engine |

## Development Commands

```bash
# Setup
pnpm install                    # Install dependencies
pnpm db:up                      # Start local infra (Postgres, SpiceDB, Valkey, RustFS, MailHog)
pnpm dev                        # Run all dev servers (parallel)

# Build & Quality
pnpm build                      # Production build (turbo)
pnpm lint                       # ESLint + API v3 lint + catalog check
pnpm typecheck                  # TypeScript type checking
pnpm format                     # Prettier formatting

# Testing
pnpm test                       # All unit/component tests (Vitest, no cache)
pnpm test:coverage              # All tests with V8 coverage
pnpm test:e2e                   # Playwright E2E tests
cd apps/web && pnpm test        # Web unit tests only
cd apps/web && pnpm test:integration  # Integration tests (real DB)
```

## Code Conventions & Common Patterns

**TypeScript/Zod:**
- Zod schemas in `packages/types/` are the single source of truth for all data structures
- Strict TypeScript (`strict: true`, `strictNullChecks: true`)
- Import ordering enforced by Prettier plugins (`@trivago/prettier-plugin-sort-imports`)

**React/Next.js:**
- Next.js 16 App Router with RSC (React Server Components)
- Server actions for mutations, RSC for data fetching
- `Readonly` props pattern in components
- Feature modules colocated in `apps/web/modules/`

**Naming:**
- Files: `kebab-case.ts` for services, `PascalCase.tsx` for components
- Types: `T` prefix (e.g., `TSurvey`, `TResponse`)
- Zod schemas: `Z` prefix (e.g., `ZSurvey`, `ZResponse`)
- Constants: `UPPER_SNAKE_CASE`

**Error handling:**
- Custom error classes (`AuthenticationError`, `ResourceNotFoundError`, etc.)
- Zod validation for API inputs
- `@t3-oss/env-nextjs` for runtime environment validation

**Async patterns:**
- `reactCache()` for request-scoped caching
- BullMQ for background job processing
- `ResponseQueue` for offline-capable client-side submission

## Important Files

| File | Purpose |
|------|---------|
| `packages/types/surveys/types.ts` | Main survey Zod schema (4400+ lines) |
| `packages/types/surveys/elements.ts` | All survey element type schemas |
| `packages/database/schema/main.prisma` | Prisma database schema (1646 lines) |
| `apps/web/lib/survey/service.ts` | Survey CRUD service (1015 lines) |
| `apps/web/modules/response-pipeline/lib/process-response-pipeline-job.ts` | Response processing pipeline |
| `packages/surveys/src/components/general/survey.tsx` | Main Preact survey component |
| `packages/surveys/src/lib/response-queue.ts` | Client-side response queue |
| `packages/js-core/src/index.ts` | JS SDK entry point |
| `turbo.json` | Turborepo task graph and dependencies |
| `pnpm-workspace.yaml` | Workspace packages + shared dep catalog |
| `apps/web/Dockerfile` | Production Docker build (3-stage) |
| `apps/web/lib/env.ts` | Runtime environment validation |

## Runtime/Tooling Preferences

- **Runtime:** Node.js ≥20 (pinned to 24.14.0 via `.nvmrc`)
- **Package manager:** pnpm 11.7.0 (enforced via `packageManager` field)
- **Monorepo tool:** Turborepo 2.9.14
- **Build tools:** Vite 7.3.5 (packages), Next.js 16 (web app)
- **Database:** PostgreSQL with pgvector extension
- **Cache:** Redis/Valkey
- **AuthZed:** SpiceDB for authorization (optional)
- **Storage:** S3-compatible (RustFS for self-hosted, AWS S3 for cloud)
- **Catalog system:** pnpm catalog for shared dependency versions (enforced by `scripts/check-catalog.mjs`)

## Testing & QA

**Frameworks:**
- **Vitest 4.1.6** — Unit tests (`*.test.ts`), component tests (`*.test.tsx`), RSC tests (`*.rsc.test.ts`), integration tests (`*.integration.test.ts`)
- **Playwright 1.58.2** — E2E browser tests (`*.spec.ts`, chromium only)

**Test locations:**
- Tests are co-located with source files (e.g., `utils.test.ts` next to `utils.ts`)
- E2E specs: `apps/web/playwright/*.spec.ts`
- Integration: `apps/web/integration/`

**Running tests:**
```bash
pnpm test                           # All unit/component tests
pnpm test:coverage                  # With V8 coverage
pnpm test:e2e                       # Playwright E2E
cd apps/web && pnpm test:integration  # Integration (real DB)
```

**Coverage:**
- Provider: V8, reporters: text/html/lcov
- Enforced threshold: 80% statements/branches/functions/lines for `modules/auth/lib/**` and `lib/authzed/**`

**Test patterns:**
- Unit: `describe > test > expect`, heavy `vi.mock()` for module isolation
- Component: RTL `render`/`renderHook`, jest-dom matchers
- Integration: Better Auth + real Postgres, serial execution, TRUNCATE cleanup
- E2E: Chromium, 120s timeout, 2 retries on CI, traces/screenshots/video on failure

**CI enforcement:**
- Lint, typecheck, unit tests, E2E, API v3 contract tests (Schemathesis), schema validation on every PR
- Pre-commit hooks: Prettier + ESLint per package, Prisma format
