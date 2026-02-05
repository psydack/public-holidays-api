require('dotenv').config();
const express = require('express');
const { getHolidays, isBusinessDay, getNextBusinessDay, countBusinessDays, getSupportedCountries } = require('./holidays');
const { createX402Middleware } = require('./middleware/payment402');

const app = express();
app.use(express.json());

const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const PORT = process.env.PORT || 3000;

if (!WALLET_ADDRESS) {
  console.error('❌ ERROR: WALLET_ADDRESS environment variable is required');
  process.exit(1);
}

app.use(createX402Middleware(WALLET_ADDRESS));

/**
 * GET /holidays
 * Get holidays for a country and year
 */
app.get('/holidays', (req, res) => {
  const { country, year } = req.query;

  if (!country) {
    return res.status(400).json({ error: 'Missing required query parameter: country' });
  }

  const result = getHolidays(country, parseInt(year) || new Date().getFullYear());
  res.json(result);
});

/**
 * POST /holidays
 * Get holidays with POST (for Clawmart submission)
 */
app.post('/holidays', (req, res) => {
  const { country, year } = req.body;

  if (!country) {
    return res.status(400).json({ error: 'Missing required field: country' });
  }

  const result = getHolidays(country, parseInt(year) || new Date().getFullYear());
  res.json(result);
});

/**
 * GET /is-business-day
 * Check if a date is a business day
 */
app.get('/is-business-day', (req, res) => {
  const { date, country } = req.query;

  if (!date || !country) {
    return res.status(400).json({ error: 'Missing required query parameters: date, country' });
  }

  const result = isBusinessDay(date, country);
  res.json(result);
});

/**
 * POST /is-business-day
 */
app.post('/is-business-day', (req, res) => {
  const { date, country } = req.body;

  if (!date || !country) {
    return res.status(400).json({ error: 'Missing required fields: date, country' });
  }

  const result = isBusinessDay(date, country);
  res.json(result);
});

/**
 * GET /next-business-day
 * Get next business day
 */
app.get('/next-business-day', (req, res) => {
  const { date, country } = req.query;

  if (!date || !country) {
    return res.status(400).json({ error: 'Missing required query parameters: date, country' });
  }

  const result = getNextBusinessDay(date, country);
  res.json(result);
});

/**
 * POST /next-business-day
 */
app.post('/next-business-day', (req, res) => {
  const { date, country } = req.body;

  if (!date || !country) {
    return res.status(400).json({ error: 'Missing required fields: date, country' });
  }

  const result = getNextBusinessDay(date, country);
  res.json(result);
});

/**
 * GET /count-business-days
 * Count business days between dates
 */
app.get('/count-business-days', (req, res) => {
  const { start_date, end_date, country } = req.query;

  if (!start_date || !end_date || !country) {
    return res.status(400).json({ error: 'Missing required query parameters: start_date, end_date, country' });
  }

  const result = countBusinessDays(start_date, end_date, country);
  res.json(result);
});

/**
 * POST /count-business-days
 */
app.post('/count-business-days', (req, res) => {
  const { start_date, end_date, country } = req.body;

  if (!start_date || !end_date || !country) {
    return res.status(400).json({ error: 'Missing required fields: start_date, end_date, country' });
  }

  const result = countBusinessDays(start_date, end_date, country);
  res.json(result);
});

/**
 * GET /
 * Health check
 */
app.get('/', (req, res) => {
  res.json({
    service: 'Public Holidays API',
    version: '1.0.0',
    endpoints: {
      holidays: 'GET/POST /holidays',
      isBusinessDay: 'GET/POST /is-business-day',
      nextBusinessDay: 'GET/POST /next-business-day',
      countBusinessDays: 'GET/POST /count-business-days'
    },
    supported_countries: getSupportedCountries(),
    payment: {
      price: '$0.00025 USDC',
      network: 'Base'
    }
  });
});

let server;

if (require.main === module) {
server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║  📅 Public Holidays API with x402                       ║
╠═══════════════════════════════════════════════════════════╣
║  ✅ Server running on: http://localhost:${PORT}               ║
║  💰 Wallet: ${WALLET_ADDRESS}       ║
║  💳 Payment: $0.00025 USDC per request                    ║
║                                                          ║
║  Supported countries: ${getSupportedCountries().length}                         ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
}

module.exports = app;
