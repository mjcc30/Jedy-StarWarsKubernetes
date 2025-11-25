# Demonstration Scenarios

This document outlines scenarios to demonstrate Kubernetes orchestration capabilities during the project presentation.

## Scenario 1: Rolling Update & Rollback (Zero Downtime)

**Goal**: Show how Kubernetes updates the application without cutting service, and how to revert if a bug is introduced.

### 1. Initial State
Check the current image version of the backend:
```bash
kubectl get deployment back-deployment -n starwars -o=jsonpath='{$.spec.template.spec.containers[:1].image}'
# Output: jedy-starwarskubernetes-back:latest
```

### 2. Simulate an Update
We will update the image to a new version (or force a redeployment). To visualize it, open a second terminal and watch the pods:
```bash
kubectl get pods -n starwars -l component=back -w
```

Trigger the update (we'll just change an env var to force a rollout, or update the image):
```bash
kubectl set image deployment/back-deployment server=jedy-starwarskubernetes-back:latest --record -n starwars
# Or simply restart to show the rolling process
kubectl rollout restart deployment back-deployment -n starwars
```

**Observation**:
*   New pods are created (`Running`).
*   Old pods are only terminated (`Terminating`) when new ones are ready (Readiness Probe).
*   **Action**: Try to access the website during this time -> It works continuously!

### 3. Introducing a "Bug" (Broken Update)
Let's try to deploy an image that doesn't exist to simulate a typo or broken CI/CD.

```bash
kubectl set image deployment/back-deployment server=jedy-starwarskubernetes-back:BROKEN_TAG -n starwars
```

**Observation**:
*   Watch pods: `kubectl get pods -n starwars -w`
*   You will see `ErrImagePull` or `ImagePullBackOff`.
*   The deployment stops. The old pods are **STILL RUNNING**. The site is **STILL UP**.

### 4. Rollback (Undo)
We realize the mistake. Let's revert instantly.

```bash
kubectl rollout undo deployment/back-deployment -n starwars
```

**Observation**:
*   The broken pods are deleted.
*   The deployment returns to the stable state.

---

## Scenario 2: Autoscaling (HPA)

**Goal**: Show the cluster adapting to traffic spikes.

### 1. Setup Monitor
Open a terminal to watch the Horizontal Pod Autoscaler:
```bash
kubectl get hpa -n starwars -w
```

### 2. Launch Attack (K6)
We use **K6** to simulate realistic traffic (ramp-up to 100 users).
```bash
just load-test
```
*You will see the K6 metrics output in the terminal.*

### 3. Observation
*   The test starts with a 30s warm-up.
*   **Wait ~1 minute**: `TARGETS` % will rise above 50%.
*   `REPLICAS` will increase (1 -> 2 -> 3...).
*   New pods will appear in `kubectl get pods`.

### 4. Cooldown
The test stops automatically after 3m30s.
Or stop manually:
```bash
just stop-load
```
*   After a few minutes, replicas will drop back to 1.
