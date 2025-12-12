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
  });
});

