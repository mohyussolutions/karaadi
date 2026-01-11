# Servers Deployment — Kubernetes & Infrastructure

## Future Deployment Paths

Server deployments are in `future-deploy/` directory.

## Available Options

### Kubernetes

- AWS EKS — Elastic Kubernetes Service
- Azure AKS — Azure Kubernetes Service
- Helm charts in `future-deploy/kubernetes/`
- Kustomize examples available

### Linux Servers

- Ansible playbooks in `future-deploy/ansible/`
- VM provisioning and configuration
- Supports AWS, Azure, or on-premise

### Local Testing

Docker Compose in `future-deploy/docker/`

```bash
cd future-deploy/docker
docker-compose up
```

### Monitoring

Prometheus + Grafana in `future-deploy/monitoring/`

## Deployment Timeline

1. Phase 1 (Current) — Serverless (AWS Lambda)
2. Phase 2 — Kubernetes (Helm charts)
3. Phase 3 — Ansible (Linux VMs)
4. Phase 4 — Monitoring stack

## Ready for Production

Use SERVERLESS_DEPLOY.md for immediate production deployment via AWS Lambda.

For servers, implement in `future-deploy/` folder when ready.
