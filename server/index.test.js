const request = require('supertest');
const app = require('./index');

describe('Backend API Tests', () => {
  describe('GET /api/health', () => {
    test('should return 200 OK with status and timestamp', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(typeof response.body.timestamp).toBe('string');
    });
  });

  describe('GET /api/jobs', () => {
    test('should return jobs list with pagination', async () => {
      const response = await request(app)
        .get('/api/jobs')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should filter jobs by search term', async () => {
      const response = await request(app)
        .get('/api/jobs?search=Engineer')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/jobs/:id', () => {
    test('should return specific job when ID exists', async () => {
      const response = await request(app)
        .get('/api/jobs/1903980996')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id', '1903980996');
    });

    test('should return 404 when job ID does not exist', async () => {
      const response = await request(app)
        .get('/api/jobs/nonexistent')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Job not found');
    });
  });
});