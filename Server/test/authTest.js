import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import './setup.js';

describe('Auth APIs', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        password: 'Password123',
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('email', 'test@example.com');
      expect(res.body.data).not.toHaveProperty('password_hash');
      expect(res.body.data.role).toBe('staff'); // default role
    });

    it('should not allow role tampering during register', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'hacker@example.com',
        password: 'Password123',
        role: 'admin', // tampering attempt
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.role).toBe('staff'); // should stay default
    });

    it('should return 409 if email already exists', async () => {
      await request(app).post('/api/auth/register').send({
        email: 'duplicate@example.com',
        password: 'Password123',
      });

      const res = await request(app).post('/api/auth/register').send({
        email: 'duplicate@example.com',
        password: 'Password123',
      });

      expect(res.statusCode).toBe(409);
    });

    it('should return 400 for missing fields', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        email: 'login@example.com',
        password: 'Password123',
      });
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: 'Password123',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('email', 'login@example.com');
    });

    it('should return 401 for wrong password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: 'WrongPassword',
      });

      expect(res.statusCode).toBe(401);
    });

    // -------- NoSQL Injection Tests --------
    it('should block NoSQL injection in email', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: { $gt: '' },
        password: 'anypassword',
      });

      expect(res.statusCode).toBe(400);
    });

    it('should block NoSQL injection in password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: { $ne: null },
      });

      expect(res.statusCode).toBe(400);
    });
  });
});