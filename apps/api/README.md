# StockPilot API

Laravel 13 API for StockPilot. It exposes the HTTP contract, owns the domain model and runs the forecasting jobs.

## Local development

The API runs inside Docker Compose. From the repository root:

```bash
docker compose up -d
docker compose exec -u 1000:1000 api php artisan test
```

See the [root README](../../README.md) for the complete setup, services and commands.

## Endpoints

| Method | Path          | Description                              |
| ------ | ------------- | ---------------------------------------- |
| `GET`  | `/api/health` | Database and Redis health check          |
| `GET`  | `/api/user`   | Authenticated user, protected by Sanctum |

## Quality gates

```bash
docker compose exec -u 1000:1000 api php artisan test
docker compose exec -u 1000:1000 api ./vendor/bin/pint
docker compose exec -u 1000:1000 api ./vendor/bin/phpstan analyse
```
