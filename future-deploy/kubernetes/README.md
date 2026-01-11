# Kubernetes deployment (planned) — root

Contents to add here:

- Helm chart skeletons for backend and frontend
- `kustomize` overlays for `dev`, `stage`, `prod`
- Example `values.yaml` and ingress configuration
- CI job samples to build images and run `helm upgrade --install`

Quick notes

- Prefer using Helm for application packaging and `kube-prometheus-stack` for monitoring.
- Use `kubectl` and `helm` in CI after cluster credentials are provided by Terraform/Cloud tooling.
