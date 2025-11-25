# Jedy-StarWarsKubernetes

This project is a full-stack web application built with a modern technology stack, designed to be containerized with Docker and orchestrated with Kubernetes. It serves as a proxy to the public Star Wars API (SWAPI) and includes user management features.

## Architecture

The application follows a microservices architecture, with a clear separation between the frontend, backend, and database.

- **Frontend**: A dynamic website built with [Astro](https://astro.build/). It uses a Node.js adapter for Server-Side Rendering (SSR).
- **Backend**: A RESTful API built with [Python](https://www.python.org/) and [FastAPI](https://fastapi.tiangolo.com/).
- **Database**: A [PostgreSQL](https://www.postgresql.org/) database for data persistence.
- **Gateway**: An **Envoy Gateway** acts as the single entry point (Ingress) for the cluster, routing traffic to the appropriate services.

## Gateway & Routing Mechanism

This project uses the [Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/) implementation by [Envoy Gateway](https://gateway.envoyproxy.io/).

### How it works on Localhost

When you deploy this stack on a local Kubernetes cluster (like Docker Desktop, Kind, or Minikube):

1. **Gateway Creation**: The `deploy/gateway.yaml` file creates a `Gateway` resource. The Envoy Gateway Controller detects this and automatically provisions an Envoy Proxy (deployment and service).
2. **LoadBalancer Binding**: The Envoy Proxy service is of type `LoadBalancer`. On Docker Desktop, this service automatically binds to `localhost` on port 80.
3. **Route Matching**:
    - The `deploy/routes.yaml` file defines `HTTPRoute` rules attached to the Gateway.
    - **`/api` prefix**: Traffic starting with `/api` is routed to the **Backend** service (`back-cluster-ip-service`). The `/api` prefix is stripped before reaching the backend application.
    - **`/` (root)**: All other traffic is routed to the **Frontend** service (`front-cluster-ip-service`).
4. **Access**: When you visit `http://localhost` in your browser, your request hits the Envoy Proxy, which matches the route and forwards it to the Frontend Pod. When the frontend makes API calls to `/api/...`, Envoy routes them to the Backend Pod.

## Local Development (Docker Compose)

You can run the entire stack locally without Kubernetes using Docker Compose.

### Development Mode
Best for coding. Hot-reloading is enabled.

```bash
docker compose up --build
```

- **App**: [http://localhost:4321](http://localhost:4321)
- **API**: [http://localhost:4000](http://localhost:4000)

### Production Preview
Simulates the production build (optimized images, no hot-reload).

```bash
docker compose -f compose.yaml -f compose.production.yaml up --build
```

- **App**: [http://localhost:8080](http://localhost:8080)
- **API**: [http://localhost:4000](http://localhost:4000)

## Kubernetes Deployment

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Kubernetes](https://kubernetes.io/) (Docker Desktop with Kubernetes enabled is recommended)
- [Helm](https://helm.sh/docs/intro/install/) (for installing Envoy Gateway)

### Installation & Deployment

#### 1. Install Envoy Gateway

First, install the Envoy Gateway controller in your cluster:

```bash
helm install eg oci://docker.io/envoyproxy/gateway-helm --version v1.6.0 -n envoy-gateway-system --create-namespace
```

Wait for the controller to be ready:

```bash
kubectl wait --timeout=5m -n envoy-gateway-system deployment/envoy-gateway --for=condition=Available
```

#### 2. Create Namespace

```bash
kubectl create ns starwars
```

#### 2. Deploy the Application

Create the necessary secrets (Database & Google Gemini API):

```bash
# Create secret for JWT token session
kubectl create secret generic jwt-secret --from-literal=JWT_SECRET=MyBestSecret
# Create secret for pgsql password
kubectl create secret generic pgpassword --from-literal=PGPASSWORD=star_wars_password
# Replace with your actual Gemini API Key
kubectl create secret generic google-api-key --from-literal=GOOGLE_API_KEY=AIzaSy...
# Or Open Router
kubectl create secret generic openrouter-api-key --from-literal=OPENROUTER_API_KEY=sk-or-v1...
```

Apply the Gateway Class (links K8s Gateway API to Envoy):

```bash
kubectl apply -f deploy/gatewayclass.yaml
```

Apply the ConfigMap (Application Configuration):

```bash
kubectl apply -f deploy/configmap.yaml
```

Deploy the entire stack (Database, Backend, Frontend, Gateway, Routes):

```bash
kubectl apply -f deploy/postgres.yaml
kubectl apply -f deploy/back.yaml
kubectl apply -f deploy/front.yaml
kubectl apply -f deploy/gateway.yaml
kubectl apply -f deploy/routes.yaml
```

### CI/CD Pipeline

The project includes a GitHub Actions pipeline (`.github/workflows/ci-release.yml`) that automatically tests, builds, and pushes Docker images to Docker Hub when a new tag (e.g., `v1.0.0`) is pushed.

**Prerequisites:**
You must configure the following **Secrets** in your GitHub Repository settings:

- `DOCKER_USERNAME`: Your Docker Hub username.
- `DOCKER_PASSWORD`: Your Docker Hub access token or password.
- `GOOGLE_API_KEY`: (Optional) For running tests that might require AI access.
- `OPENROUTER_API_KEY`: (Optional) For running tests that might require AI access.

#### 3. Access the Application

Once all pods are running (`kubectl get pods`), you can access the application at:

- **App**: [http://localhost](http://localhost)
- **API Docs**: [http://localhost/api/docs](http://localhost/api/docs)

### Production Images

The project utilizes optimized Dockerfiles for production:

- **Backend**: Uses a multi-stage build based on `python:3.14-slim`. It uses `uv` for fast dependency management and runs as a non-root user (`appuser`).
- **Frontend**: Uses a multi-stage build based on `node:24-alpine`. It installs only production dependencies and runs as a non-root user (`node`).

## Debugging & Maintenance

Here is a list of useful commands to manage, debug, and update your deployment.

### Rebuilding & Updating Images

If you modify the code, you need to rebuild the Docker images and force Kubernetes to restart the pods.

1. **Rebuild Production Images:**

    ```bash
    # Backend
    docker build -f back/Dockerfile.prod -t jedy-starwarskubernetes-back:latest back/
    
    # Frontend
    docker build -f front/Dockerfile.prod -t jedy-starwarskubernetes-front:latest front/
    ```

2. **Apply Updates (Rolling Restart):**
    This command forces the deployment to pick up the new image (if the tag hasn't changed) or apply configuration changes.

    ```bash
    kubectl rollout restart deployment back-deployment
    kubectl rollout restart deployment front-deployment
    ```

3. **Check Rollout Status:**

    Verify that the new pods are successfully starting.

    ```bash
    kubectl rollout status deployment back-deployment
    kubectl rollout status deployment front-deployment
    ```

### Monitoring & Logs

- **Check Pod Status:**
    See if pods are `Running`, `Pending`, or in `CrashLoopBackoff`.

    ```bash
    kubectl get pods
    ```

- **View Logs:**

    View logs for a specific component (using labels).

    ```bash
    # Backend Logs
    kubectl logs -l component=back --tail=100 -f
    
    # Frontend Logs
    kubectl logs -l component=front --tail=100 -f
    
    # Envoy Gateway Logs (System)
    kubectl logs -n envoy-gateway-system -l app.kubernetes.io/name=envoy-gateway
    ```

### Troubleshooting

- **Scale Down/Up:**
    Useful if you need to stop the service temporarily or debug race conditions (e.g., database init).

    ```bash
    # Scale to 0 (Stop)
    kubectl scale deployment back-deployment --replicas=0
    
    # Scale to 1 (Debug/Init)
    kubectl scale deployment back-deployment --replicas=1
    
    # Scale to 3 (Production)
    kubectl scale deployment back-deployment --replicas=3
    ```

- **Verify Services & Networking:**

    ```bash
    # Check Services (ClusterIPs)
    kubectl get svc
    
    # Check Gateway & Routes status
    kubectl get gateway -A
    kubectl get httproute -A
    ```

## Clean-Up

### 1. Delete Kuberntes Manifests

```bash
cd deploy & kubectl delete -f .
```

### 2. Uninstall Envoy gateway

Delete the GatewayClass, Gateway, HTTPRoute and Example App:

```bash
kubectl delete -f https://github.com/envoyproxy/gateway/releases/download/v1.6.0/quickstart.yaml --ignore-not-found=true
```

Delete secrets (Database & Google Gemini API):

```bash
#
kubectl delete secret generic jwt-secret
# 
kubectl delete secret pgpassword
# Replace with your actual Gemini API Key
kubectl delete secret google-api-key
# Or Open Router
kubectl delete secret open-router-key
```

Delete the Gateway API CRDs and Envoy Gateway:

```bash
helm uninstall eg -n envoy-gateway-system
```
