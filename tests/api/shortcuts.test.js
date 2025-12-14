import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import fs from 'fs'; // Κάνουμε import το πραγματικό fs

describe('Shortcuts API', () => {
  let app;
  // Μεταβλητές για τους "κατασκόπους" (spies)
  let existsSyncSpy;
  let readFileSyncSpy;
  let writeFileSyncSpy;

  beforeAll(async () => {
    // 1. Ρυθμίζουμε τους Spies πάνω στις πραγματικές μεθόδους του fs
    existsSyncSpy = jest.spyOn(fs, 'existsSync');
    readFileSyncSpy = jest.spyOn(fs, 'readFileSync');
    writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');

    // 2. Dynamic import του controller
    const shortcutController = await import('../../controllers/shortcutController.js');

    app = express();
    app.use(express.json());

    app.get('/api/shortcuts', shortcutController.getShortcuts);
    app.post('/api/shortcuts', shortcutController.saveShortcuts);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Καθαρισμός κλήσεων μετά από κάθε τεστ
  });

  afterAll(() => {
    jest.restoreAllMocks(); // Επαναφορά του fs στην αρχική του κατάσταση
  });

  describe('GET /api/shortcuts', () => {
    test('should return empty array if file does not exist', async () => {
      // Ρυθμίζουμε τον κατάσκοπο να επιστρέψει false
      existsSyncSpy.mockReturnValue(false);

      const res = await request(app).get('/api/shortcuts');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    test('should return parsed JSON data if file exists', async () => {
      existsSyncSpy.mockReturnValue(true);
      
      const mockData = [{ id: '1', type: 'device' }];
      // Ρυθμίζουμε τον κατάσκοπο να επιστρέψει το δικό μας JSON
      readFileSyncSpy.mockReturnValue(JSON.stringify(mockData));

      const res = await request(app).get('/api/shortcuts');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
    });

    test('should return empty array if reading fails', async () => {
      existsSyncSpy.mockReturnValue(true);
      // Προκαλούμε σφάλμα
      readFileSyncSpy.mockImplementation(() => { throw new Error('Read error'); });

      const res = await request(app).get('/api/shortcuts');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('POST /api/shortcuts', () => {
    test('should save shortcuts successfully', async () => {
      // Ρυθμίζουμε το writeFileSync να μην κάνει τίποτα (για να μην γράψει στον δίσκο)
      writeFileSyncSpy.mockImplementation(() => {});

      const payload = [{ id: '2', type: 'room' }];
      
      const res = await request(app)
        .post('/api/shortcuts')
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      // Ελέγχουμε ότι κλήθηκε η συνάρτηση
      expect(writeFileSyncSpy).toHaveBeenCalled();
    });

    test('should return 500 if saving fails', async () => {
      writeFileSyncSpy.mockImplementation(() => { throw new Error('Write error'); });

      const res = await request(app)
        .post('/api/shortcuts')
        .send([]);

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Failed to save shortcuts');
    });
  });
});