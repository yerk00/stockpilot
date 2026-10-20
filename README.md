# StockPilot

Multi-warehouse inventory management with demand forecasting and replenishment suggestions. StockPilot helps small distributors answer one question every morning: **what do I need to buy today to avoid running out of stock next week?**

> Status: **phase 0 — walking skeleton**. The repository bootstraps the Laravel API, the Angular SPA, Docker infrastructure, the health check and CI. Authentication, catalog, stock, purchasing and forecasting land in the next phases.

## Stack

| Layer   | Technology                                        |
| ------- | ------------------------------------------------- |
| API     | Laravel 13, PHP 8.5, Sanctum                      |
| Web     | Angular 22, TypeScript, SCSS                      |
| Data    | MySQL 8.4, Redis 8                                |
| Runtime | Docker Engine in WSL2, Docker Compose             |
| Quality | PHPUnit, Larastan, Pint, ESLint, Prettier, Vitest |
| CI      | GitHub Actions with path filters                  |

## Repository layout

```
stockpilot/
├── apps/
│   ├── api/                  # Laravel API
│   └── web/                  # Angular SPA
├── contracts/                # OpenAPI contract
├── docker/
│   ├── php/                  # PHP-FPM image
│   └── nginx/                # Nginx virtual host
├── docs/
│   ├── adr/                  # Architecture decision records
│   └── diagrams/             # Architecture diagrams
├── .github/workflows/        # API, web and infra pipelines
├── compose.yaml
└── README.md
```

## Quick start

Prerequisites: WSL2 with Docker Engine 29+, Docker Compose v2, Node.js 22.23+ and Git.

```bash
git clone <your-repository-url> stockpilot
cd stockpilot
cp .env.example .env
cp apps/api/.env.example apps/api/.env

# Build and install the API dependencies once
docker compose build api
docker compose run --rm --no-deps -u 1000:1000 -e COMPOSER_HOME=/tmp/composer api composer install

# Start the backend stack
docker compose up -d

# Generate the application key and migrate the database
docker compose exec -u 1000:1000 api php artisan key:generate
docker compose exec -u 1000:1000 api php artisan migrate
```

Start the Angular development server in another terminal:

```bash
cd apps/web
npm install
npm start
```

Open:

- Web: <http://localhost:4200>
- API health: <http://localhost:8000/api/health>
- Mailpit: <http://localhost:8025>

### Optional services

```bash
# Database UI on http://localhost:8081
docker compose --profile tools up -d db-admin

# Angular inside Docker on http://localhost:4200
docker compose --profile frontend up -d web
```

## Services and ports

| Service    | Host port       | Notes                                                                       |
| ---------- | --------------- | --------------------------------------------------------------------------- |
| `nginx`    | `8000`          | Laravel public entrypoint                                                   |
| `api`      | internal `9000` | PHP-FPM                                                                     |
| `web`      | `4200`          | Angular dev server (native by default, optional Docker profile)             |
| `db`       | `3307`          | MySQL. Internal port is `3306`; host `3306` is left free for other projects |
| `redis`    | `6379`          | Cache, sessions and queues                                                  |
| `mail`     | `8025` / `1025` | Mailpit UI / SMTP                                                           |
| `db-admin` | `8081`          | Adminer, profile `tools`                                                    |

## Daily commands

```bash
# Logs
docker compose logs -f api nginx

# API shell
docker compose exec -u 1000:1000 api bash

# Migrations
docker compose exec -u 1000:1000 api php artisan migrate

# Tests and static analysis
docker compose exec -u 1000:1000 api php artisan test
docker compose exec -u 1000:1000 api ./vendor/bin/pint
docker compose exec -u 1000:1000 api ./vendor/bin/phpstan analyse

# Frontend checks
cd apps/web
npm run lint
npm run format:check
npm test -- --watch=false
npm run build
```

## How it is designed

- **Monorepo, separate deployables.** `apps/api` and `apps/web` can be built and released independently. CI uses path filters so a frontend change does not run the backend pipeline.
- **Multi-tenant ready from day one.** Organizations and memberships are part of the domain model; the MVP uses one organization per user.
- **Stock is a ledger.** `stock_movements` is the source of truth and `stocks` is a materialized balance updated inside transactions. Negative stock is rejected.
- **Forecasting is explainable.** Average daily demand, safety stock, reorder point, suggested quantity and stockout date are calculated with documented formulas. No machine learning.
- **Pragmatic clean code.** Controllers validate through Form Requests, delegate to actions and return API Resources. No generic repositories or ceremonial DDD layers.

See [docs/adr/0001-project-foundation.md](docs/adr/0001-project-foundation.md) for the founding decisions.

## Roadmap

- [x] Phase 0 — walking skeleton, Docker, health check, CI
- [ ] Phase 1 — authentication, organizations, catalog
- [ ] Phase 2 — stock ledger, balances and transfers
- [ ] Phase 3 — suppliers and purchase orders
- [ ] Phase 4 — demand forecasting and dashboard
- [ ] Phase 5 — hardening, E2E tests and security review
- [ ] Phase 6 — deployment, demo data and presentation

## Conventions

- Commits: `feat(api): ...`, `feat(web): ...`, `chore(infra): ...`, `docs(adr): ...`
- UI copy in Spanish; code, documentation and commit messages in English.
- Keep secrets out of the repository. `.env` files are ignored; `.env.example` files are committed.

## License

MIT. See [LICENSE](LICENSE).
