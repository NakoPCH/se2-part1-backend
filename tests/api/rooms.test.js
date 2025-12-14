import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';

// 1. Mocking του Service Module
const mockCreateRoom = jest.fn();
const mockDeleteRoom = jest.fn();

jest.mock('../../services/roomService.js', () => ({
  __esModule: true,
  createRoom: mockCreateRoom,
  deleteRoom: mockDeleteRoom,
}));

// 2. Mocking του Auth & Validation Middlewares
jest.mock('../../middleware/auth.js', () => ({
  basicAuth: (req, res, next) => next(),
}));

describe('Room API', () => {
  let app;

  beforeAll(async () => {
    // Import του controller
    const roomController = await import('../../controllers/roomController.js');
    // Import του validation (χρειαζόμαστε το real ή mock, εδώ κάνουμε import το real)
    const validation = await import('../../middleware/validation.js');

    app = express();
    app.use(express.json());

    // Setup routes manualy για το test isolation
    app.post(
      '/api/houses/:houseId/rooms', 
      validation.requireFields(['name']), 
      roomController.createRoomController
    );
    app.delete('/api/rooms/:roomId', roomController.deleteRoomController);
    
    app.put(
      '/api/rooms/:roomId/temperature', 
      validation.requireFields(['temperature']), 
      roomController.setRoomTemperatureController
    );
    
    app.put(
      '/api/rooms/:roomId/lighting', 
      roomController.setRoomLightingController
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- CREATE ---
  test('POST /api/houses/:houseId/rooms -> 201 Created', async () => {
    mockCreateRoom.mockResolvedValue({ id: 'r1', name: 'Living Room', houseId: 'h1' });

    const res = await request(app)
      .post('/api/houses/h1/rooms')
      .send({ name: 'Living Room' });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.name).toBe('Living Room');
    expect(mockCreateRoom).toHaveBeenCalled();
  });

  // --- DELETE ---
  test('DELETE /api/rooms/:roomId -> 200 OK', async () => {
    mockDeleteRoom.mockResolvedValue(true);

    const res = await request(app).delete('/api/rooms/r1');

    expect(res.statusCode).toBe(200);
  });

  test('DELETE /api/rooms/:roomId -> 404 Not Found', async () => {
    mockDeleteRoom.mockResolvedValue(false);

    const res = await request(app).delete('/api/rooms/non-existent');

    expect(res.statusCode).toBe(404);
  });

  // --- TEMPERATURE (Controller Logic Only) ---
  test('PUT /api/rooms/:roomId/temperature -> 200 OK', async () => {
    const res = await request(app)
      .put('/api/rooms/r1/temperature')
      .send({ temperature: 24, unit: 'C' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.temperature).toBe(24);
  });

  // --- LIGHTING (Controller Logic Only) ---
  test('PUT /api/rooms/:roomId/lighting -> 200 OK', async () => {
    const res = await request(app)
      .put('/api/rooms/r1/lighting')
      .send({ brightness: 80, on: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.brightness).toBe(80);
    expect(res.body.data.on).toBe(true);
  });
});