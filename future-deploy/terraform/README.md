# Terraform Infrastructure

Infrastructure-as-code for Kubernetes and frontend deployments.

## Structure

- `aws/` — AWS EKS (backend) + AWS Amplify (frontend)
- `azure/` — Azure AKS (backend) + Azure Static Web Apps (frontend)

## AWS Deployment

```bash
cd future-deploy/terraform/aws
terraform init
terraform plan
terraform apply
```

Deploys:
- EKS cluster for backend
- AWS Amplify for frontend (auto-deploys from GitHub)

## Azure Deployment

```bash
cd future-deploy/terraform/azure
terraform init
terraform plan
terraform apply
```

Deploys:
- AKS cluster for backend
- Azure Static Web Apps for frontend

## Requirements

- Terraform 1.0+
- AWS CLI configured (for AWS)
- Azure CLI configured (for Azure)
- GitHub token (for AWS Amplify)
