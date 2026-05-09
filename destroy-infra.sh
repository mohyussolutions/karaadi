#!/usr/bin/env bash
set -euo pipefail

STACK_NAME="karaadi-production"
REGION="eu-west-1"
APP="karaadi"

echo "========================================"
echo "  KARAADI FULL AWS DESTROY SCRIPT"
echo "  Stack : $STACK_NAME / Region: $REGION"
echo "========================================"
read -rp "Type DESTROY to confirm — removes EVERYTHING: " CONFIRM
[ "$CONFIRM" = "DESTROY" ] || { echo "Aborted."; exit 0; }

# 1. Scale ASG to 0
echo "[1/9] Scaling ASG to 0..."
ASG=$(aws cloudformation describe-stack-resources --stack-name "$STACK_NAME" \
  --logical-resource-id BackendAutoScalingGroup --region "$REGION" \
  --query "StackResources[0].PhysicalResourceId" --output text 2>/dev/null || echo "")
if [ -n "$ASG" ] && [ "$ASG" != "None" ]; then
  aws autoscaling update-auto-scaling-group --auto-scaling-group-name "$ASG" \
    --min-size 0 --max-size 0 --desired-capacity 0 --region "$REGION"
  echo "  ASG $ASG → 0. Waiting 60s..."
  sleep 60
else
  echo "  No ASG found."
fi

# 2. Delete RDS without final snapshot
echo "[2/9] Deleting RDS..."
RDS_ID=$(aws cloudformation describe-stack-resources --stack-name "$STACK_NAME" \
  --logical-resource-id RDSInstance --region "$REGION" \
  --query "StackResources[0].PhysicalResourceId" --output text 2>/dev/null || echo "")
if [ -n "$RDS_ID" ] && [ "$RDS_ID" != "None" ]; then
  aws rds delete-db-instance --db-instance-identifier "$RDS_ID" \
    --skip-final-snapshot --region "$REGION" 2>/dev/null || true
  echo "  Waiting for RDS to delete..."
  aws rds wait db-instance-deleted --db-instance-identifier "$RDS_ID" --region "$REGION" || true
  echo "  RDS deleted."
else
  echo "  No RDS found."
fi

# 3. Delete CloudFormation stack
echo "[3/9] Deleting CloudFormation stack..."
aws cloudformation delete-stack --stack-name "$STACK_NAME" --region "$REGION" 2>/dev/null || true
aws cloudformation wait stack-delete-complete --stack-name "$STACK_NAME" --region "$REGION" 2>/dev/null || true
echo "  Stack deleted."

# 4. Terminate any leftover EC2 instances
echo "[4/9] Terminating leftover EC2 instances..."
INSTANCE_IDS=$(aws ec2 describe-instances --region "$REGION" \
  --filters "Name=tag:aws:cloudformation:stack-name,Values=$STACK_NAME" \
            "Name=instance-state-name,Values=running,stopped,pending" \
  --query "Reservations[].Instances[].InstanceId" --output text 2>/dev/null || echo "")
if [ -n "$INSTANCE_IDS" ] && [ "$INSTANCE_IDS" != "None" ]; then
  aws ec2 terminate-instances --instance-ids $INSTANCE_IDS --region "$REGION"
  aws ec2 wait instance-terminated --instance-ids $INSTANCE_IDS --region "$REGION" || true
  echo "  Terminated: $INSTANCE_IDS"
else
  echo "  No leftover instances."
fi

# 5. Release unassociated Elastic IPs
echo "[5/9] Releasing Elastic IPs..."
ALLOC_IDS=$(aws ec2 describe-addresses --region "$REGION" \
  --query "Addresses[?AssociationId==null].AllocationId" --output text 2>/dev/null || echo "")
if [ -n "$ALLOC_IDS" ] && [ "$ALLOC_IDS" != "None" ]; then
  for AID in $ALLOC_IDS; do
    aws ec2 release-address --allocation-id "$AID" --region "$REGION" && echo "  Released $AID"
  done
else
  echo "  No unassociated EIPs."
fi

# 6. Delete NAT Gateways
echo "[6/9] Deleting NAT Gateways..."
NAT_IDS=$(aws ec2 describe-nat-gateways --region "$REGION" \
  --filter "Name=tag:aws:cloudformation:stack-name,Values=$STACK_NAME" \
           "Name=state,Values=available,pending" \
  --query "NatGateways[].NatGatewayId" --output text 2>/dev/null || echo "")
if [ -n "$NAT_IDS" ] && [ "$NAT_IDS" != "None" ]; then
  for NAT in $NAT_IDS; do
    aws ec2 delete-nat-gateway --nat-gateway-id "$NAT" --region "$REGION" && echo "  Deleted $NAT"
  done
  echo "  Waiting 60s for NAT gateways..."
  sleep 60
else
  echo "  No NAT gateways."
fi

# 7. Delete SSM parameter
echo "[7/9] Deleting SSM /karaadi/backend/env..."
aws ssm delete-parameter --name "/karaadi/backend/env" --region "$REGION" 2>/dev/null && \
  echo "  SSM deleted." || echo "  SSM not found."

# 8. Delete Secrets Manager secrets
echo "[8/9] Deleting Secrets Manager secrets..."
SECRET_ARNS=$(aws secretsmanager list-secrets --region "$REGION" \
  --query "SecretList[?contains(Name,'karaadi')].ARN" --output text 2>/dev/null || echo "")
if [ -n "$SECRET_ARNS" ] && [ "$SECRET_ARNS" != "None" ]; then
  for ARN in $SECRET_ARNS; do
    aws secretsmanager delete-secret --secret-id "$ARN" \
      --force-delete-without-recovery --region "$REGION" && echo "  Deleted $ARN"
  done
else
  echo "  No secrets found."
fi

# 9. Verify
echo "[9/9] Verifying..."
STATUS=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$REGION" \
  --query "Stacks[0].StackStatus" --output text 2>/dev/null || echo "DELETED")
echo "  Stack status: $STATUS"
if [ "$STATUS" = "DELETED" ] || [ "$STATUS" = "DELETE_COMPLETE" ]; then
  echo ""
  echo "DESTRUCTION COMPLETE — all AWS resources removed."
else
  echo "WARNING: Stack status $STATUS — check Console for stuck resources."
  exit 1
fi
