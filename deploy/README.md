# Kubernetes Deployment Manifests

This directory contains the Kubernetes manifest files required to deploy the Jedy-StarWarsKubernetes application.

## File Descriptions

- **`gatewayclass.yaml`**: Registers the `GatewayClass` with the cluster, linking the Kubernetes Gateway API to the Envoy Gateway controller.
- **`gateway.yaml`**: Defines the `Gateway` resource, which acts as the entry point for external traffic (Ingress).
- **`routes.yaml`**: Defines `HTTPRoute` resources to route traffic from the Gateway to the Backend (`/api`) and Frontend (`/`) services.
- **`configmap.yaml`**: Stores non-sensitive configuration variables (ConfigMap) for the application.
- **`postgres.yaml`**: Deploys the PostgreSQL database (`Deployment`) and requests persistent storage (`PersistentVolumeClaim`).
- **`back.yaml`**: Deploys the Backend API (`Deployment`) and exposes it internally (`Service`).
- **`front.yaml`**: Deploys the Frontend application (`Deployment`) and exposes it internally (`Service`).

## Usage

To deploy the entire stack, ensure you have a Kubernetes cluster running and `kubectl` configured.

```bash
kubectl apply -f .
```

*Note: You may need to create Secrets (like `pgpassword` and `jwt-secret`) before applying these manifests. See the root [README.md](../README.md) for complete deployment instructions.*
