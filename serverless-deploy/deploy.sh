#!/bin/bash
set -euo pipefail

CLOUD=${1:-}
ENV=${2:-}

usage() {
  echo "Usage: ./deploy.sh <cloud> <env>"
  echo "  cloud: aws | gcp | azure | all"
  echo "  env: dev | stage | prod"
  exit 1
}

if [ -z "$CLOUD" ] || [ -z "$ENV" ]; then
  usage
fi

PARAMS="params/$ENV.json"
STACK_PREFIX="karaadi-$ENV"

build_and_push_aws_images() {
  ECR_BACKEND="${ECR_BACKEND:-<YOUR_ECR_BACKEND_URI>}"
  ECR_FRONTEND="${ECR_FRONTEND:-<YOUR_ECR_FRONTEND_URI>}"

  docker build -t backend ./../backend
  docker tag backend:latest $ECR_BACKEND:latest
  aws ecr get-login-password --region ${AWS_REGION:-us-east-1} | docker login --username AWS --password-stdin $ECR_BACKEND
  docker push $ECR_BACKEND:latest

  docker build -t frontend ./../frontend
  docker tag frontend:latest $ECR_FRONTEND:latest
  aws ecr get-login-password --region ${AWS_REGION:-us-east-1} | docker login --username AWS --password-stdin $ECR_FRONTEND
  docker push $ECR_FRONTEND:latest
}

deploy_aws() {
  if [ ! -f "$PARAMS" ]; then
    echo "Parameters file $PARAMS not found"
    exit 1
  fi

  build_and_push_aws_images

  for TEMPLATE in network.yaml database.yaml s3.yaml cognito.yaml backend.yaml frontend.yaml; do
    aws cloudformation deploy \
      --template-file cloudformation/$TEMPLATE \
      --stack-name ${STACK_PREFIX}-$(basename $TEMPLATE .yaml) \
      --capabilities CAPABILITY_NAMED_IAM \
      --parameter-overrides $(jq -r 'to_entries|map("\(.key)=\(.value|tostring)")|.[]' $PARAMS)
  done
}

deploy_gcp() {
  echo "GCP deployment selected."
  echo "This repository currently does not include GCP-specific manifests."
  echo "Recommended: add a Terraform module under productions/terraform/gcp or provide a gcloud deployment script."
  if [ -d "productions/terraform/gcp" ]; then
    echo "Found productions/terraform/gcp — running Terraform apply (requires terraform installed and env vars configured)."
    pushd productions/terraform/gcp > /dev/null
    terraform init
    terraform apply -auto-approve -var="env=$ENV"
    popd > /dev/null
  else
    echo "No GCP terraform folder found. Skipping GCP apply."
  fi
}

deploy_azure() {
  echo "Azure deployment selected."
  echo "Recommended: add a Terraform module under productions/terraform/azure or provide an az CLI script."
  if [ -d "productions/terraform/azure" ]; then
    echo "Found productions/terraform/azure — running Terraform apply (requires terraform installed and env vars configured)."
    pushd productions/terraform/azure > /dev/null
    terraform init
    terraform apply -auto-approve -var="env=$ENV"
    popd > /dev/null
  else
    echo "No Azure terraform folder found. Skipping Azure apply."
  fi
}

case "$CLOUD" in
  aws)
    deploy_aws
    ;;
  gcp)
    deploy_gcp
    ;;
  azure)
    deploy_azure
    ;;
  all)
    deploy_aws
    deploy_gcp
    deploy_azure
    ;;
  *)
    usage
    ;;
esac

echo "${CLOUD} ${ENV} deployment completed!"
