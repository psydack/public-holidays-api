# Public Holidays API

Public holidays and business days API for multiple countries with x402 micropayments.

## 🌟 Features

- ✅ **Public Holidays** - Get all holidays for a country and year
- ✅ **Business Day Check** - Check if a date is a business day
- ✅ **Next Business Day** - Find the next business day
- ✅ **Count Business Days** - Count business days between dates
- ✅ **3 Countries** - Brazil (BR), United States (US), United Kingdom (UK)
- ✅ **x402 Payments** - $0.00025 USDC per request
- ✅ **Easily Expandable** - Simple structure to add more countries

## 📋 Endpoints

### POST /holidays

Get all public holidays for a country and year.

```http
POST /holidays
Content-Type: application/json

{
  "country": "BR",
  "year": 2026
}
```

### POST /is-business-day

Check if a specific date is a business day.

```http
POST /is-business-day
Content-Type: application/json

{
  "date": "2026-02-04",
  "country": "BR"
}
```

### POST /next-business-day

Find the next business day after a given date.

```http
POST /next-business-day
Content-Type: application/json

{
  "date": "2026-02-04",
  "country": "BR"
}
```

### POST /count-business-days

Count business days between two dates.

```http
POST /count-business-days
Content-Type: application/json

{
  "start_date": "2026-02-01",
  "end_date": "2026-02-28",
  "country": "BR"
}
```

## 💰 Payments

- **Price**: $0.00025 USDC per request
- **Network**: Base (Chain ID 8453)
- **Protocol**: x402 v2

## 🚀 Deployment

Railway, Render, or similar platforms.

## 📝 License

ISC

---

**Built for Clawmart x402 Marketplace** 📅

**Repository**: https://github.com/psydack/public-holidays-api
