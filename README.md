# fatihozkurtcom Frontend

Frontend application for `fatihozkurt.com`.

This project includes:
- Public one-page portfolio surface
- Hidden admin panel UI (configurable route)
- Responsive layouts for desktop/tablet/mobile
- API-driven content rendering from backend
- Rich project cards, modal details, pagination, and media gallery behavior

## Stack

- React 19 + Vite 7
- Tailwind CSS 4
- Lucide React
- Vitest + Testing Library
- Nginx (container runtime)
- Docker Compose

## Features

- Locale switching (`en` / `tr`) with persistent UI locale
- Header-aware section scrolling and active nav sync
- API-backed hero/about/projects/writings/resume/contact rendering
- Project detail modal with gallery slider support
- Contact form with backend submit flow
- Hidden admin route:
  - `/auth` (default)
  - content CRUD orchestration
  - file upload driven flows (resume/images/icons)

## Environment

Optional env:

- `VITE_API_BASE_URL`
- `VITE_ADMIN_PATH` (default: `/auth`)

If empty, frontend falls back to current origin.

## Run Locally

```bash
pnpm install
pnpm dev
```

Default dev URL:
- `http://localhost:5173`

## Quality

```bash
pnpm test
pnpm build
pnpm lint
```

## Docker

```bash
docker compose up -d --build
```

Default container URL:
- `http://localhost`

Backend expectation:
- Backend should be reachable at `http://localhost:8080`.

Health endpoint:
- `http://localhost/health`

## Routes

- Public: `/`
- Auth UI: `VITE_ADMIN_PATH` (default `/auth`)
- Reset password UI: `${VITE_ADMIN_PATH}/reset-password?token=...`

## Notes for Production

- Keep admin route undiscoverable from public nav
- Point frontend and backend behind same domain/reverse proxy when possible
- Handle `/api/*` routing at the host reverse-proxy layer (not inside frontend container Nginx)
- Ensure CSP, cache, and security headers are preserved at gateway level
- Keep uploaded asset handling and mail flows validated through backend

## Testing Coverage (current)

- Main public render and language switch
- Navigation scroll behavior
- Project modal open/close and escape close
- Hidden auth route rendering
- Empty-data rendering scenarios

---
For server rollout, pair this repo with backend deployment and verify `admin route -> save -> public reflection` after release.
