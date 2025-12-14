import request from 'supertest';
import { jest } from '@jest/globals';
import { User } from '../../models/User.js';
import { connect, closeDatabase } from '../dbHandler.js'; 
import bcrypt from 'bcrypt';

jest.setTimeout(30000);

describe('Auth API Integration', () => {
  let app;

  beforeAll(async () => {
    await connect();
    const appModule = await import('../../app.js');
    app = appModule.default;
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await closeDatabase();
  });

  test('POST /api/auth/login returns 200 for valid user', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await User.create({
      username: 'testuser',
      password: hashedPassword,
      name: 'Test User',
      email: 'test@example.com',
      role: 'user'
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    expect(res.statusCode).toBe(200);
    
    // ΔΙΟΡΘΩΣΗ: Το API σου επιστρέφει user και authHeader, όχι token
    expect(res.body.data).toHaveProperty('user');
    expect(res.body.data).toHaveProperty('authHeader');
  });

  test('POST /api/auth/login returns 401 for invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'wronguser',
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(401);
  });
});