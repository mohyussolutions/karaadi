import json
import os

with open('/tmp/param_keys.json') as f:
    keys = json.load(f)

overrides = {
    'GitHubOrg':          os.environ.get('GITHUB_ORG', ''),
    'GitHubRepo':         os.environ.get('GITHUB_REPO_NAME', ''),
    'AmplifyGitHubToken': os.environ.get('AMPLIFY_GITHUB_TOKEN', ''),
    'GitHubToken':        '',
    'DomainName':         'karaadi.com',
    'MinSize':            '1',
    'MaxSize':            '1',
    'DesiredCapacity':    '1',
    'DBUsername':         'karaadi_database_2025_for_prod',
    'DBPassword':         'karaadi_password_2025_for_prod',
    'DBName':             'karaadi',
    'JWTSecret':          'lmQwc3xl6MSDLV7vtV2sFx5hgc7ey2bCRKsP6oB4HJNbsjgc',
    'SessionSecret':      'Kozzo6ToWI9mdO2WGyyWiMSrN26VrFD1U5Tb03kRmxdxjcMa',
    'EncryptionKey':      'LDxHqt0dev2mfG3FRP4riNU5SRii94IK',
    'WaafiPayApiKey':     'API-Q9yhd1f89hJLeXV8lq78hEZaS5CP',
    'WaafiPayApiUserId':  '1008816',
    'WaafiPayMerchantUid':'M0914229',
    'TikTokClientKey':    'aw7w2mc71navvwzl',
    'TikTokClientSecret': '6LXGWoVsW8apQBthEOO5jivtbigGXubz',
    'FacebookPageId':     '61569249207022',
}

# On fresh create keys is [], so all params come from overrides.
# On update keys lists existing params — use UsePreviousValue unless overriding.
if keys:
    params = [
        {'ParameterKey': k, 'ParameterValue': overrides[k]}
        if k in overrides
        else {'ParameterKey': k, 'UsePreviousValue': True}
        for k in keys
    ]
else:
    params = [
        {'ParameterKey': k, 'ParameterValue': v}
        for k, v in overrides.items()
        if v != ''
    ]

with open('/tmp/params.json', 'w') as f:
    json.dump(params, f)

print(f"Built {len(params)} parameters ({'create' if not keys else 'update'})")
