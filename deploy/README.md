# Kubernetes Deployment Manifests

This directory contains the Kubernetes manifest files required to deploy the Jedy-StarWarsKubernetes application.

## File Descriptions

- **`gatewayclass.yaml`**: Registers the `GatewayClass` with the cluster, linking the Kubernetes Gateway API to the Envoy Gateway controller.
- **`gateway-infra.yaml`**: Defines the shared `Gateway` (`infra-gateway`) in the `gateways` namespace. It acts as the central entry point for all namespaces.
- **`routes.yaml`**: Defines `HTTPRoute` resources to route traffic from the shared Gateway to the Backend (`/api`) and Frontend (`/`) services in the `starwars` namespace.
- **`dashboard-route.yaml`**: Defines an `HTTPRoute` to expose the Kubernetes Dashboard (`/dashboard`) via the shared Gateway.
- **`back-configmap.yaml`**: Configuration for the Backend service.
- **`front-configmap.yaml`**: Configuration for the Frontend service.
- **`front.yaml`**: Deploys the Frontend application (`Deployment`) and exposes it internally (`Service`).
- **`postgres.yaml`**: Deploys the PostgreSQL database using a **StatefulSet** (best practice for DBs) and a Headless Service.
- **`dashboard-admin.yaml`**: Configures an `admin-user` ServiceAccount for accessing the official Kubernetes Dashboard with full privileges.
- **`back.yaml`**: Deploys the Backend API (`Deployment`) and exposes it internally (`Service`).
- **`front.yaml`**: Deploys the Frontend application (`Deployment`) and exposes it internally (`Service`).
- **`dashboard-admin.yaml`**: Configures an `admin-user` ServiceAccount for accessing the official Kubernetes Dashboard with full privileges.
- **`hpa.yaml`**: Defines a `HorizontalPodAutoscaler` to automatically scale the backend pods based on CPU usage.

## Autoscaling (HPA)

The project uses the **Horizontal Pod Autoscaler (HPA)** to automatically adjust the number of backend pods based on traffic load (CPU utilization).

### Prerequisites (Metrics Server)

The HPA requires the Metrics Server to be installed in the cluster to retrieve CPU/Memory stats.

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
# For Docker Desktop (Self-signed cert fix):
kubectl patch -n kube-system deployment metrics-server --type=json \
  -p '[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'
```

### Configuration

Defined in `hpa.yaml`:

- **Target**: `back-deployment`
- **Scale Trigger**: **50% CPU** utilization (relative to the requested 100m).
- **Min Replicas**: 1 (to save resources when idle).
- **Max Replicas**: 5 (to handle traffic spikes).

### Monitoring Scale

You can watch the autoscaler in action:

```bash

kubectl get hpa -n starwars --watch

```

### Testing Autoscaling (Load Test)

To verify the HPA, we use **K6** to simulate realistic traffic.

1. **Start Load Generator:**

```bash

just load-test

```

*(This runs a K6 job inside the cluster targeting `http://back-cluster-ip-service:4000/`)*

2. **Observe Scaling:**

Run `kubectl get hpa -n starwars --watch`. You will see the CPU load increase (e.g., `200%/50%`) and the `REPLICAS` count go up.

3. **Stop Test:**

The test stops automatically, or force stop with:

```bash
just stop-load
```

*Note: The cluster will take a few minutes (cooldown period) to scale back down.*

## Resilience & Health Checks

To ensure high availability and **Zero Downtime Deployments**, the `Deployment` manifests (`back.yaml` and `front.yaml`) include configured Probes.

### Readiness Probe

- **Purpose**: Tells Kubernetes when the application is ready to accept traffic.
- **Behavior**: Kubernetes waits for this probe to pass before adding the Pod to the Service's load balancer. During a rolling update, Kubernetes **will not terminate the old Pods** until the new ones are marked as Ready.
- **Result**: Prevents traffic from being sent to broken or starting containers.

### Liveness Probe

- **Purpose**: Checks if the application is still alive and functioning.
- **Behavior**: If this probe fails (e.g., deadlock, infinite loop), Kubernetes restarts the container automatically.
- **Result**: Self-healing application.

## Startup Robustness (InitContainers)

To prevent the Backend from crashing if the Database is not yet ready (common during full stack deployments), `back.yaml` includes an **InitContainer**.

- **Mechanism**: A lightweight `busybox` container runs before the main application.
- **Action**: It loops checking the connectivity to the Postgres database (`nc -z $PGHOST $PGPORT`).
- **Outcome**: The main application container **only starts** once the database connection is confirmed.

## Kubernetes Dashboard

To visualize your cluster status, debugging pods, and logs, we use the official Kubernetes Dashboard.

### 1. Installation

The dashboard is installed via Helm (if not already done):

```bash
helm repo add kubernetes-dashboard https://kubernetes.github.io/dashboard/
# Note: We enable HTTP on port 80 to allow the Gateway to route traffic without TLS termination issues at the pod level
helm upgrade --install kubernetes-dashboard kubernetes-dashboard/kubernetes-dashboard --create-namespace --namespace kubernetes-dashboard \
  --set kong.proxy.http.enabled=true \
  --set kong.proxy.http.servicePort=80 \
  --set kong.proxy.http.containerPort=8000 

kubectl apply -f dashboard-admin.yaml
kubectl apply -f dashboard-route.yaml
```

### 2. Access

You have two ways to access the dashboard:

**Option A: Via Gateway (Recommended)**
Go to **[http://localhost/dashboard](http://localhost/dashboard)**

**Option B: Via Port-Forward (Fallback)**

```bash
kubectl -n kubernetes-dashboard port-forward svc/kubernetes-dashboard-kong-proxy 8443:443
```

Open **[https://localhost:8443](https://localhost:8443)**

### 3. Login (Token)

Generate an admin token to log in:

```bash
kubectl -n kubernetes-dashboard create token admin-user
```

## Usage

To deploy the entire stack, ensure you have a Kubernetes cluster running and `kubectl` configured.

```bash
kubectl apply -f .
```

*Note: You may need to create Secrets (like `pgpassword` and `jwt-secret`) before applying these manifests. See the root [README.md](../README.md) for complete deployment instructions.*
