# Justfile for Jedy-StarWarsKubernetes

set shell := ["bash", "-c"]

# List all available commands
default:
    @just --list

# --- Local Development (Docker Compose) ---

# Run the app in development mode (Hot Reload)
dev:
    docker compose up --build

# Run the app in production preview mode
preview:
    docker compose -f compose.yaml -f compose.production.yaml up --build

# Stop all docker compose containers
down:
    docker compose down --remove-orphans

# --- Kubernetes Deployment ---

# Create the namespace
ns:
    kubectl create ns starwars --dry-run=client -o yaml | kubectl apply -f -

# Deploy the entire stack (Gateway, Configs, Apps, DB) to Kubernetes
deploy: ns
    @echo "🚀 Deploying Infrastructure (Gateway)..."
    kubectl apply -f deploy/gatewayclass.yaml
    kubectl apply -f deploy/gateway-infra.yaml
    @echo "📜 Deploying Configurations..."
    kubectl apply -f deploy/back-configmap.yaml
    kubectl apply -f deploy/front-configmap.yaml
    @echo "💾 Deploying Database (StatefulSet)..."
    kubectl apply -f deploy/postgres.yaml
    @echo "🛸 Deploying Apps (Backend & Frontend)..."
    kubectl apply -f deploy/back.yaml
    kubectl apply -f deploy/front.yaml
    @echo "🛣️  Deploying Routes..."
    kubectl apply -f deploy/routes.yaml
    kubectl apply -f deploy/dashboard-route.yaml
    @echo "✅ Done! Access via http://localhost"

# Delete all Kubernetes resources
undeploy:
    kubectl delete -f deploy/ --ignore-not-found=true

# Force restart of pods (to pull new images or config)
restart:
    kubectl -n starwars rollout restart deployment back-deployment
    kubectl -n starwars rollout restart deployment front-deployment
    kubectl -n starwars rollout restart statefulset postgres-statefulset

# --- Kubernetes Dashboard ---

# Install Kubernetes Dashboard via Helm
dashboard-install:
    helm repo add kubernetes-dashboard https://kubernetes.github.io/dashboard/
    helm upgrade --install kubernetes-dashboard kubernetes-dashboard/kubernetes-dashboard \
        --create-namespace --namespace kubernetes-dashboard \
        --set kong.proxy.http.enabled=true \
        --set kong.proxy.http.servicePort=80 \
        --set kong.proxy.http.containerPort=8000
    kubectl apply -f deploy/dashboard-admin.yaml

# Generate Admin Token for Dashboard Login
dashboard-token:
    @echo "🔑 Copy this token to log in:"
    @kubectl -n kubernetes-dashboard create token admin-user

# Start Port-Forward (Fallback access)
dashboard-proxy:
    kubectl -n kubernetes-dashboard port-forward svc/kubernetes-dashboard-kong-proxy 8443:443

# --- Observability & Scaling ---

# Install Metrics Server (Required for HPA)
install-metrics:
    kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
    kubectl patch -n kube-system deployment metrics-server --type=json \
      -p '[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'

# Deploy Horizontal Pod Autoscaler
deploy-hpa:
    kubectl apply -f deploy/hpa.yaml

# Watch HPA status
watch-hpa:
    kubectl get hpa -n starwars --watch

# Start a K6 Load Test (Professional)
load-test:
    @echo "🧹 Cleaning previous tests..."
    -kubectl delete job k6-load-test -n starwars --ignore-not-found=true
    -kubectl delete configmap k6-script -n starwars --ignore-not-found=true
    @echo "📦 Creating ConfigMap..."
    kubectl create configmap k6-script -n starwars --from-file=tests/k6/script.js
    @echo "🚀 Starting K6 Job..."
    kubectl apply -f tests/k6/job.yaml
    @echo "👀 Following logs (Ctrl+C to stop following, test continues)..."
    @sleep 2
    kubectl logs -n starwars -f job/k6-load-test
    @echo "✅ Test finished! Check HPA status."

# Stop/Clean the Load Test
stop-load:
    kubectl delete job k6-load-test -n starwars --ignore-not-found=true
    kubectl delete configmap k6-script -n starwars --ignore-not-found=true

# --- Logs ---

# Tail Backend Logs
logs-back:
    kubectl logs -n starwars -l component=back -f --tail=100

# Tail Frontend Logs
logs-front:
    kubectl logs -n starwars -l component=front -f --tail=100
