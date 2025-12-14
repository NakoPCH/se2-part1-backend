import { jest } from '@jest/globals';

// 1. Ορίζουμε τα mocks απευθείας μέσα στο factory function.
// Έτσι αποφεύγουμε το ReferenceError γιατί δεν εξαρτόμαστε από εξωτερικές μεταβλητές.
jest.mock('../../models/House.js', () => ({
  House: {
    create: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

jest.mock('../../utils/helpers.js', () => ({
  generateId: () => 'mock-id-123',
  isDbConnected: jest.fn(),
}));

// 2. Κάνουμε import τα mocked modules για να τα ελέγχουμε μέσα στα test cases
import { House } from '../../models/House.js';
import { isDbConnected } from '../../utils/helpers.js';
import { houses } from '../../data.js';
import * as houseService from '../../services/houseService.js';

describe('House Service', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    houses.length = 0; // Καθαρισμός της in-memory λίστας
  });

  describe('createHouse', () => {
    test('should create a house in DB when connected', async () => {
      // Setup
      isDbConnected.mockReturnValue(true);
      
      const mockHouseDoc = { 
        toObject: () => ({ id: 'db-id', name: 'DB House' }) 
      };
      // Ελέγχουμε το mock μέσω του import
      House.create.mockResolvedValue(mockHouseDoc);

      // Execute
      const result = await houseService.createHouse({ 
        name: 'DB House', address: '123 St', ownerId: 'u1' 
      });

      // Assert
      expect(House.create).toHaveBeenCalled();
      expect(result.name).toBe('DB House');
    });

    test('should create a house in Memory when DB disconnected', async () => {
      isDbConnected.mockReturnValue(false);

      const result = await houseService.createHouse({ 
        name: 'Local House', address: '456 Rd', ownerId: 'u1' 
      });

      expect(houses).toHaveLength(1);
      expect(houses[0].name).toBe('Local House');
      expect(result.id).toBe('mock-id-123');
    });
  });

  describe('deleteHouse', () => {
    test('should delete from DB when connected', async () => {
      isDbConnected.mockReturnValue(true);
      
      // ΛΥΣΗ ΓΙΑ ΤΟ .lean():
      // Φτιάχνουμε ένα mock function για το lean
      const mockLean = jest.fn().mockResolvedValue({ _id: '123' }); // Βρέθηκε και διαγράφηκε
      // Ρυθμίζουμε το findByIdAndDelete να επιστρέφει ένα αντικείμενο που έχει μέσα το lean
      House.findByIdAndDelete.mockReturnValue({ lean: mockLean });

      const result = await houseService.deleteHouse('123');
      
      expect(result).toBe(true);
      expect(House.findByIdAndDelete).toHaveBeenCalledWith('123');
      expect(mockLean).toHaveBeenCalled();
    });

    test('should return false if house not found (DB connected)', async () => {
      isDbConnected.mockReturnValue(true);
      
      // Περίπτωση που δεν βρέθηκε: το lean επιστρέφει null
      const mockLean = jest.fn().mockResolvedValue(null);
      House.findByIdAndDelete.mockReturnValue({ lean: mockLean });

      const result = await houseService.deleteHouse('ghost-house');
      expect(result).toBe(false);
    });

    test('should delete from Memory when DB disconnected', async () => {
      isDbConnected.mockReturnValue(false);
      houses.push({ id: 'h-to-delete', name: 'To Delete' });

      const result = await houseService.deleteHouse('h-to-delete');
      expect(result).toBe(true);
      expect(houses).toHaveLength(0);
    });
    
    test('should return false if house not found (Memory)', async () => {
        isDbConnected.mockReturnValue(false);
        const result = await houseService.deleteHouse('non-existent');
        expect(result).toBe(false);
    });
  });
});