#!/usr/bin/env bash
# Build and push backend + frontend images to Amazon ECR.
# Prerequisites: aws CLI installed, real credentials in .env.production
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Load .env.production (AWS credentials + config)
if [ -f "$ROOT_DIR/.env.production" ]; then
  set -a
  # shellcheck disable=SC1090
  source <(grep -v '^\s*#' "$ROOT_DIR/.env.production" | grep -v '^\s*$')
  set +a
else
  echo "ERROR: $ROOT_DIR/.env.production not found" >&2
  exit 1
fi

REGION="${AWS_REGION:-eu-west-1}"
COMMIT_SHA="$(git -C "$ROOT_DIR" rev-parse --short HEAD)"

echo "Validating AWS credentials..."
ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
ECR_REGISTRY="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

echo "Account : $ACCOUNT_ID"
echo "Region  : $REGION"
echo "Registry: $ECR_REGISTRY"
echo "Commit  : $COMMIT_SHA"
echo ""

# Create ECR repositories (idempotent)
for repo in karaadi-backend karaadi-frontend; do
  if aws ecr describe-repositories --repository-names "$repo" --region "$REGION" >/dev/null 2>&1; then
    echo "ECR repo exists: $repo"
  else
    aws ecr create-repository \
      --repository-name "$repo" \
      --region "$REGION" \
      --image-scanning-configuration scanOnPush=true \
      --tags Key=Project,Value=karaadi >/dev/null
    echo "ECR repo created: $repo"
  fi
done
echo ""

# Login to ECR
echo "Logging in to ECR..."
aws ecr get-login-password --region "$REGION" | \
  docker login --username AWS --password-stdin "$ECR_REGISTRY"
echo ""

# ---- Backend ----
BACKEND_URI="${ECR_REGISTRY}/karaadi-backend"
echo "Building backend (linux/amd64)..."
docker build \
  --platform linux/amd64 \
  -t "${BACKEND_URI}:latest" \
  -t "${BACKEND_URI}:${COMMIT_SHA}" \
  "$ROOT_DIR/backend"

echo "Pushing backend..."
docker push "${BACKEND_URI}:latest"
docker push "${BACKEND_URI}:${COMMIT_SHA}"
echo "Backend pushed."
echo ""

# ---- Frontend ----
FRONTEND_URI="${ECR_REGISTRY}/karaadi-frontend"
echo "Building frontend (linux/amd64)..."
docker build \
  --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-}" \
  --build-arg NEXT_PUBLIC_COGNITO_USER_POOL_ID="${KARAADI_AWS_COGNITO_USER_POOL_ID:-}" \
  --build-arg NEXT_PUBLIC_COGNITO_CLIENT_ID="${KARAADI_AWS_COGNITO_CLIENT_ID:-}" \
  -t "${FRONTEND_URI}:latest" \
  -t "${FRONTEND_URI}:${COMMIT_SHA}" \
  "$ROOT_DIR/frontend"

echo "Pushing frontend..."
docker push "${FRONTEND_URI}:latest"
docker push "${FRONTEND_URI}:${COMMIT_SHA}"
echo "Frontend pushed."
echo ""

# Save image URIs
OUTPUT_FILE="$ROOT_DIR/infrastructure/ecr-images.json"
cat > "$OUTPUT_FILE" <<EOF
{
  "commitSha": "${COMMIT_SHA}",
  "backend": {
    "latest": "${BACKEND_URI}:latest",
    "versioned": "${BACKEND_URI}:${COMMIT_SHA}"
  },
  "frontend": {
    "latest": "${FRONTEND_URI}:latest",
    "versioned": "${FRONTEND_URI}:${COMMIT_SHA}"
  }
}
EOF

echo "=== Image URIs ==="
echo "Backend  (latest)  : ${BACKEND_URI}:latest"
echo "Backend  (${COMMIT_SHA}) : ${BACKEND_URI}:${COMMIT_SHA}"
echo "Frontend (latest)  : ${FRONTEND_URI}:latest"
echo "Frontend (${COMMIT_SHA}) : ${FRONTEND_URI}:${COMMIT_SHA}"
echo ""
echo "URIs saved to: $OUTPUT_FILE"
