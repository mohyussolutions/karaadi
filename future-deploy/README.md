# Future Deploy

Server-based deployments.

## Structure

- `terraform/` — AWS EKS and Azure AKS infrastructure
- `kubernetes/` — Helm charts and kustomize manifests
- `ansible/` — Linux provisioning and configuration
- `docker/` — Docker Compose and build helpers
- `monitoring/` — Prometheus and Grafana

## Deployment Timeline

1. Phase 1 (Now) — Serverless (AWS Lambda) in `productions/serverless/`
2. Phase 2 — Kubernetes (Helm charts)
3. Phase 3 — Ansible (Linux VMs)
4. Phase 4 — Monitoring stack

See parent `SERVERS_DEPLOY.md` for overview.
