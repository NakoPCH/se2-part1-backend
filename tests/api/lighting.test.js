// tests/api/lighting.test.js
import request from 'supertest';
import { jest } from '@jest/globals';
import fs from 'fs'; // Κάνουμε import το πραγματικό fs
import app from '../../app.js'; // Κάνουμε import το app κανονικά

describe('Lighting API Endpoints', () => {
  
  // Πριν από κάθε test, καθαρίζουμε τα mocks
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // --- GET /rooms ---
  test('GET /api/lighting/rooms returns list of valid rooms', async () => {
    const res = await request(app).get('/api/lighting/rooms');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(["Living Room", "Bedroom", "Kitchen"]);
  });

  // --- GET /devices ---
  test('GET /api/lighting/devices returns devices from file', async () => {
    const mockDevices = [{ id: '1', name: 'Test Lamp', category: 'lamps' }];
    
    // Χρησιμοποιούμε spyOn για να "καπελώσουμε" τις μεθόδους του fs
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockDevices));

    const res = await request(app).get('/api/lighting/devices');
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Test Lamp');
  });

  // --- POST /devices ---
  test('POST /api/lighting/devices adds a new device', async () => {
    // Mock ότι το αρχείο ΔΕΝ υπάρχει στην αρχή (άρα άδεια λίστα) ή επιστρέφει κενό array
    jest.spyOn(fs, 'existsSync').mockReturnValue(true); // Υπάρχει το αρχείο
    jest.spyOn(fs, 'readFileSync').mockReturnValue("[]"); // Είναι άδειο array
    
    // Παρακολουθούμε την writeFileSync για να δούμε αν κλήθηκε
    const writeSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

    const newDevice = {
      name: "New Lamp",
      category: "lamps",
      location: "Living Room"
    };

    const res = await request(app)
      .post('/api/lighting/devices')
      .send(newDevice);

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("New Lamp");
    
    // Ελέγχουμε αν η εφαρμογή προσπάθησε να γράψει στο αρχείο
    expect(writeSpy).toHaveBeenCalled();
  });

  test('POST /api/lighting/devices fails with 400 if fields missing', async () => {
    const res = await request(app)
      .post('/api/lighting/devices')
      .send({ name: "Incomplete" });

    expect(res.statusCode).toBe(400);
  });

  // --- DELETE /devices/:id ---
  test('DELETE /api/lighting/devices/:id removes a device', async () => {
    const mockDevices = [{ id: '123', name: 'To Delete' }];
    
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockDevices));
    const writeSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

    const res = await request(app).delete('/api/lighting/devices/123');

    expect(res.statusCode).toBe(200);
    expect(writeSpy).toHaveBeenCalled();
  });

  test('DELETE /api/lighting/devices/:id returns 404 if not found', async () => {
    const mockDevices = [{ id: '999', name: 'Other Device' }];
    
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockDevices));
    const writeSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

    const res = await request(app).delete('/api/lighting/devices/123'); 

    expect(res.statusCode).toBe(404);
    // Δεν πρέπει να γράψει τίποτα αν δεν βρει τη συσκευή
    expect(writeSpy).not.toHaveBeenCalled();
  });
});