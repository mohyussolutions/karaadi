import json, os, sys

with open('/tmp/param_keys.json') as f:
    keys = json.load(f)

overrides = {
    'GitHubOrg': os.environ.get('GITHUB_ORG', ''),
    'GitHubRepo': os.environ.get('GITHUB_REPO_NAME', ''),
    'DomainName': 'karaadi.com',
}

params = []
for k in keys:
    if k in overrides and overrides[k]:
        params.append({'ParameterKey': k, 'ParameterValue': overrides[k]})
    else:
        params.append({'ParameterKey': k, 'UsePreviousValue': True})

with open('/tmp/params.json', 'w') as f:
    json.dump(params, f)

print(f"Built {len(params)} parameters")
