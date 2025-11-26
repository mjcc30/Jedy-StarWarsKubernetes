# Gemini Project Analysis: Jedy-StarWarsKubernetes

This document provides a detailed analysis of the Jedy-StarWarsKubernetes project.

## 1. Project Overview

This project is a full-stack web application built with a modern technology stack. It consists of three main components:

1. **A frontend client** built with Astro (SSR).
2. **A backend API** developed with Python and FastAPI.
3. **A PostgreSQL database** for data persistence.

The entire application is designed to be containerized using Docker and orchestrated with both Docker Compose for local development (and production preview) and Kubernetes for production deployment. The application serves as a proxy to the public Star Wars API (SWAPI), includes user management features, and integrates generative AI capabilities.

## 2. Technologies Used

- **Backend**:
  - **Framework**: FastAPI
  - **Language**: Python
  - **Database ORM**: SQLModel
  - **Package Manager**: `uv` (for fast builds)
  - **Authentication**: JWT (JSON Web Tokens) with `python-jose` and `passlib`.
  - **AI**: Google Gemini 2.5 (Flash/Nano Banana) & OpenRouter.
  - **Testing**: `pytest`, `httpx`

- **Frontend**:
  - **Framework**: Astro (Node.js Adapter)
  - **Language**: TypeScript/JavaScript
  - **Styling**: Tailwind CSS
  - **Package Manager**: npm

- **Database**:
  - PostgreSQL 16

- **Containerization & Orchestration**:
  - **Containerization**: Docker (Multi-stage builds)
  - **Local Orchestration**: Docker Compose
  - **Production Orchestration**: Kubernetes
  - **Ingress/Routing**: Kubernetes Gateway API (Envoy Gateway)

## 3. Architecture

The application follows a microservices architecture.

### Backend

The backend is a FastAPI application that exposes a RESTful API. Its responsibilities include:

- **User Management**: Handling user registration and login (`/users`).
- **SWAPI Proxy**: Fetching data from SWAPI and caching/enhancing it.
- **AI Services**: providing Chat and Image generation endpoints (`/ai`).
- **Database Interaction**: Storing user and image cache data.

### Frontend

The frontend is a dynamic website built with Astro (Server-Side Rendering). It fetches data from the backend API to render pages.

### Database

A PostgreSQL database stores user credentials and cached AI images.

## 4. Deployment

### Docker Compose (`compose.yaml` & `compose.production.yaml`)

- **`database`**: `postgres:16-alpine`.
- **`back`**: Python/FastAPI service (Port 4000).
- **`front`**: Astro Node.js service (Port 4321 in dev, 8080 in prod preview).

### Kubernetes (`deploy/`)

The `deploy` directory contains Kubernetes manifests:

- **`gateway.yaml` & `routes.yaml`**: Uses the Gateway API (Envoy) to route traffic.
  - `/api/*` -> Backend Service
  - `/*` -> Frontend Service
- **`postgres.yaml`**: Database Deployment + PVC.
- **`back.yaml`**: Backend Deployment + Service.
- **`front.yaml`**: Frontend Deployment + Service.
- **`configmap.yaml` & `gatewayclass.yaml`**: Configuration and Gateway setup.

## 5. How to Run the Project

See `README.md` for detailed instructions on:

- Local Development (`docker compose up`)
- Production Preview (`docker compose -f ...`)
- Kubernetes Deployment (`kubectl apply ...`)

## 6. Testing

The backend includes a TDD suite using `pytest`.
Run tests via: `docker compose exec back pytest`
