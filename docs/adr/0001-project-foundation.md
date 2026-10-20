# ADR 0001 — Project foundation

- **Status:** Accepted
- **Date:** 2026-10-20
- **Deciders:** StockPilot maintainers

## Context

StockPilot is a full-stack portfolio project built to practice Laravel and Angular while producing a realistic, deployable product. The author has a JavaScript/TypeScript background, limited weekly time and no previous professional PHP or Angular experience. The project must look credible to hiring teams without becoming an unbounded rewrite.

## Decision

1. **Monorepo with two deployables.** The API lives in `apps/api` and the SPA in `apps/web`. Both are independent builds, but they share one repository, one contract directory and one CI configuration.
2. **Docker Engine inside WSL2.** Development runs on Docker Engine 29 with Compose v2. Docker Desktop is intentionally not required; the WSL distribution keeps the project on the Linux filesystem for performance.
3. **Backend stack.** Laravel 13 on PHP 8.5, MySQL 8.4 and Redis 8. Sanctum handles SPA cookie authentication. PHPUnit, Larastan and Pint provide the default quality gate.
4. **Frontend stack.** Angular 22 with standalone components, signals, SCSS and Vitest. The Angular CLI dev server runs natively; a `frontend` Compose profile offers a containerized alternative.
5. **Nginx terminates HTTP.** Nginx serves the Laravel public directory and forwards PHP requests to PHP-FPM. MySQL and Redis are only reachable from the Compose network; MySQL is exposed on host port `3307` for database tools.
6. **Multi-tenant-ready domain.** Organizations, memberships and tenant scoping are designed from the start, even though the MVP uses one organization per user.
7. **Stock ledger first.** Movements are the immutable source of truth; balances are a materialized projection updated in database transactions.
8. **Explainable forecasting.** The product calculates demand averages, safety stock, reorder points and suggested quantities with explicit formulas. AI and machine learning are out of scope.

## Consequences

### Positive

- A single `docker compose up` gives a reproducible backend environment.
- CI can run backend, frontend and infrastructure checks independently.
- The domain model supports future multi-tenant growth without a rewrite.
- The ledger design makes stock changes auditable and testable.

### Negative

- The monorepo needs disciplined path filters and ownership rules.
- Docker Engine in WSL2 requires the developer to work from a WSL terminal rather than Docker Desktop.
- MySQL is exposed on a non-default host port to coexist with other local projects.
- Two runtimes (PHP and Node) increase the setup surface compared with a single-language project.

## Follow-ups

- Add OpenAPI generation from Laravel routes in phase 1.
- Add authentication and tenant isolation tests in phase 1.
- Evaluate a production image stage and a free-tier deployment target in phase 6.
