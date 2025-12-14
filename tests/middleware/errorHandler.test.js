import { jest } from '@jest/globals';

// 1. Mock responses util - Ορίζουμε το mock μέσα στο factory function
jest.mock('../../utils/responses.js', () => ({
  sendError: jest.fn(),
}));

// 2. Imports
import { sendError } from '../../utils/responses.js'; // Import το mock
import { errorHandler } from '../../middleware/errorHandler.js';

describe('Error Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {};
    res = {};
    next = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should handle error with specific status and message', () => {
    const error = new Error('System Fail');
    error.statusCode = 404;
    error.userMessage = 'Resource not found';

    errorHandler(error, req, res, next);

    // Ελέγχουμε το imported mock
    expect(sendError).toHaveBeenCalledWith(res, error, 'Resource not found', 404);
  });

  test('should default to 500 and "Internal server error" for generic errors', () => {
    const error = new Error('Crash');

    errorHandler(error, req, res, next);

    expect(sendError).toHaveBeenCalledWith(res, error, 'Internal server error', 500);
  });
});