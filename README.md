# MASAIL — Civic Issue Reporting Platform

Spring Boot API + React (Vite) frontend, containerized with Docker, backed by
PostgreSQL and cached with Redis. Implements the role/permission model,
Verified Resident application flow, restricted issue reporting, Field Officer
progress updates, and donation/support flows from the product spec
(`MASAIL-Product-Requirements.md`).

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript, Tailwind/shadcn (from the original demo) |
| Backend | Spring Boot 3.3 (Java 17), Spring Security + JWT, Spring Data JPA |
| Database | PostgreSQL 16 |
| Cache | Redis 7 (Spring Cache abstraction) |
| Reverse proxy / static hosting | Nginx (serves the built frontend, proxies `/api` to the backend) |
| Container orchestration | Docker Compose |

## Project layout

```
masail-app/
├── backend/                  Spring Boot API
│   ├── src/main/java/pk/masail/
│   │   ├── entity/           JPA entities (User, Issue, Donation, VerificationApplication, ...)
│   │   ├── repository/       Spring Data repositories
│   │   ├── service/          Business logic (auth, issues, verification, campaigns)
│   │   ├── controller/       REST controllers
│   │   ├── security/         JWT filter/service
│   │   ├── config/           Security, Redis cache, OpenAPI, demo data seeder
│   │   └── exception/        Global error handling
│   ├── src/main/resources/application*.yml
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                 React app (originally generated demo, extended with an API client)
│   ├── src/app/api/          client.ts, auth.ts, issues.ts, verification.ts
│   ├── Dockerfile
│   └── nginx.conf
├── infra/postgres/init.sql   Performance indexes
├── docker-compose.yml
├── .github/workflows/ci.yml  Build/test pipeline
└── MASAIL-Product-Requirements.md
```

## Run everything with Docker (recommended)

Requires Docker + Docker Compose only — no local Java/Node needed.

```bash
cd masail-app
cp .env.example .env        # optionally change JWT_SECRET
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api
- Swagger UI: http://localhost:8080/swagger-ui.html
- Postgres: localhost:5432 (`masail` / `masail`)
- Redis: localhost:6379

Demo accounts (seeded automatically, password for all: `Password123`):

| Email | Role |
|---|---|
| `user@masail.pk` | User (unverified) |
| `resident@masail.pk` | Verified Resident (area: Gulshan-e-Iqbal) |
| `officer@masail.pk` | Verification Officer |
| `field@masail.pk` | Field Officer |
| `admin@masail.pk` | Admin |

To stop: `docker compose down` (add `-v` to also wipe the Postgres/Redis volumes).

## Run locally without Docker

### Backend
```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```
Runs on an in-memory H2 database — no Postgres/Redis setup needed for local dev.
API available at `http://localhost:8080/api`.

### Frontend
```bash
cd frontend
cp .env.example .env
pnpm install
pnpm dev
```
Runs on `http://localhost:5173` and calls the backend directly at
`VITE_API_BASE_URL` (set this to `http://localhost:8080/api` in `.env` when
running the backend standalone without the Nginx proxy).

## Performance components included

- **Redis caching** (`CacheConfig.java`) — separate cache regions with tuned TTLs:
  issue feed (2 min), issue detail (5 min), campaigns (5 min), areas (12 hr),
  user profile (10 min). Cache is evicted on writes (new issue, donation,
  support toggle, progress update) so nothing serves stale state after a change.
- **HikariCP connection pool** tuned via `DB_POOL_SIZE` (`application.yml`).
- **Postgres indexes** (`infra/postgres/init.sql`) on the columns the API
  actually filters/sorts by: issue area/status/reporter/officer, donation
  issue/campaign + timestamp, verification status.
- **Gzip + long-cache headers** for static assets, and **JPA batch inserts**
  (`hibernate.jdbc.batch_size`) for bulk writes like photo uploads.
- **`open-in-view: false`** to avoid holding DB connections open across the
  whole request lifecycle.
- Multi-stage Docker builds for both services so runtime images stay small
  (JRE-alpine / nginx-alpine) and dependency layers are cached between builds.

## Security notes

- JWT bearer auth (`Authorization: Bearer <token>`), stateless sessions.
- Role enforcement happens twice: `@PreAuthorize` at the controller and an
  explicit business-rule check in `IssueService`/`VerificationService` (e.g. a
  Verified Resident can only report issues in their own verified area and only
  in the Road / Street Light / Sewerage categories — this is checked in code,
  not just documented).
- Passwords hashed with BCrypt.
- **Before deploying anywhere real**: replace `JWT_SECRET` and the Postgres
  password, put the app behind HTTPS, and swap `DDL_AUTO=update` for a proper
  migration tool (Flyway/Liquibase) once the schema stabilizes.

## What's stubbed vs. real

This is a runnable, working skeleton covering every requirement's backend
logic and API surface. Two things are intentionally left as follow-ups so you
can drop in your own choices:

1. **File uploads** — the API accepts photo *URLs* (`photoUrl`, `beforePhotoUrls`,
   `cnicFrontPhotoUrl`, etc.) rather than raw multipart upload handling. Wire
   these to S3/Cloudinary/local disk storage of your choice and pass the
   resulting URL in.
2. **Map pin-drop** — the backend already stores `latitude`/`longitude` on
   `Issue`; wiring the actual Google Maps/Mapbox draggable-pin UI into the
   existing `ReportIssue.tsx` step is a frontend task using whichever map SDK
   key you provision.
