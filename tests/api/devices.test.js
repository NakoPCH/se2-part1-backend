import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';

// 1. Δημιουργία των Mocks
const mockCreateDevice = jest.fn();
const mockDeleteDevice = jest.fn();
const mockUpdateDevice = jest.fn();

// 2. Mocking του Service Module
jest.unstable_mockModule('../../services/deviceService.js', () => ({
  __esModule: true,
  createDevice: mockCreateDevice,
  deleteDevice: mockDeleteDevice,
  updateDevice: mockUpdateDevice,
  getDeviceStatus: jest.fn(),
  performDeviceAction: jest.fn(),
  updateSecurityState: jest.fn(),
}));

describe('Device API (Manual Route Mounting)', () => {
  let app;

  beforeAll(async () => {
    const deviceController = await import('../../controllers/deviceController.js');

    app = express();
    app.use(express.json());

    app.post('/api/rooms/:roomId/devices', deviceController.createDeviceController);
    app.delete('/api/devices/:deviceId', deviceController.deleteDeviceController);
    app.put('/api/devices/:deviceId', deviceController.updateDeviceController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/rooms/:roomId/devices -> 201 Created', async () => {
    mockCreateDevice.mockResolvedValue({ id: 'd1', name: 'Lamp', roomId: 'r1' });

    const res = await request(app)
      .post('/api/rooms/r1/devices')
      .send({ name: 'Lamp', type: 'light' });

    expect(res.statusCode).toBe(201);
  });

  test('DELETE /api/devices/:deviceId -> 200 OK', async () => {
    mockDeleteDevice.mockResolvedValue(true);

    const res = await request(app).delete('/api/devices/d1');

    expect(res.statusCode).toBe(200);
  });

  test('PUT /api/devices/:deviceId -> 200 OK', async () => {
    // Χρησιμοποιούμε mockResolvedValue που είναι πιο "καθαρό"
    mockUpdateDevice.mockResolvedValue({ id: 'd1', name: 'New Name' });

    const res = await request(app)
      .put('/api/devices/d1')
      .send({ name: 'New Name' });

    // Αν αποτύχει πάλι, σημαίνει ότι το deviceId στο URL δεν περνάει σωστά
    // αλλά με το express app που φτιάξαμε θα έπρεπε να είναι ΟΚ.
    if (res.statusCode !== 200) console.error('PUT Error:', res.body);

    expect(res.statusCode).toBe(200);
  });
});
