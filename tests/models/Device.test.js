import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Device } from '../../models/Device.js';

jest.setTimeout(30000); // 30 δευτερόλεπτα timeout

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Device Model', () => {
  it('should create a device successfully', async () => {
    const validDevice = {
      name: 'Smart Bulb',
      roomId: 'room_1',
      type: 'actuator',
      category: 'lighting',
      status: 'online'
    };
    const device = new Device(validDevice);
    const saved = await device.save();
    
    expect(saved._id).toBeDefined();
    expect(saved.name).toBe('Smart Bulb');
  });

  it('should fail if required fields are missing', async () => {
    const device = new Device({}); // Κενό αντικείμενο
    let err;
    try {
      await device.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.name).toBeDefined();
    expect(err.errors.roomId).toBeDefined();
  });
});