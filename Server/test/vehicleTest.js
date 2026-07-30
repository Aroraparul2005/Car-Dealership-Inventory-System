import request from 'supertest';
import app from '../src/app.js';
import Vehicle from '../src/models/Vehicle.js';
import User from '../src/models/User.js';
import './setup.js';

let adminToken;
let staffToken;

beforeAll(async () => {
  // Create admin
  await request(app).post('/api/auth/register').send({
    email: 'admin@test.com',
    password: 'Admin123',
  });

  // Force admin role (only for testing)
  await User.findOneAndUpdate(
    { email: 'admin@test.com' },
    { role: 'admin' }
  );

  const adminLogin = await request(app).post('/api/auth/login').send({
    email: 'admin@test.com',
    password: 'Admin123',
  });
  adminToken = adminLogin.body.data.token;

  // Create staff
  await request(app).post('/api/auth/register').send({
    email: 'staff@test.com',
    password: 'Staff123',
  });

  const staffLogin = await request(app).post('/api/auth/login').send({
    email: 'staff@test.com',
    password: 'Staff123',
  });
  staffToken = staffLogin.body.data.token;
});

describe('Vehicle APIs', () => {
  describe('POST /api/vehicles', () => {
    it('should create a vehicle successfully', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'Toyota',
          model: 'Camry',
          category: 'car',
          price: 25000,
          quantity: 10,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.make).toBe('Toyota');
    });

    it('should reject price as string', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'Toyota',
          model: 'Camry',
          category: 'car',
          price: '25000', // string
          quantity: 10,
        });

      expect(res.statusCode).toBe(400);
    });

    it('should reject negative price', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'Toyota',
          model: 'Camry',
          category: 'car',
          price: -5000,
          quantity: 10,
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('Invalid ObjectId format', () => {
    it('PUT /api/vehicles/not-an-id should return 400', async () => {
      const res = await request(app)
        .put('/api/vehicles/not-an-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 30000 });

      expect(res.statusCode).toBe(400);
    });

    it('DELETE /api/vehicles/123 should return 400', async () => {
      const res = await request(app)
        .delete('/api/vehicles/123')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(400);
    });

    it('POST /api/vehicles/invalid-id/purchase should return 400', async () => {
      const res = await request(app)
        .post('/api/vehicles/invalid-id/purchase')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({ quantity: 1 });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('Purchase & Race Condition', () => {
    it('should purchase successfully when stock is available', async () => {
      const vehicle = await Vehicle.create({
        make: 'Honda',
        model: 'Civic',
        category: 'car',
        price: 20000,
        quantity: 5,
      });

      const res = await request(app)
        .post(`/api/vehicles/${vehicle._id}/purchase`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send({ quantity: 2 });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.quantity).toBe(3);
    });

    it('should prevent overselling (race condition test)', async () => {
      const vehicle = await Vehicle.create({
        make: 'Honda',
        model: 'Civic',
        category: 'car',
        price: 20000,
        quantity: 1,
      });

      // Fire 5 parallel requests
      const requests = Array(5)
        .fill()
        .map(() =>
          request(app)
            .post(`/api/vehicles/${vehicle._id}/purchase`)
            .set('Authorization', `Bearer ${staffToken}`)
            .send({ quantity: 1 })
        );

      const results = await Promise.all(requests);

      const successCount = results.filter((r) => r.statusCode === 200).length;
      const failCount = results.filter((r) => r.statusCode === 400).length;

      expect(successCount).toBe(1);
      expect(failCount).toBe(4);

      const updated = await Vehicle.findById(vehicle._id);
      expect(updated.quantity).toBe(0);
    });

    it('should fail when trying to purchase more than available stock', async () => {
      const vehicle = await Vehicle.create({
        make: 'Ford',
        model: 'Focus',
        category: 'car',
        price: 18000,
        quantity: 2,
      });

      const res = await request(app)
        .post(`/api/vehicles/${vehicle._id}/purchase`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send({ quantity: 5 });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('Restock', () => {
    it('should restock successfully', async () => {
      const vehicle = await Vehicle.create({
        make: 'BMW',
        model: 'X5',
        category: 'suv',
        price: 60000,
        quantity: 3,
      });

      const res = await request(app)
        .post(`/api/vehicles/${vehicle._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 5 });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.quantity).toBe(8);
    });
  });
});