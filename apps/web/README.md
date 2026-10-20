# StockPilot Web

Angular 22 SPA for StockPilot. It talks to the Laravel API through the `/api` proxy and renders the inventory workspace.

## Local development

From this directory:

```bash
npm install
npm start
```

The app runs on <http://localhost:4200> and proxies `/api` to <http://localhost:8000>. See the [root README](../../README.md) for the backend stack.

## Quality gates

```bash
npm run lint
npm run format:check
npm test -- --watch=false
npm run build
```
