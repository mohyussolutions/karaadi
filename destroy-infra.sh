#!/usr/bin/env bash
# destroy-infra.sh — deletes the karaadi-production CloudFormation stack and RDS instance immediately.
# Run: chmod +x destroy-infra.sh && ./destroy-infra.sh
set -euo pipefail

STACK_NAME="karaadi-production"
REGION="eu-west-1"

echo "========================================"
echo "  KARAADI INFRASTRUCTURE DESTROY SCRIPT"
echo "  Stack : $STACK_NAME"
echo "  Region: $REGION"
echo "========================================"
echo ""
read -rp "Type DESTROY to confirm permanent deletion: " CONFIRM
[ "$CONFIRM" = "DESTROY" ] || { echo "Aborted."; exit 0; }

# ── 1. Scale ASG to 0 (terminate EC2 instances first) ──────────────────────
echo ""
echo "[1/4] Scaling ASG to 0..."
ASG=$(aws cloudformation describe-stack-resources \
  --stack-name "$STACK_NAME" \
  --logical-resource-id BackendAutoScalingGroup \
  --region "$REGION" \
  --query "StackResources[0].PhysicalResourceId" \
  --output text 2>/dev/null || echo "")

if [ -n "$ASG" ] && [ "$ASG" != "None" ]; then
  aws autoscaling update-auto-scaling-group \
    --auto-scaling-group-name "$ASG" \
    --min-size 0 --max-size 0 --desired-capacity 0 \
    --region "$REGION"
  echo "  ASG $ASG scaled to 0. Waiting 60s for instances to terminate..."
  sleep 60
else
  echo "  ASG not found or already gone — skipping."
fi

# ── 2. Delete RDS without final snapshot (unblocks CFN delete) ─────────────
echo ""
echo "[2/4] Deleting RDS instance..."
RDS_ID=$(aws cloudformation describe-stack-resources \
  --stack-name "$STACK_NAME" \
  --logical-resource-id RDSInstance \
  --region "$REGION" \
  --query "StackResources[0].PhysicalResourceId" \
  --output text 2>/dev/null || echo "")

if [ -n "$RDS_ID" ] && [ "$RDS_ID" != "None" ]; then
  aws rds delete-db-instance \
    --db-instance-identifier "$RDS_ID" \
    --skip-final-snapshot \
    --region "$REGION" 2>/dev/null || true
  echo "  Waiting for RDS $RDS_ID to finish deleting (up to 10 min)..."
  aws rds wait db-instance-deleted \
    --db-instance-identifier "$RDS_ID" \
    --region "$REGION" || true
  echo "  RDS deleted."
else
  echo "  RDS not found or already gone — skipping."
fi

# ── 3. Delete CloudFormation stack ─────────────────────────────────────────
echo ""
echo "[3/4] Deleting CloudFormation stack $STACK_NAME..."
aws cloudformation delete-stack \
  --stack-name "$STACK_NAME" \
  --region "$REGION"

echo "  Waiting for stack deletion to complete (up to 30 min)..."
aws cloudformation wait stack-delete-complete \
  --stack-name "$STACK_NAME" \
  --region "$REGION"

# ── 4. Verify ──────────────────────────────────────────────────────────────
echo ""
echo "[4/4] Verifying deletion..."
STATUS=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].StackStatus" \
  --output text 2>/dev/null || echo "DELETED")

echo "  Final status: $STATUS"
if [ "$STATUS" = "DELETED" ] || [ "$STATUS" = "DELETE_COMPLETE" ]; then
  echo ""
  echo "✅  All infrastructure destroyed. AWS billing stopped."
else
  echo ""
  echo "⚠️   Stack status is $STATUS — check AWS Console for stuck resources."
  exit 1
fi
