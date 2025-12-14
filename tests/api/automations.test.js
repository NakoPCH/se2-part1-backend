// tests/api/automations.test.js
import request from 'supertest';
import { jest } from '@jest/globals';
import fs from 'fs'; // Import το πραγματικό fs
import app from '../../app.js'; // Import το app

describe('Automation API Endpoints', () => {
  
  // Πριν από κάθε test καθαρίζουμε τα "κατασκοπευτικά" mocks
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // --- GET /automations ---
  test('GET /api/automations returns list of automations', async () => {
    const mockAutomations = [
      { id: '1', name: 'Morning Coffee', time: '08:00', selectedDevices: ['d1'], isActive: true }
    ];
    
    // Mock ότι το αρχείο υπάρχει και περιέχει δεδομένα
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockAutomations));

    const res = await request(app).get('/api/automations');
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Morning Coffee');
  });

  test('GET /api/automations returns empty array if file missing', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false); // Το αρχείο δεν υπάρχει
    
    const res = await request(app).get('/api/automations');
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  // --- POST /automations ---
  test('POST /api/automations creates a new automation', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue("[]"); // Αρχικά κενή λίστα
    const writeSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

    const newAutomation = {
      name: "Night Mode",
      time: "23:00",
      selectedDevices: ["light_1"],
      action: { power: "off" }
    };

    const res = await request(app)
      .post('/api/automations')
      .send(newAutomation);

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Night Mode");
    expect(res.body.id).toBeDefined();
    
    // Ελέγχουμε ότι προσπάθησε να σώσει στο αρχείο
    expect(writeSpy).toHaveBeenCalled();
  });

  test('POST /api/automations fails 400 if fields are missing', async () => {
    const invalidData = { name: "Incomplete" }; // Λείπουν time, devices κλπ

    const res = await request(app)
      .post('/api/automations')
      .send(invalidData);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  // --- PUT /automations/:id ---
  test('PUT /api/automations/:id updates an existing automation', async () => {
    const existingData = [
      { id: '123', name: 'Old Name', time: '10:00', selectedDevices: ['d1'], isActive: true }
    ];

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(existingData));
    const writeSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

    // Στέλνουμε αλλαγή στο όνομα
    const updateData = { name: 'New Name' };

    const res = await request(app)
      .put('/api/automations/123')
      .send(updateData);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('New Name');
    expect(res.body.id).toBe('123'); // Το ID δεν πρέπει να αλλάξει
    expect(writeSpy).toHaveBeenCalled();
  });

  test('PUT /api/automations/:id returns 404 if automation not found', async () => {
    const existingData = [{ id: '999', name: 'Other' }];
    
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(existingData));

    const res = await request(app)
      .put('/api/automations/123') // Ψάχνουμε το 123 που δεν υπάρχει
      .send({ name: 'Update' });

    expect(res.statusCode).toBe(404);
  });
  
  test('PUT /api/automations/:id returns 400 if body is empty', async () => {
      const res = await request(app)
        .put('/api/automations/123')
        .send({}); // Κενό body

      expect(res.statusCode).toBe(400);
  });

  // --- DELETE /automations/:id ---
  test('DELETE /api/automations/:id removes an automation', async () => {
    const existingData = [{ id: '123', name: 'To Delete' }];

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(existingData));
    const writeSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

    const res = await request(app).delete('/api/automations/123');

    expect(res.statusCode).toBe(200);
    expect(writeSpy).toHaveBeenCalled();
  });
});