import { jest } from '@jest/globals';

// 1. Mock Model & Helpers
jest.mock('../../models/Scenario.js', () => ({
  Scenario: { create: jest.fn() },
}));

jest.mock('../../utils/helpers.js', () => ({
  generateId: () => 'mock-scenario-id',
  isDbConnected: jest.fn(),
}));

// 2. Imports
import { Scenario } from '../../models/Scenario.js';
import { isDbConnected } from '../../utils/helpers.js';
import { scenarios } from '../../data.js';
import * as scenarioService from '../../services/scenarioService.js';

describe('Scenario Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    scenarios.length = 0;
  });

  test('should create scenario in DB when connected', async () => {
    isDbConnected.mockReturnValue(true);
    
    const mockDoc = { toObject: () => ({ id: 'db-s1', name: 'Morning' }) };
    Scenario.create.mockResolvedValue(mockDoc);

    const result = await scenarioService.createScenario({ name: 'Morning', ownerId: 'u1', steps: [] });

    expect(Scenario.create).toHaveBeenCalled();
    expect(result.name).toBe('Morning');
  });

  test('should create scenario in Memory when DB disconnected', async () => {
    isDbConnected.mockReturnValue(false);

    const result = await scenarioService.createScenario({ name: 'Night', ownerId: 'u1' });

    expect(scenarios).toHaveLength(1);
    expect(result.id).toBe('mock-scenario-id');
    expect(result.steps).toEqual([]); // Ελέγχουμε το default empty array
  });
});