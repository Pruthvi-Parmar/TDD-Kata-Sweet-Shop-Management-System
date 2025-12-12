import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import User from '../../src/models/User';
import Sweet from '../../src/models/Sweet';

describe('Sweets API', () => {
  let authToken: string;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://ppruthviraj254:KNjFoY2LGTveUzYv@cluster0.dgypi.mongodb.net/incusweettdd_test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });
    authToken = registerResponse.body.token;
  });

  describe('POST /api/sweets', () => {
    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .send({
          name: 'Chocolate Truffle',
          description: 'Delicious chocolate truffle',
          price: 5.99,
          category: 'Chocolate',
          quantity: 100
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          name: 'Chocolate Truffle',
          description: 'Delicious chocolate truffle',
          price: 5.99,
          category: 'Chocolate',
          quantity: 100
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });

    it('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Chocolate Truffle'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 201 and created sweet on successful creation', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Chocolate Truffle',
          description: 'Delicious chocolate truffle',
          price: 5.99,
          category: 'Chocolate',
          quantity: 100
        });

      expect(response.status).toBe(201);
      expect(response.body.sweet).toBeDefined();
      expect(response.body.sweet.name).toBe('Chocolate Truffle');
      expect(response.body.sweet.description).toBe('Delicious chocolate truffle');
      expect(response.body.sweet.price).toBe(5.99);
      expect(response.body.sweet.category).toBe('Chocolate');
      expect(response.body.sweet.quantity).toBe(100);
      expect(response.body.sweet._id).toBeDefined();
    });

    it('should return 400 when price is negative', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Chocolate Truffle',
          description: 'Delicious chocolate truffle',
          price: -5.99,
          category: 'Chocolate',
          quantity: 100
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 400 when quantity is negative', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Chocolate Truffle',
          description: 'Delicious chocolate truffle',
          price: 5.99,
          category: 'Chocolate',
          quantity: -10
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/sweets', () => {
    it('should return empty array when no sweets exist', async () => {
      const response = await request(app)
        .get('/api/sweets');

      expect(response.status).toBe(200);
      expect(response.body.sweets).toBeDefined();
      expect(response.body.sweets).toEqual([]);
    });

    it('should return array of all sweets', async () => {
      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Chocolate Truffle',
          description: 'Delicious chocolate truffle',
          price: 5.99,
          category: 'Chocolate',
          quantity: 100
        });

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Vanilla Fudge',
          description: 'Creamy vanilla fudge',
          price: 4.99,
          category: 'Fudge',
          quantity: 50
        });

      const response = await request(app)
        .get('/api/sweets');

      expect(response.status).toBe(200);
      expect(response.body.sweets).toBeDefined();
      expect(response.body.sweets).toHaveLength(2);
    });

    it('should not require authentication', async () => {
      const response = await request(app)
        .get('/api/sweets');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Chocolate Truffle',
          description: 'Delicious chocolate truffle',
          price: 5.99,
          category: 'Chocolate',
          quantity: 100
        });

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Vanilla Fudge',
          description: 'Creamy vanilla fudge',
          price: 4.99,
          category: 'Fudge',
          quantity: 50
        });

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Dark Chocolate Bar',
          description: 'Rich dark chocolate',
          price: 7.99,
          category: 'Chocolate',
          quantity: 75
        });
    });

    it('should filter sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ name: 'Chocolate' });

      expect(response.status).toBe(200);
      expect(response.body.sweets).toHaveLength(2);
    });

    it('should filter sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ category: 'Fudge' });

      expect(response.status).toBe(200);
      expect(response.body.sweets).toHaveLength(1);
      expect(response.body.sweets[0].name).toBe('Vanilla Fudge');
    });

    it('should filter sweets by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ minPrice: 5, maxPrice: 6 });

      expect(response.status).toBe(200);
      expect(response.body.sweets).toHaveLength(1);
      expect(response.body.sweets[0].name).toBe('Chocolate Truffle');
    });

    it('should combine multiple filters', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ category: 'Chocolate', maxPrice: 6 });

      expect(response.status).toBe(200);
      expect(response.body.sweets).toHaveLength(1);
      expect(response.body.sweets[0].name).toBe('Chocolate Truffle');
    });

    it('should return empty array when no matches found', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ name: 'NonExistent' });

      expect(response.status).toBe(200);
      expect(response.body.sweets).toHaveLength(0);
    });
  });

  describe('PUT /api/sweets/:id', () => {
    let sweetId: string;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Chocolate Truffle',
          description: 'Delicious chocolate truffle',
          price: 5.99,
          category: 'Chocolate',
          quantity: 100
        });
      sweetId = createResponse.body.sweet._id;
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(401);
    });

    it('should return 404 when sweet does not exist', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(404);
    });

    it('should update sweet and return updated object', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Chocolate Truffle',
          price: 6.99
        });

      expect(response.status).toBe(200);
      expect(response.body.sweet).toBeDefined();
      expect(response.body.sweet.name).toBe('Updated Chocolate Truffle');
      expect(response.body.sweet.price).toBe(6.99);
      expect(response.body.sweet.description).toBe('Delicious chocolate truffle');
    });

    it('should return 400 when updating with invalid price', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ price: -5 });

      expect(response.status).toBe(400);
    });
  });
});

