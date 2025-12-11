// tests/models/Automation.test.js

// ΑΛΛΑΞΕ ΤΗΝ ΠΡΩΤΗ ΓΡΑΜΜΗ ΣΕ ΑΥΤΟ:
import { connect, closeDatabase, clearDatabase } from '../dbHandler.js'; 

import { Automation } from '../../models/Automation.js';

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe('Automation Model Test', () => {
// ... (ο υπόλοιπος κώδικας μένει ίδιος)
    it('should create a valid automation', async () => {
    const validAutomation = {
      name: 'Night Mode',
      ownerId: 'user123',
      rules: [
        {
          deviceId: 'device_01',
          trigger: '22:00',
          action: { power: 'off' }
        }
      ]
    };

    const automation = new Automation(validAutomation);
    const savedAutomation = await automation.save();

    expect(savedAutomation._id).toBeDefined();
    expect(savedAutomation.name).toBe('Night Mode');
  });

  it('should fail to create automation without required fields', async () => {
    const invalidAutomation = { rules: [] };
    let err;
    try {
      const automation = new Automation(invalidAutomation);
      await automation.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.name).toBeDefined();
  });

});