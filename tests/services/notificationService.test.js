import { jest } from '@jest/globals';

// 1. Mock Model & Helpers
jest.mock('../../models/Notification.js', () => ({
  Notification: { create: jest.fn() },
}));

jest.mock('../../utils/helpers.js', () => ({
  generateId: () => 'mock-notif-id',
  isDbConnected: jest.fn(),
}));

// 2. Imports
import { Notification } from '../../models/Notification.js';
import { isDbConnected } from '../../utils/helpers.js';
import { notifications } from '../../data.js';
import * as notificationService from '../../services/notificationService.js';

describe('Notification Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    notifications.length = 0;
  });

  test('should create notification in DB when connected', async () => {
    isDbConnected.mockReturnValue(true);
    
    const mockDoc = { toObject: () => ({ id: 'db-n1', title: 'Hello' }) };
    Notification.create.mockResolvedValue(mockDoc);

    const result = await notificationService.createNotification({ userId: 'u1', title: 'Hello', message: 'World' });

    expect(Notification.create).toHaveBeenCalled();
    expect(result.title).toBe('Hello');
  });

  test('should create notification in Memory when DB disconnected', async () => {
    isDbConnected.mockReturnValue(false);

    const result = await notificationService.createNotification({ userId: 'u1', title: 'Alert', message: 'Test' });

    expect(notifications).toHaveLength(1);
    expect(result.id).toBe('mock-notif-id');
    expect(result.read).toBe(false); // Ελέγχουμε και το default value
    expect(result.createdAt).toBeDefined();
  });
});