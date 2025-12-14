// tests/services/automationService.test.js
import { jest } from '@jest/globals';
import { connect, closeDatabase, clearDatabase } from '../dbHandler.js';

jest.setTimeout(30000); // 30 δευτερόλεπτα timeout

// 1. Mock του helpers για να αναγκάσουμε το service να δει "Database Connected"
jest.unstable_mockModule('../../utils/helpers.js', () => ({
  isDbConnected: jest.fn().mockReturnValue(true),
  generateId: jest.fn()
}));

// 2. Mock του data.js (κενά arrays για να μην χτυπάει το import)
jest.unstable_mockModule('../../data.js', () => ({
  automations: []
}));

describe('Automation Service (DB Mode)', () => {
  let automationService;

  beforeAll(async () => {
    await connect();
    // Dynamic import του service
    automationService = await import('../../services/automationService.js');
  });

  afterEach(async () => await clearDatabase());
  afterAll(async () => await closeDatabase());

  test('createAutomation should save a new rule to the database', async () => {
    const payload = {
      name: 'Morning Routine',
      ownerId: 'user_123',
      rules: [
        { deviceId: 'd1', trigger: '08:00', action: { on: true } }
      ]
    };

    const result = await automationService.createAutomation(payload);

    expect(result).toBeDefined();
    expect(result._id).toBeDefined();
    expect(result.name).toBe('Morning Routine');
    expect(result.ownerId).toBe('user_123');
    expect(result.rules).toHaveLength(1);
  });
});