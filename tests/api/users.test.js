import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';

// 1. Mocking Dependencies
const mockCreateUser = jest.fn();
const mockGetUserById = jest.fn();
const mockGetUserStatistics = jest.fn();
const mockCreateWidget = jest.fn();
const mockCreateNotification = jest.fn();

// Mock Services
jest.mock('../../services/userService.js', () => ({
  __esModule: true,
  createUser: mockCreateUser,
  getUserById: mockGetUserById,
  getUserStatistics: mockGetUserStatistics,
}));

jest.mock('../../services/widgetService.js', () => ({
  createWidget: mockCreateWidget,
}));

jest.mock('../../services/notificationService.js', () => ({
  createNotification: mockCreateNotification,
}));

// Mock Middleware (Το χρησιμοποιούμε και μέσα στο app)
const mockAuth = (req, res, next) => {
  req.user = { id: 'u1', username: 'tester' };
  next();
};

jest.mock('../../middleware/auth.js', () => ({
  basicAuth: mockAuth,
}));

describe('User API', () => {
  let app;

  beforeAll(async () => {
    const userController = await import('../../controllers/userController.js');
    const validation = await import('../../middleware/validation.js');

    app = express();
    app.use(express.json());

    // Routes setup
    app.post('/api/users', validation.requireFields(['username', 'password']), userController.createUserController);
    
    // ΔΙΟΡΘΩΣΗ: Προσθέσαμε το mockAuth εδώ!
    app.get('/api/users/me', mockAuth, userController.getCurrentUserController);
    
    app.get('/api/users/:userId/statistics', userController.getUserStatisticsController);
    app.put('/api/users/:userId/home', userController.customizeHomeController);
    app.post('/api/users/:userId/widgets', userController.addWidgetController);
    app.post('/api/users/:userId/notifications', userController.sendNotificationController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- CREATE USER ---
  test('POST /api/users -> 201 Created', async () => {
    mockCreateUser.mockResolvedValue({ id: 'u1', username: 'newuser' });

    const res = await request(app)
      .post('/api/users')
      .send({ username: 'newuser', password: '123', email: 'a@b.com' });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.username).toBe('newuser');
  });

  // --- GET STATISTICS ---
  test('GET /api/users/:userId/statistics -> 200 OK', async () => {
    mockGetUserById.mockResolvedValue({ id: 'u1' });
    mockGetUserStatistics.mockResolvedValue({ houses: 1, devices: 5 });

    const res = await request(app).get('/api/users/u1/statistics');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.devices).toBe(5);
  });

  test('GET /api/users/:userId/statistics -> 404 User Not Found', async () => {
    mockGetUserById.mockResolvedValue(null);

    const res = await request(app).get('/api/users/u1/statistics');

    expect(res.statusCode).toBe(404);
  });

  // --- CUSTOMIZE HOME ---
  test('PUT /api/users/:userId/home -> 200 OK', async () => {
    mockGetUserById.mockResolvedValue({ id: 'u1' });

    const res = await request(app)
      .put('/api/users/u1/home')
      .send({ layout: { theme: 'dark' } });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.layout.theme).toBe('dark');
  });

  // --- WIDGETS ---
  test('POST /api/users/:userId/widgets -> 201 Created', async () => {
    mockCreateWidget.mockResolvedValue({ id: 'w1', type: 'weather' });

    const res = await request(app)
      .post('/api/users/u1/widgets')
      .send({ type: 'weather' });

    expect(res.statusCode).toBe(201);
  });

  // --- NOTIFICATIONS ---
  test('POST /api/users/:userId/notifications -> 200 OK', async () => {
    mockCreateNotification.mockResolvedValue({ id: 'n1', message: 'Hello' });

    const res = await request(app)
      .post('/api/users/u1/notifications')
      .send({ title: 'Hi', message: 'Hello' });

    expect(res.statusCode).toBe(200);
  });

  // --- CURRENT USER ---
  test('GET /api/users/me -> 200 OK', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.username).toBe('tester');
  });
});