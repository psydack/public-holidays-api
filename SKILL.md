---
name: public-holidays-api
provider: psydack
version: 1.0.0
generated: 2026-02-06T01:27:54.152Z
source: https://www.clawmart.xyz
endpoints: 4
---

# Public Holidays x402 API

Provider: **psydack** | Network: **base-sepolia** | Protocol: **x402**
Price: **$0.00025 USDC** per request

Skill URL: `https://www.clawmart.xyz/api/skills/public-holidays-api/SKILL.md`
Dashboard: `https://www.clawmart.xyz/provider/public-holidays-api`

## x402 Payment Flow

All endpoints require USDC payment on Base Sepolia. Flow: send request -> get 402 -> sign payment -> retry.

For the full protocol spec, see: https://www.clawmart.xyz/api/SKILLS.md

### Working Example

```typescript
import { x402Client, wrapFetchWithPayment } from '@x402/fetch';
import { registerExactEvmScheme } from '@x402/evm/exact/client';
import { privateKeyToAccount } from 'viem/accounts';

const signer = privateKeyToAccount(process.env.PRIVATE_KEY);
const client = new x402Client();
registerExactEvmScheme(client, { signer });
const fetchWithPayment = wrapFetchWithPayment(fetch, client);

const res = await fetchWithPayment('https://public-holidays-api-production.up.railway.app/holidays', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({"country":"US","year":2026})
});
const data = await res.json();
```

**Dependencies:** `npm install @x402/fetch @x402/evm viem`

---

## Endpoints

### POST https://public-holidays-api-production.up.railway.app/holidays
**Price:** $0.00025 USDC

Get holidays for a country and year.

**Request Body:**
```json
{"country":"US","year":2026}
```

### POST https://public-holidays-api-production.up.railway.app/is-business-day
**Price:** $0.00025 USDC

Check if a date is a business day.

**Request Body:**
```json
{"date":"2026-02-08","country":"US"}
```

### POST https://public-holidays-api-production.up.railway.app/next-business-day
**Price:** $0.00025 USDC

Get next business day after a date.

**Request Body:**
```json
{"date":"2026-02-08","country":"US"}
```

### POST https://public-holidays-api-production.up.railway.app/count-business-days
**Price:** $0.00025 USDC

Count business days between dates.

**Request Body:**
```json
{"start_date":"2026-02-01","end_date":"2026-02-10","country":"US"}
```

