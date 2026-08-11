<div align="center">

# 🏛️ MASAIL — Civic Issue Reporting Platform

**Empowering Citizens, Fixing Communities**

A full-stack, enterprise-grade civic issue reporting and resolution platform.  
Built with Spring Boot 3, React (Vite), PostgreSQL, Redis, and containerized with Docker.

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Running with Docker (Recommended)](#running-with-docker-recommended)
  - [Running Locally without Docker](#running-locally-without-docker)
- [Demo User Accounts](#-demo-user-accounts)
- [Performance & Scaling](#-performance--scaling)
- [Security & RBAC Architecture](#-security--rbac-architecture)
- [API Documentation](#-api-documentation)
- [License](#-license)

---

## 🔍 Overview

**MASAIL** is designed to streamline civic complaint management, resident identity verification, community crowdfunding for local infrastructure repair, and field officer dispatch. It enforces strict area-based verification and role-based permissions to ensure high data integrity and accountability across municipalities.

---

## ✨ Key Features

- 🆔 **Verified Resident Application Flow**: Residents apply for verified status by submitting CNIC documentation and residential proof. Verification officers approve/reject requests.
- 📍 **Restricted & Geofenced Issue Reporting**: Verified residents can report hyper-local civic issues (Road, Sewerage, Street Lighting) constrained to their verified residential area.
- 📸 **Multi-Phase Photo Evidence**: Supports Before/After phase photos for auditing issue resolution progress transparently.
- 👷 **Field Officer Dispatch & Operations**: Field officers are assigned to issues to update resolution progress and attach work-in-progress proof photos.
- 💰 **Community Crowdfunding & Support**: Citizens can upvote issues and contribute micro-donations directly to transparent civic repair campaigns.
- 🛡️ **Dual-Layer Security & RBAC**: Controller-level `@PreAuthorize` alongside service-level business rule validation.
- ⚡ **High-Performance Caching**: Redis integration with region-specific TTLs and auto-eviction on write events.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 18 + Vite + TypeScript | Modern UI with Tailwind CSS & Shadcn/UI components |
| **Backend** | Spring Boot 3.3 (Java 17) | RESTful API, Spring Security, Spring Data JPA |
| **Database** | PostgreSQL 16 | Relational store with custom indexing on queries |
| **Caching** | Redis 7 | Spring Cache abstraction with fine-grained TTLs |
| **Web Server / Proxy** | Nginx | Reverse proxying `/api` requests to Spring Boot |
| **Containerization** | Docker & Docker Compose | Multi-stage production container builds |

---

## 📂 Project Architecture

```
masail-app/
├── backend/                      # Spring Boot 3 API
│   ├── src/main/java/pk/masail/
│   │   ├── config/               # Security, Redis cache, Swagger OpenAPI, Data seeder
│   │   ├── controller/           # RESTful Endpoints
│   │   ├── dto/                  # Request/Response Data Transfer Objects
│   │   ├── entity/               # JPA Domain Models (User, Issue, Campaign, etc.)
│   │   ├── exception/            # Global Exception Handling
│   │   ├── repository/           # Spring Data JPA Repositories
│   │   ├── security/             # JWT Authentication & Authorization Filters
│   │   └── service/              # Core Domain Logic & Business Rules
│   ├── src/main/resources/       # Environment Profiles (local, docker)
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                     # React 18 + Vite SPA
│   ├── src/app/
│   │   ├── api/                  # Axios HTTP API Clients
│   │   ├── components/           # UI Components & Page Views
│   │   ├── context/              # React Auth Context & Global State
│   │   └── routes.tsx            # Application Routing
│   ├── Dockerfile
│   └── nginx.conf
├── infra/postgres/init.sql       # Database Performance Indexing & Schemas
├── docker-compose.yml            # Multi-container Compose Orchestration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Recommended)
- *Or* Java 17+, Node.js 18+, and pnpm (for non-Docker execution)

---

### Running with Docker (Recommended)

Requires Docker Compose only — no manual setup of Java or Node is needed.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/masail-app.git
   cd masail-app
   ```

2. **Setup environment configuration:**
   ```bash
   cp .env.example .env
   ```

3. **Build and launch containers:**
   ```bash
   docker compose up --build
   ```

4. **Access the application services:**
   - 🌐 **Frontend SPA**: [http://localhost:5173](http://localhost:5173)
   - ⚙️ **Backend API**: [http://localhost:8080/api](http://localhost:8080/api)
   - 📜 **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
   - 🐘 **PostgreSQL**: `localhost:5432` (`User: masail` | `Pass: masail`)
   - 🔴 **Redis**: `localhost:6379`

To stop all services:
```bash
docker compose down
# Add -v to reset database/cache volumes: docker compose down -v
```

---

### Running Locally without Docker

#### 1. Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```
*Note: Uses an in-memory H2 database for local development. API runs on `http://localhost:8080/api`.*

#### 2. Frontend (React + Vite)
```bash
cd frontend
cp .env.example .env
pnpm install
pnpm dev
```
*App will launch at `http://localhost:5173`.*

---

## 👤 Demo User Accounts

The platform automatically seeds demo accounts for testing all user roles (Password for all accounts: `Password123`):

| Role | Email | Privileges / Area |
|---|---|---|
| 👤 **User (Unverified)** | `user@masail.pk` | Can view public issues, upvote, & apply for verification |
| 🏡 **Verified Resident** | `resident@masail.pk` | Can report issues in verified area (`Gulshan-e-Iqbal`) |
| 🛂 **Verification Officer** | `officer@masail.pk` | Reviews & approves/rejects resident applications |
| 👷 **Field Officer** | `field@masail.pk` | Updates issue progress & attaches resolution photo proof |
| ⚡ **Admin** | `admin@masail.pk` | Full system oversight & user/role management |

---

## ⚡ Performance & Scaling

- **Redis Caching Tier**: Implemented via `@Cacheable` with specialized TTL regions:
  - Issue Feed: `2 minutes`
  - Issue Details: `5 minutes`
  - Campaigns: `5 minutes`
  - Areas: `12 hours`
  - User Profiles: `10 minutes`
- **Cache Eviction**: Automated cache invalidation on mutation events (`@CacheEvict`) ensuring clean state read-after-write consistency.
- **Optimized HikariCP Connection Pooling**: Tuned for high concurrency (`DB_POOL_SIZE`).
- **PostgreSQL Database Indexing**: Compound indexing on `area`, `status`, `reporter_id`, `officer_id`, and `created_at` in [`infra/postgres/init.sql`](file:///c:/Users/Uzair/OneDrive/Desktop/masail-app/infra/postgres/init.sql).
- **Stateless DB Connections**: Configured `open-in-view: false` to free DB connection handles instantly after transactions complete.

---

## 🔒 Security & RBAC Architecture

- **Stateless JWT Authentication**: Secure bearer tokens (`Authorization: Bearer <token>`).
- **BCrypt Password Encryption**: All credentials hashed with BCrypt.
- **Double-Layer Authorization**: Enforces `@PreAuthorize` at controller endpoints AND strict validation rules inside service classes (e.g. verifying residents are restricted strictly to reporting in their approved zip code/area).

---

## 📖 API Documentation

Interactive OpenAPI / Swagger documentation is available out of the box when running the backend service:

- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI Spec**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
