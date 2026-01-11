# Monitoring (Prometheus + Grafana) — planned (root)

Contents to add:

- Helm values for `kube-prometheus-stack` or `prometheus-operator`
- Example Grafana dashboards and JSON exports
- Alertmanager configuration and receiver examples (Slack, PagerDuty)
- CI steps to deploy monitoring stack to clusters

Notes

- Keep dashboards in `monitoring/dashboards/` and use Grafana provisioning or Helm to load them.
- Use recording rules and alerts to minimize query costs and noisy alerts.
