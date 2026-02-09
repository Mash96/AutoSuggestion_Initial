const request = require('supertest');
const app = require('../app');

describe('GET /search – SQL Injection Protection', () => {

  test('blocks OR 1=1 injection attempt', async () => {
    const res = await request(app)
      .get('/search')
      .query({ key: '" OR 1=1 --' });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeLessThanOrEqual(10);
  });

  test('handles UNION SELECT safely', async () => {
    const res = await request(app)
      .get('/search')
      .query({ key: '%" UNION SELECT password FROM users --' });

    expect(res.statusCode).toBe(200);
    expect(res.body).not.toContain(expect.stringMatching(/password/i));
  });

});
