import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';

// 1. Δημιουργία των Mocks
const mockCreateHouse = jest.fn();
const mockDeleteHouse = jest.fn();

// 2. Mocking του Service Module
jest.mock('../../services/houseService.js', () => ({
  __esModule: true,
  createHouse: mockCreateHouse,
  deleteHouse: mockDeleteHouse,
}));

// 3. Mocking του Auth Middleware (για να μην μπλέκουμε με tokens)
jest.mock('../../middleware/auth.js', () => ({
  basicAuth: (req, res, next) => {
    req.user = { id: 'user123' }; // Simulatum user authentication
    next();
  },
}));

describe('House API', () => {
  let app;

  beforeAll(async () => {
    // Dynamic import του controller
    const houseController = await import('../../controllers/houseController.js');
    // Dynamic import του validation middleware (αν δεν είναι mocked)
    const { requireFields } = await import('../../middleware/validation.js');

    app = express();
    app.use(express.json());

    // Ορισμός των routes χειροκίνητα για το test
    app.post(
      '/api/houses', 
      (req, res, next) => { req.user = { id: 'user123' }; next(); }, // Mock auth middleware inline
      requireFields(['name', 'address']), 
      houseController.createHouseController
    );
    
    app.delete(
      '/api/houses/:houseId', 
      (req, res, next) => { req.user = { id: 'user123' }; next(); },
      houseController.deleteHouseController
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/houses -> 201 Created', async () => {
    // Ρυθμίζουμε το mock να επιστρέφει το νέο σπίτι
    mockCreateHouse.mockResolvedValue({ 
      id: 'h1', 
      name: 'My Villa', 
      address: 'Athens', 
      ownerId: 'user123' 
    });

    const res = await request(app)
      .post('/api/houses')
      .send({ name: 'My Villa', address: 'Athens' });

    expect(res.statusCode).toBe(201);
    // Θυμήσου το .data που μάθαμε πριν!
    expect(res.body.data.name).toBe('My Villa');
    expect(mockCreateHouse).toHaveBeenCalled();
  });

  test('POST /api/houses -> 400 Missing Fields', async () => {
    // Στέλνουμε άδειο body για να τεστάρουμε το validation
    const res = await request(app)
      .post('/api/houses')
      .send({});

    expect(res.statusCode).toBe(400);
  });

  test('DELETE /api/houses/:houseId -> 200 OK', async () => {
    mockDeleteHouse.mockResolvedValue(true);

    const res = await request(app).delete('/api/houses/h1');

    expect(res.statusCode).toBe(200);
  });

  test('DELETE /api/houses/:houseId -> 404 Not Found', async () => {
    mockDeleteHouse.mockResolvedValue(false);

    const res = await request(app).delete('/api/houses/non-existent');

    expect(res.statusCode).toBe(404);
  });
});