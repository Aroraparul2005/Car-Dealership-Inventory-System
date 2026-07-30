import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import './setup.js';

describe('Auth APIs', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('email', 'test@example.com');
      expect(res.body).not.toHaveProperty('password');
    });

    it('should return 409 if email already exists', async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Dup User',
        email: 'duplicate@example.com',
        password: 'Password123',
      });
      const res = await request(app).post('/api/auth/register').send({
        name: 'Dup User',
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
        name: 'Login User',
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
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 for wrong password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: 'WrongPassword',
      });
      expect(res.statusCode).toBe(401);
    });
  });
});