# Gemini Project Analysis: Jedy-StarWarsKubernetes

This document provides a detailed analysis of the Jedy-StarWarsKubernetes project.

## 1. Project Overview

This project is a full-stack web application built with a modern technology stack. It consists of three main components:

1.  **A frontend client** built with Astro.
2.  **A backend API** developed with Python and FastAPI.
3.  **A PostgreSQL database** for data persistence.

The entire application is designed to be containerized using Docker and orchestrated with both Docker Compose for local development and Kubernetes for production deployment. The application serves as a proxy to the public Star Wars API (SWAPI) and includes user management features.

## 2. Technologies Used

- **Backend**:
  - **Framework**: FastAPI
  - **Language**: Python
  - **Database ORM**: SQLModel
  - **Authentication**: JWT (JSON Web Tokens) with `python-jose` and `passlib`.
  - **Testing**: `pytest`, `httpx`
  - **Dependencies**: `uvicorn`, `psycopg2-binary`, `httpx`.

- **Frontend**:
  - **Framework**: Astro
  - **Language**: TypeScript/JavaScript
  - **Package Manager**: npm

- **Database**:
  - PostgreSQL

- **Containerization & Orchestration**:
  - **Containerization**: Docker
  - **Local Orchestration**: Docker Compose
  - **Production Orchestration**: Kubernetes

## 3. Architecture

The application follows a microservices architecture, with a clear separation between the frontend, backend, and database.

### Backend

The backend is a FastAPI application that exposes a RESTful API. Its responsibilities include:
-   **User Management**: Handling user registration and login (`/users` route).
-   **SWAPI Proxy**: Fetching data from the external Star Wars API (`https://swapi.dev/api`) and exposing it through its own endpoints (`/swapi` route). This acts as a backend-for-frontend (BFF) pattern.
-   **Database Interaction**: Using SQLModel to interact with the PostgreSQL database for storing user data.

### Frontend

The frontend is a dynamic website built with Astro. It communicates with the backend API to fetch data and handle user interactions. It is configured to make API calls to the backend service.

### Database

A PostgreSQL database is used to store application data, primarily user information. The `compose.yaml` and `k8s/postgres.yaml` files define how the database is run and how its data is persisted using Docker volumes or Kubernetes PersistentVolumeClaims.

## 4. Deployment

The project is configured for two deployment environments: local development with Docker Compose and production with Kubernetes.

### Docker Compose (`compose.yaml`)

This file orchestrates the services for a local development environment:
-   **`database` service**: Runs a `postgres:16-alpine` image. It persists data in a named volume called `database`.
-   **`back` service**: Builds the backend Docker image from `./back/Dockerfile`. It connects to the `database` service and exposes port 4000.
-   **`front` service**: Builds the frontend Docker image from `./front/Dockerfile`. It depends on the `back` service and exposes port 3000.

### Kubernetes (`k8s/`)

The `k8s` directory contains the configuration files for deploying the application to a Kubernetes cluster.

-   **`postgres.yaml`**:
    -   `PersistentVolumeClaim`: Requests persistent storage for the database to ensure data is not lost if the pod restarts.
    -   `Deployment`: Manages the PostgreSQL pod. It uses a secret (`pgpassword`) to manage the database password securely.
    -   `Service`: Creates a `ClusterIP` service (`postgres-cluster-ip-service`) to allow the backend to communicate with the database within the cluster.

-   **`back.yaml`**:
    -   `Deployment`: Deploys the backend application with 3 replicas for high availability.
    -   `Service`: Creates a `ClusterIP` service (`back-cluster-ip-service`) to expose the backend internally.

-   **`front.yaml`**:
    -   `Deployment`: Deploys the frontend application with 3 replicas.
    -   `Service`: Creates a `ClusterIP` service (`front-cluster-ip-service`) to expose the frontend internally.

-   **`ingress.yaml`**:
    -   `Ingress`: Manages external access to the application using an Nginx Ingress Controller.
    -   It routes traffic based on the URL path:
        -   Requests to `/api/?(.*)` are routed to the backend service (`back-cluster-ip-service`). The `rewrite-target` annotation removes the `/api` prefix before forwarding the request.
        -   All other requests (`/?(.*)`) are routed to the frontend service (`front-cluster-ip-service`).

## 5. How to Run the Project

### Using Docker Compose (Local Development)

1.  **Prerequisites**: Docker and Docker Compose installed.
2.  **Build and Run**: From the root of the project, run the following command:
    ```bash
    docker-compose up --build
    ```
- **Access**:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000`

## 6. Testing

The backend of the project includes a comprehensive testing suite built with `pytest` and `httpx`. The tests are organized in the `back/tests` directory and follow a Test-Driven Development (TDD) approach.

### Running the Tests

To run the tests, execute the following command from the root of the project:

```bash
docker-compose exec back pytest
```

The tests are configured to run against a separate, in-memory SQLite database to ensure test isolation and prevent interference with the development database.


### Using Kubernetes (Production)

1.  **Prerequisites**: A running Kubernetes cluster (e.g., Minikube, Docker Desktop Kubernetes, or a cloud provider) and `kubectl` configured. An Ingress controller (like Nginx) must be installed in the cluster.
2.  **Create Secret**: The backend requires a database password secret. Create it with the following command:
    ```bash
    kubectl create secret generic pgpassword --from-literal=PGPASSWORD=<your-postgres-password>
    ```
3.  **Apply Configurations**: Apply all the Kubernetes configuration files from the `k8s` directory:
    ```bash
    kubectl apply -f k8s/
    ```
4.  **Access**:
    -   Find the IP address of your Ingress controller. If using Minikube, you can run `minikube ip`.
    -   Access the application at the Ingress IP address. The frontend will be at `/` and the API at `/api`.
