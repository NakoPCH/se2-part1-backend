import { jest } from '@jest/globals';

// 1. Mocking Mongoose Model (Room)
// Προσέχουμε να βάλουμε το mockLean για να μην σκάσει το .lean()
jest.mock('../../models/Room.js', () => ({
  Room: {
    create: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

// 2. Mocking Helpers
jest.mock('../../utils/helpers.js', () => ({
  generateId: () => 'mock-room-id',
  isDbConnected: jest.fn(),
}));

// 3. Imports
import { Room } from '../../models/Room.js';
import { isDbConnected } from '../../utils/helpers.js';
import { rooms } from '../../data.js';
import * as roomService from '../../services/roomService.js';

describe('Room Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    rooms.length = 0; // Καθαρισμός in-memory array
  });

  describe('createRoom', () => {
    test('should create room in DB when connected', async () => {
      isDbConnected.mockReturnValue(true);
      
      const mockRoomDoc = { toObject: () => ({ id: 'db-r1', name: 'Kitchen' }) };
      Room.create.mockResolvedValue(mockRoomDoc);

      const result = await roomService.createRoom({ name: 'Kitchen', houseId: 'h1' });

      expect(Room.create).toHaveBeenCalled();
      expect(result.name).toBe('Kitchen');
    });

    test('should create room in Memory when DB disconnected', async () => {
      isDbConnected.mockReturnValue(false);

      const result = await roomService.createRoom({ name: 'Bedroom', houseId: 'h1' });

      expect(rooms).toHaveLength(1);
      expect(rooms[0].name).toBe('Bedroom');
      expect(result.id).toBe('mock-room-id');
    });
  });

  describe('deleteRoom', () => {
    test('should delete from DB when connected', async () => {
      isDbConnected.mockReturnValue(true);

      // Mocking the .lean() chain
      const mockLean = jest.fn().mockResolvedValue({ _id: 'r1' });
      Room.findByIdAndDelete.mockReturnValue({ lean: mockLean });

      const result = await roomService.deleteRoom('r1');

      expect(result).toBe(true);
      expect(Room.findByIdAndDelete).toHaveBeenCalledWith('r1');
      expect(mockLean).toHaveBeenCalled();
    });

    test('should return false if room not found in DB', async () => {
      isDbConnected.mockReturnValue(true);

      const mockLean = jest.fn().mockResolvedValue(null);
      Room.findByIdAndDelete.mockReturnValue({ lean: mockLean });

      const result = await roomService.deleteRoom('ghost-room');

      expect(result).toBe(false);
    });

    test('should delete from Memory when DB disconnected', async () => {
      isDbConnected.mockReturnValue(false);
      rooms.push({ id: 'r-del', name: 'Delete Me' });

      const result = await roomService.deleteRoom('r-del');

      expect(result).toBe(true);
      expect(rooms).toHaveLength(0);
    });

    test('should return false if room not found in Memory', async () => {
      isDbConnected.mockReturnValue(false);

      const result = await roomService.deleteRoom('non-existent');

      expect(result).toBe(false);
    });
  });
});