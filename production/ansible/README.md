# Ansible playbooks (planned) — root

Contents to add:

- `playbooks/site.yml` — entrypoint for provisioning and deploy
- `roles/` — common roles for `docker`, `nginx`, `users`, `security` (use Ansible Galaxy to seed)
- `inventory/` — example inventory for `dev`, `stage`, `prod`
- Secrets handling — recommend Ansible Vault or integration with secret manager

Example usage

```bash
ansible-playbook -i inventory/hosts.ini playbooks/site.yml --limit=web
```

Ansible is intended for VM/provisioning flows and configuration management for Linux hosts.
