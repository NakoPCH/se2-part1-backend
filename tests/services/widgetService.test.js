import { jest } from '@jest/globals';

// 1. Mock Model & Helpers
jest.mock('../../models/Widget.js', () => ({
  Widget: { create: jest.fn() },
}));

jest.mock('../../utils/helpers.js', () => ({
  generateId: () => 'mock-widget-id',
  isDbConnected: jest.fn(),
}));

// 2. Imports
import { Widget } from '../../models/Widget.js';
import { isDbConnected } from '../../utils/helpers.js';
import { widgets } from '../../data.js';
import * as widgetService from '../../services/widgetService.js';

describe('Widget Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    widgets.length = 0; // Clear memory
  });

  test('should create widget in DB when connected', async () => {
    isDbConnected.mockReturnValue(true);
    
    const mockDoc = { toObject: () => ({ id: 'db-w1', type: 'weather' }) };
    Widget.create.mockResolvedValue(mockDoc);

    const result = await widgetService.createWidget({ userId: 'u1', type: 'weather' });

    expect(Widget.create).toHaveBeenCalled();
    expect(result.id).toBe('db-w1');
  });

  test('should create widget in Memory when DB disconnected', async () => {
    isDbConnected.mockReturnValue(false);

    const result = await widgetService.createWidget({ userId: 'u1', type: 'clock' });

    expect(widgets).toHaveLength(1);
    expect(result.id).toBe('mock-widget-id');
    expect(result.type).toBe('clock');
  });
});