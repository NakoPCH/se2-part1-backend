// tests/services/userService.test.js
import { jest } from '@jest/globals';
import { connect, closeDatabase, clearDatabase } from '../dbHandler.js';

// 1. Mock του helpers για να πούμε ότι "Ναι, έχουμε βάση"
jest.unstable_mockModule('../../utils/helpers.js', () => ({
  isDbConnected: jest.fn().mockReturnValue(true), // Επιστρέφει πάντα true
  generateId: jest.fn()
}));

// 2. Mock του data.js (για να μην σκάει στα imports)
jest.unstable_mockModule('../../data.js', () => ({
  users: [],
  houses: [],
  rooms: [],
  devices: [],
  automations: [],
  scenarios: [],
  widgets: [],
  notifications: []
}));

describe('User Service (DB Mode)', () => {
  let userService;
  let User; // Το Mongoose Model

  beforeAll(async () => {
    await connect();
    // Import το service και το Model
    userService = await import('../../services/userService.js');
    const userModelModule = await import('../../models/User.js');
    User = userModelModule.User;
  });

  afterEach(async () => await clearDatabase());
  afterAll(async () => await closeDatabase());

  describe('createUser', () => {
    test('should create a new user in the database', async () => {
      const payload = { username: 'john', password: 'secretpassword', email: 'john@test.com' };
      
      const newUser = await userService.createUser(payload);

      expect(newUser).toBeDefined();
      expect(newUser.username).toBe('john');
      expect(newUser.email).toBe('john@test.com');
      // Ο κωδικός δεν πρέπει να είναι plain text
      expect(newUser.password).not.toBe('secretpassword'); 
    });

    test('should throw error if username already exists', async () => {
      const payload = { username: 'john', password: '123', email: 'a@a.com' };
      await userService.createUser(payload); // Πρώτη φορά

      // Δεύτερη φορά -> Πρέπει να σκάσει
      await expect(userService.createUser(payload)).rejects.toThrow("Username already exists");
    });
  });

  describe('authenticateUser', () => {
    test('should return user if credentials match', async () => {
      // Δημιουργία χρήστη
      await userService.createUser({ username: 'jane', password: '123', email: 'j@j.com' });

      // Προσπάθεια Login
      const user = await userService.authenticateUser('jane', '123');
      expect(user).not.toBeNull();
      expect(user.username).toBe('jane');
    });

    test('should return null if password is wrong', async () => {
      await userService.createUser({ username: 'jane', password: '123', email: 'j@j.com' });

      const user = await userService.authenticateUser('jane', 'wrongpass');
      expect(user).toBeNull();
    });

    test('should return null if user does not exist', async () => {
      const user = await userService.authenticateUser('ghost', '123');
      expect(user).toBeNull();
    });
  });

  describe('getUserById', () => {
    test('should return user by ID', async () => {
      const created = await userService.createUser({ username: 'bob', password: '123', email: 'b@b.com' });
      
      // Χρησιμοποιούμε το _id που έδωσε η Mongo
      const found = await userService.getUserById(created._id);
      expect(found).toBeDefined();
      expect(found.username).toBe('bob');
    });
  });
});