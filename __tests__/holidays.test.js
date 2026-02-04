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
    });

    it('should get Brazil holidays', async () => {
      const response = await request(app)
        .post('/holidays')
        .set('X-Payment', 'test')
        .send({ country: 'BR', year: 2026 });

      expect(response.status).toBe(200);
      expect(response.body.country).toBe('BR');
      expect(response.body.year).toBe(2026);
      expect(response.body.holidays).toBeInstanceOf(Array);
      expect(response.body.holidays.length).toBeGreaterThan(0);
    });

    it('should get US holidays', async () => {
      const response = await request(app)
        .post('/holidays')
        .set('X-Payment', 'test')
        .send({ country: 'US', year: 2026 });

      expect(response.status).toBe(200);
      expect(response.body.country).toBe('US');
      expect(response.body.holidays.length).toBeGreaterThan(0);
    });
  });

  describe('POST /is-business-day', () => {
    it('should check if weekend is not business day', async () => {
      const response = await request(app)
        .post('/is-business-day')
        .set('X-Payment', 'test')
        .send({ date: '2026-02-08', country: 'US' }); // Sunday

      expect(response.status).toBe(200);
      expect(response.body.is_business_day).toBe(false);
      expect(response.body.reason).toBe('weekend');
    });

    it('should check if weekday is business day', async () => {
      const response = await request(app)
        .post('/is-business-day')
        .set('X-Payment', 'test')
        .send({ date: '2026-02-04', country: 'US' }); // Wednesday

      expect(response.status).toBe(200);
      expect(response.body.is_business_day).toBe(true);
    });
  });
});
