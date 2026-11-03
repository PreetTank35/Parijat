import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('Parijat API Test Suite', () => {
  it('GET /api/health should return ok and app tagline', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.app).toBe('Parijat API');
    expect(res.body.services.aiPriceEstimator).toBe('active');
  });

  it('GET / should return friendly landing info or HTML', async () => {
    const res = await request(app)
      .get('/')
      .set('Accept', 'application/json');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.webAppUrl).toBe('http://localhost:5173');

    const htmlRes = await request(app)
      .get('/')
      .set('Accept', 'text/html');
    expect(htmlRes.status).toBe(200);
    expect(htmlRes.text).toContain('Parijat Agricultural Platform');
    expect(htmlRes.text).toContain('http://localhost:5173');
  });

  describe('Auth Module', () => {
    let authToken = '';

    it('POST /api/v1/auth/request-otp should accept valid 10-digit Indian phone', async () => {
      const res = await request(app)
        .post('/api/v1/auth/request-otp')
        .send({ phone: '9822012345' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.demoCode).toBe('123456');
    });

    it('POST /api/v1/auth/verify-otp should verify OTP and return session token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/verify-otp')
        .send({ phone: '9822012345', otp: '123456' });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.phone).toBe('9822012345');
      authToken = res.body.token;
    });

    it('POST /api/v1/auth/verify-otp with incorrect OTP should reject with 401', async () => {
      const res = await request(app)
        .post('/api/v1/auth/verify-otp')
        .send({ phone: '9822012345', otp: '000000' });

      expect([400, 401]).toContain(res.status);
    });

    it('GET /api/v1/auth/me should return authenticated user profile', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBeDefined();
      expect(res.body.phone).toBe('9822012345');
    });
  });

  describe('Equipment Module', () => {
    it('GET /api/v1/equipment/categories should return categories with Marathi names', async () => {
      const res = await request(app).get('/api/v1/equipment/categories');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].nameMr).toBeDefined();
    });

    it('GET /api/v1/equipment/villages should return Maharashtra pilot villages', async () => {
      const res = await request(app).get('/api/v1/equipment/villages');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('GET /api/v1/equipment should return paginated listings', async () => {
      const res = await request(app).get('/api/v1/equipment');
      expect(res.status).toBe(200);
      expect(res.body.listings).toBeDefined();
      expect(Array.isArray(res.body.listings)).toBe(true);
      expect(res.body.listings.length).toBeGreaterThan(0);
    });
  });

  describe('AI Crop Prices & Fair Price Estimator Module', () => {
    let testCropId = '';
    let testMarketId = '';

    it('GET /api/v1/crops should return crops list with multilingual support', async () => {
      const res = await request(app).get('/api/v1/crops');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.some((c: any) => c.code === 'ONION')).toBe(true);
      testCropId = res.body[0].id;
    });

    it('GET /api/v1/markets should return APMC mandis', async () => {
      const res = await request(app).get('/api/v1/markets');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      testMarketId = res.body[0].id;
    });

    it('GET /api/v1/market-prices should return verified observations', async () => {
      const res = await request(app).get('/api/v1/market-prices');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('POST /api/v1/price-estimates (AI Backend) should calculate fair price estimate with confidence and explanations', async () => {
      const res = await request(app)
        .post('/api/v1/price-estimates')
        .send({
          cropId: testCropId,
          marketId: testMarketId,
        });

      expect(res.status).toBe(200);
      expect(res.body.cropId).toBe(testCropId);
      expect(res.body.estimatedModal).toBeGreaterThanOrEqual(0);
      expect(res.body.confidence).toBeDefined();
      expect(res.body.explanationEn).toBeDefined();
      expect(res.body.explanationMr).toBeDefined(); // Native Marathi explanation
      expect(res.body.explanationHi).toBeDefined(); // Native Hindi explanation
      expect(res.body.isDemo).toBe(true);
    });
  });

  describe('Farm Supplies & Inputs Module', () => {
    it('GET /api/v1/inputs should return agricultural inputs catalog', async () => {
      const res = await request(app).get('/api/v1/inputs');
      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
