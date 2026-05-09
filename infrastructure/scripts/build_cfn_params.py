import json
import os

with open('/tmp/param_keys.json') as f:
    keys = json.load(f)

overrides = {
    'GitHubOrg':       os.environ.get('GITHUB_ORG', ''),
    'GitHubRepo':      os.environ.get('GITHUB_REPO_NAME', ''),
    'DomainName':      'karaadi.com',
    'MinSize':         '1',
    'MaxSize':         '1',
    'DesiredCapacity': '1',
    'DBUsername':      'karaadi_database_2025_for_prod',
    'DBPassword':      'karaadi_password_2025_for_prod',
    'DBName':          'karaadi',
}

params = [
    {'ParameterKey': k, 'ParameterValue': overrides[k]}
    if k in overrides and overrides[k]
    else {'ParameterKey': k, 'UsePreviousValue': True}
    for k in keys
]

with open('/tmp/params.json', 'w') as f:
    json.dump(params, f)

print(f"Built {len(params)} parameters")
