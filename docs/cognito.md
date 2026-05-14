# Cognito Configuration

## User Pool
| Field | Value |
|---|---|
| Name | karaadi |
| Region | eu-west-1 |
| Pool ID | eu-west-1_HBSh8HxgJ |
| Sign-in | Email only |

## App Client
| Field | Value |
|---|---|
| Name | karaadi-public |
| Client Secret | None |
| ALLOW_USER_PASSWORD_AUTH | ✅ |
| ALLOW_REFRESH_TOKEN_AUTH | ✅ |

## Standard Attributes
| Attribute | Required |
|---|---|
| email | ✅ |
| preferred_username | ✅ |
| phone_number | ✅ |

## Custom Attributes
| Attribute | Type | Mutable |
|---|---|---|
| custom:isAdmin | String | ✅ |
| custom:isManager | String | ✅ |
| custom:isSupport | String | ✅ |
| custom:phone_number | String | ✅ |
| custom:profile | String | ✅ |

## Token Expiry
| Token | Expiry |
|---|---|
| ID Token | 60 min |
| Access Token | 60 min |
| Refresh Token | 5 days |

## Environment Variables
```
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
KARAADI_AWS_COGNITO_USER_POOL_ID=eu-west-1_HBSh8HxgJ
KARAADI_AWS_COGNITO_CLIENT_ID=
COGNITO_JWKS_URL=https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_HBSh8HxgJ/.well-known/jwks.json
```

## Important Notes
- App client must have **no secret** — code does not compute SECRET_HASH
- `phone_number` is required — defaults to `+10000000000` if user skips it
- Role attributes store values as strings: `"true"` or `"false"`
- Verification is done via **email confirmation code**
