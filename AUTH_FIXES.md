# Authentication and dashboard fixes

The dashboard previously crashed when CoinGecko returned a null 24-hour percentage change: both coin views called `.toFixed()` on it. Missing statistics could also crash `.toLocaleString()`. Numeric formatting now handles unavailable values, the market response is checked before rendering, and a page error boundary provides a recovery screen. Login responses are validated before saving tokens. The duplicate dashboard toast container has been removed.

The login page linked to `/forgot-password`, but there was no corresponding route or reset API. The new request and confirmation pages use Django password-reset tokens, with one-hour expiry, single-use behavior after a successful password change, password confirmation, and an IP request limit.

The simulated wallet-connection failure and manual recovery-phrase form have been removed. The browser now requests `eth_requestAccounts` through an injected Ethereum-compatible wallet and saves only its public address. The server rejects phrases and private keys, hides legacy values that are not public addresses, and prevents profile edits from bypassing address validation. This saves a public address; it does not prove wallet ownership or create a custodial wallet. Existing invalid wallet values are hidden, not deleted from the database or Git history.

## Deployment configuration

Deploy both frontend and backend changes. The backend requires:

| Variable | Value |
| --- | --- |
| `FRONTEND_URL` | The trusted public frontend origin, such as `https://app.example.com` |
| `EMAIL_HOST` | SMTP server hostname |
| `EMAIL_PORT` | SMTP port, defaults to `587` |
| `EMAIL_HOST_USER` | SMTP username |
| `EMAIL_HOST_PASSWORD` | SMTP password |
| `EMAIL_USE_TLS` | `true` by default for STARTTLS |
| `DEFAULT_FROM_EMAIL` | Verified sender email address |

If the origin or SMTP host is absent, the recovery page displays an unavailable message. SMTP delivery must be verified in the deployed environment. The request endpoint uses the same public response for existing and unknown email addresses. Its rate limit uses Django's cache; configure a shared cache for a deployment with multiple server processes.

The frontend optionally accepts `VITE_API_BASE_URL`. Without it, it uses the existing backend URL. Keep the existing SPA rewrite so emailed reset links load directly.

## Verification

```sh
cd frontend
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm run build
pnpm run test:e2e
```

```sh
cd backend
python manage.py test app --settings=backend.test_settings
```

The backend tests use an in-memory SQLite database and in-memory email backend. Browser tests mock API responses; they do not submit credentials or wallet data to a live deployment.
