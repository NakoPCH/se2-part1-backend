import { jest } from '@jest/globals';

// 1. Mocking External Libraries & Models
jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('hashed_password')),
  compare: jest.fn(),
}));

jest.mock('../../models/User.js', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  },
}));

jest.mock('../../utils/helpers.js', () => ({
  generateId: () => 'mock-user-id',
  isDbConnected: jest.fn(),
}));

// 2. Imports
import { User } from '../../models/User.js';
import { isDbConnected } from '../../utils/helpers.js';
// IMPORT ΟΛΩΝ ΤΩΝ ARRAYS ΓΙΑ ΝΑ ΤΑ ΚΑΘΑΡΙΣΟΥΜΕ
import { users, houses, rooms, devices, automations, scenarios, widgets, notifications } from '../../data.js';
import * as userService from '../../services/userService.js';
import fs from 'fs';
import bcrypt from 'bcrypt';

describe('User Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    // ΚΑΘΑΡΙΣΜΟΣ ΟΛΩΝ ΤΩΝ DATA ARRAYS
    users.length = 0;
    houses.length = 0;
    rooms.length = 0;
    devices.length = 0;
    automations.length = 0;
    scenarios.length = 0;
    widgets.length = 0;
    notifications.length = 0;
  });

  describe('createUser', () => {
    test('DB Connected: should create user if not exists', async () => {
      isDbConnected.mockReturnValue(true);
      User.findOne.mockResolvedValue(null); 
      
      const mockUserDoc = { toObject: () => ({ id: 'db-u1', username: 'test' }) };
      User.create.mockResolvedValue(mockUserDoc);

      const result = await userService.createUser({ username: 'test', password: '123', email: 'a@a.com' });

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(User.create).toHaveBeenCalled();
      expect(result.username).toBe('test');
    });

    test('DB Connected: should throw if username exists', async () => {
      isDbConnected.mockReturnValue(true);
      User.findOne.mockResolvedValue({ id: 'existing' });

      await expect(userService.createUser({ username: 'test', password: '123' }))
        .rejects.toThrow('Username already exists');
    });

    test('Memory: should create user and write to file', async () => {
      isDbConnected.mockReturnValue(false);

      const result = await userService.createUser({ username: 'localUser', password: '123', email: 'a@a.com' });

      expect(users).toHaveLength(1);
      expect(result.id).toBe('mock-user-id');
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    test('Memory: should throw if username exists', async () => {
      isDbConnected.mockReturnValue(false);
      users.push({ username: 'taken', password: '123' });

      await expect(userService.createUser({ username: 'taken', password: '123' }))
        .rejects.toThrow('Username already exists');
    });
  });

  describe('authenticateUser', () => {
    test('DB Connected: Success', async () => {
      isDbConnected.mockReturnValue(true);
      const mockUser = { password: 'hashed', toObject: () => ({ id: 'u1' }) };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      const result = await userService.authenticateUser('test', '123');
      expect(result).not.toBeNull();
    });

    test('DB Connected: User not found', async () => {
      isDbConnected.mockReturnValue(true);
      User.findOne.mockResolvedValue(null);

      const result = await userService.authenticateUser('test', '123');
      expect(result).toBeNull();
    });

    test('Memory: Success', async () => {
      isDbConnected.mockReturnValue(false);
      users.push({ username: 'local', password: '123' });

      const result = await userService.authenticateUser('local', '123');
      expect(result).not.toBeNull();
    });
  });

  describe('getUserById', () => {
    test('DB Connected: Returns lean object', async () => {
      isDbConnected.mockReturnValue(true);
      const mockLean = jest.fn().mockResolvedValue({ id: 'u1' });
      User.findById.mockReturnValue({ lean: mockLean });

      const result = await userService.getUserById('u1');
      expect(result.id).toBe('u1');
    });

    test('Memory: Returns found object', async () => {
      isDbConnected.mockReturnValue(false);
      users.push({ id: 'u1', username: 'found' });

      const result = await userService.getUserById('u1');
      expect(result.username).toBe('found');
    });
  });

  describe('getUserStatistics', () => {
    test('should return correct counts based on data arrays', async () => {
      // Τώρα που καθαρίσαμε τα arrays στο beforeEach, είναι σίγουρα 0
      const stats = await userService.getUserStatistics('u1');
      
      expect(stats).toHaveProperty('houses');
      expect(stats.houses).toBe(0);
      expect(stats.devices).toBe(0);
    });
  });
});