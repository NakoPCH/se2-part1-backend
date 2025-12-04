// __tests__/utils.helpers.test.js
import { isDbConnected, generateId } from '../utils/helpers.js';
import mongoose from 'mongoose';

// 1. Mocking: Προσομοίωση του Mongoose για να ελέγξουμε το readyState
// χωρίς να κάνουμε πραγματική σύνδεση στη βάση.
jest.mock('mongoose', () => ({
  connection: {
    // Ορίζουμε μια default τιμή, την οποία αλλάζουμε στα tests
    readyState: 0, 
  },
}));

describe('Helpers Module Unit Tests', () => {

  // --- Tests για isDbConnected ---
  describe('isDbConnected', () => {
    test('should return true when mongoose readyState is 1 (connected)', () => {
      // Arrange: Ορίζουμε την επιτυχή σύνδεση
      mongoose.connection.readyState = 1;
      expect(isDbConnected()).toBe(true);
    });

    test('should return false when mongoose readyState is 0 (disconnected)', () => {
      // Arrange: Ορίζουμε την αποσύνδεση
      mongoose.connection.readyState = 0;
      expect(isDbConnected()).toBe(false);
    });
    
    test('should return false when mongoose readyState is 2 (connecting)', () => {
      // Arrange: Ορίζουμε την κατάσταση σύνδεσης (πρέπει να επιστρέψει false)
      mongoose.connection.readyState = 2;
      expect(isDbConnected()).toBe(false);
    });
  });

  // --- Tests για generateId ---
  describe('generateId', () => {
    
    // 1. Κανονική ροή
    test('should find max ID and increment by 1 (dev3 -> dev4)', () => {
      const collection = [
        { id: 'dev0' },
        { id: 'dev1' },
        { id: 'dev3' },
      ];
      expect(generateId('dev', collection)).toBe('dev4');
    });

    // 2. Άδεια Συλλογή
    test('should start from 1 when the collection is empty', () => {
      const collection = [];
      expect(generateId('device', collection)).toBe('device1');
    });

    // 3. Μη έγκυρα IDs και null/undefined (Καλύπτει πολλά branches/continues)
    test('should ignore non-numeric, null, or undefined IDs and find max numeric', () => {
      const collection = [
        { id: 'dev5' },
        { id: 'dev-invalid' }, // parseInt = NaN (αγνοείται)
        { id: 'dev2' },
        { id: null },          // Αγνοείται (!item.id)
        { name: 'X' },         // Αγνοείται (!item.id)
        { id: 'dev_A' },       // parseInt = NaN (αγνοείται)
      ];
      // Max ID είναι το 5, οπότε περιμένουμε 6
      expect(generateId('dev', collection)).toBe('dev6'); 
    });
    
    // 4. Case: Όταν ο αριθμός είναι 0 (πρέπει να επιστρέψει 1)
    test('should return prefix1 when max ID is 0', () => {
      const collection = [{ id: 'device0' }];
      expect(generateId('device', collection)).toBe('device1');
    });
  });
});
