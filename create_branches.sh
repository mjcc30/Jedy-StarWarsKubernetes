#!/bin/bash

# 🎓 Jedy-StarWarsKubernetes Workshop Branch Generator
# This script rebuilds the git branch structure for the workshop "Zero to Hero".
# It ensures each level inherits from the previous one.

set -e # Exit immediately if a command exits with a non-zero status.

echo "🚀 Starting Workshop Branch Generation..."

# 0. Cleanup old branches
echo "🧹 Cleaning up old branches..."
git checkout main
branches=("level-0-code" "level-1-docker" "level-2-compose" "level-3-k8s-basics" "level-4-gateway" "level-5-sre")
for branch in "${branches[@]}"; do
    if git show-ref --verify --quiet refs/heads/$branch; then
        git branch -D $branch
    fi
done

# 1. Level 0: The Setup (Code Only)
echo "🌱 Creating Level 0: Source Code..."
git checkout --orphan level-0-code
git rm -rf .  > /dev/null 2>&1 # Clear index
git clean -fdx > /dev/null 2>&1 # Remove untracked files

# Restore base files from main
git checkout main -- back front workshop slides .gitignore README.md CONTRIBUTING.md

# Clean "Advanced" files from back/front (to simulate clean slate)
rm -f back/Dockerfile* back/compose* 
rm -f front/Dockerfile* front/compose*
# Remove deployment and automation files
rm -rf deploy tests compose.yaml compose.production.yaml Justfile DEMO.md

git add .
git commit -m "feat: Level 0 - Source Code Only"

# 2. Level 1: Containerization
echo "🐳 Creating Level 1: Docker..."
git checkout -b level-1-docker
# Apply Solution
cp workshop/level-1-docker/back/Dockerfile back/
cp workshop/level-1-docker/front/Dockerfile front/
git add .
git commit -m "feat: Level 1 - Added Dockerfiles"

# 3. Level 2: Orchestration
echo "🐙 Creating Level 2: Docker Compose..."
git checkout -b level-2-compose
# Apply Solution
cp workshop/level-2-compose/compose.yaml .
git add .
git commit -m "feat: Level 2 - Added Docker Compose"

# 4. Level 3: K8s Basics
echo "☸️  Creating Level 3: Kubernetes Basics..."
git checkout -b level-3-k8s-basics
# Apply Solution
mkdir -p deploy
cp -r workshop/level-3-k8s-basics/* deploy/
git add .
git commit -m "feat: Level 3 - Added Basic K8s Manifests"

# 5. Level 4: Gateway
echo "🚪 Creating Level 4: Gateway & Ingress..."
git checkout -b level-4-gateway
# Apply Solution (Overwrite deploy folder to match architectural change)
rm -rf deploy/*
cp -r workshop/level-4-gateway/* deploy/
# We also need the ConfigMaps which were not in Level 3 basics but are needed for Level 4
# Assuming Level 4 uses the simpler ConfigMaps or we borrow them from Level 5 for stability if missing
if [ ! -f deploy/back-configmap.yaml ]; then
    # If level-4 folder doesn't have configmaps, we take the final ones for stability
    cp workshop/level-5-sre/*configmap.yaml deploy/ 2>/dev/null || true
fi
git add .
git commit -m "feat: Level 4 - Implemented Gateway API"

# 6. Level 5: Production Grade (SRE)
echo "🛡️  Creating Level 5: Production Grade (SRE)..."
git checkout -b level-5-sre
# Apply Solution
rm -rf deploy/*
cp -r workshop/level-5-sre/* deploy/
# Restore Automation & Tests (Bonus for the final level)
git checkout main -- Justfile tests DEMO.md deploy/PRODUCTION_ROADMAP.md
git add .
git commit -m "feat: Level 5 - SRE, HPA, StatefulSet & Automation"

echo "✅ All branches created successfully!"
echo "👉 Start by checking out: git checkout level-0-code"
git checkout main