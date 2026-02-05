const request = require('supertest');

process.env.WALLET_ADDRESS = '0xTestWalletAddressOnBase';

const app = require('../src/index');

describe('Public Holidays API', () => {
  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body.service).toBe('Public Holidays API');
    });
  });

  describe('POST /holidays', () => {
    it('should return 402 without payment', async () => {
      const response = await request(app)
        .post('/holidays')
        .send({ country: 'BR' });

      expect(response.status).toBe(402);
      expect(response.headers).toHaveProperty('payment-required');
    });
  });

  describe('POST /is-business-day', () => {
    it('should return 402 without payment', async () => {
      const response = await request(app)
        .post('/is-business-day')
        .send({ date: '2026-02-08', country: 'US' });

      expect(response.status).toBe(402);
      expect(response.headers).toHaveProperty('payment-required');
    });
  });

  describe('POST /next-business-day', () => {
    it('should return 402 without payment', async () => {
      const response = await request(app)
        .post('/next-business-day')
        .send({ date: '2026-02-08', country: 'US' });

      expect(response.status).toBe(402);
      expect(response.headers).toHaveProperty('payment-required');
    });
  });

  describe('POST /count-business-days', () => {
    it('should return 402 without payment', async () => {
      const response = await request(app)
        .post('/count-business-days')
        .send({ start_date: '2026-02-01', end_date: '2026-02-10', country: 'US' });

      expect(response.status).toBe(402);
      expect(response.headers).toHaveProperty('payment-required');
    });
  });
});