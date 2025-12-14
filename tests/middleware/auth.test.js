import { jest } from '@jest/globals';
import { Buffer } from 'buffer';

// 1. Mock Modules - Ορίζουμε τα mocks απευθείας μέσα (INLINE)
// Έτσι αποφεύγουμε το ReferenceError 100%
jest.mock('../../models/User.js', () => ({
  User: { findOne: jest.fn() },
}));

jest.mock('../../utils/helpers.js', () => ({
  isDbConnected: jest.fn(),
}));

jest.mock('../../utils/responses.js', () => ({
  sendError: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

jest.mock('../../data.js', () => ({
  users: [{ username: 'memUser', password: 'memPassword', id: 'm1' }],
}));

// 2. Imports - Εισάγουμε τα mocks για να τα ελέγχουμε στα tests
import { User } from '../../models/User.js';
import { isDbConnected } from '../../utils/helpers.js';
import { sendError } from '../../utils/responses.js';
import bcrypt from 'bcrypt';
import { basicAuth } from '../../middleware/auth.js';

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { headers: {} };
    res = {};
    next = jest.fn();
  });

  const setAuthHeader = (username, password) => {
    const creds = Buffer.from(`${username}:${password}`).toString('base64');
    req.headers['authorization'] = `Basic ${creds}`;
  };

  test('should fail if Authorization header is missing', async () => {
    await basicAuth(req, res, next);
    expect(sendError).toHaveBeenCalledWith(res, expect.stringContaining('Missing'), 'Unauthorized', 401);
  });

  test('should fail if Authorization header is not Basic', async () => {
    req.headers['authorization'] = 'Bearer token';
    await basicAuth(req, res, next);
    expect(sendError).toHaveBeenCalledWith(res, expect.stringContaining('Missing'), 'Unauthorized', 401);
  });

  describe('Database Path (isDbConnected = true)', () => {
    beforeEach(() => {
      isDbConnected.mockReturnValue(true);
    });

    test('should succeed with valid DB credentials', async () => {
      setAuthHeader('dbUser', 'dbPass');
      
      const mockDbUser = { 
        _id: 'db-id', 
        password: 'hashed', 
        toObject: () => ({ _id: 'db-id', username: 'dbUser' }) 
      };
      
      // Ελέγχουμε το mock μέσω του import
      User.findOne.mockResolvedValue(mockDbUser);
      bcrypt.compare.mockResolvedValue(true);

      await basicAuth(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'dbUser' });
      expect(bcrypt.compare).toHaveBeenCalledWith('dbPass', 'hashed');
      expect(req.user).toBeDefined();
      expect(req.user.id).toBe('db-id');
      expect(next).toHaveBeenCalled();
    });

    test('should fail with invalid DB password', async () => {
      setAuthHeader('dbUser', 'wrongPass');
      
      User.findOne.mockResolvedValue({ _id: 'id', password: 'hashed' });
      bcrypt.compare.mockResolvedValue(false);

      await basicAuth(req, res, next);

      expect(sendError).toHaveBeenCalledWith(res, 'Invalid credentials', 'Unauthorized', 401);
      expect(next).not.toHaveBeenCalled();
    });

    test('should fail if user not found in DB', async () => {
      setAuthHeader('ghost', 'pass');
      User.findOne.mockResolvedValue(null);

      await basicAuth(req, res, next);

      expect(sendError).toHaveBeenCalledWith(res, 'Invalid credentials', 'Unauthorized', 401);
    });
  });

  describe('Memory Path (isDbConnected = false)', () => {
    beforeEach(() => {
      isDbConnected.mockReturnValue(false);
    });

    test('should succeed with valid Memory credentials', async () => {
      setAuthHeader('memUser', 'memPassword');

      await basicAuth(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.username).toBe('memUser');
      expect(next).toHaveBeenCalled();
    });

    test('should fail with invalid Memory credentials', async () => {
      setAuthHeader('memUser', 'wrong');

      await basicAuth(req, res, next);

      expect(sendError).toHaveBeenCalledWith(res, 'Invalid credentials', 'Unauthorized', 401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  test('should handle exceptions', async () => {
    // Mocking Buffer to throw error
    jest.spyOn(Buffer, 'from').mockImplementationOnce(() => { throw new Error('Boom'); });

    req.headers['authorization'] = 'Basic invalid';
    await basicAuth(req, res, next);

    expect(sendError).toHaveBeenCalledWith(res, 'Boom', 'Unauthorized', 401);
  });
});