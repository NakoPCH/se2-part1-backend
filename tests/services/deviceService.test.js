// tests/services/deviceService.test.js
import { jest } from '@jest/globals';
import { connect, closeDatabase, clearDatabase } from '../dbHandler.js';

jest.setTimeout(30000); // 30 δευτερόλεπτα timeout

// 1. Mock του helpers για να αναγκάσουμε το service να δει "Database Connected"
jest.unstable_mockModule('../../utils/helpers.js', () => ({
  isDbConnected: jest.fn().mockReturnValue(true),
  generateId: jest.fn()
}));

// 2. Mock του data.js (κενό array για να μην χτυπάει το import)
jest.unstable_mockModule('../../data.js', () => ({
  devices: []
}));

describe('Device Service (DB Mode)', () => {
  let deviceService;
  let Device;

  beforeAll(async () => {
    await connect();
    // Dynamic import του service και του μοντέλου
    deviceService = await import('../../services/deviceService.js');
    const deviceModel = await import('../../models/Device.js');
    Device = deviceModel.Device;
  });

  afterEach(async () => await clearDatabase());
  afterAll(async () => await closeDatabase());

  // --- Create ---
  test('createDevice should save a new device to the database', async () => {
    const payload = { name: 'Smart Bulb', roomId: 'room1', type: 'light', category: 'lamps' };
    
    const result = await deviceService.createDevice(payload);

    expect(result).toBeDefined();
    expect(result._id).toBeDefined();
    expect(result.name).toBe('Smart Bulb');
    
    // Επιβεβαίωση ότι όντως σώθηκε στη βάση
    const inDb = await Device.findById(result._id);
    expect(inDb).not.toBeNull();
  });

  // --- Delete ---
  test('deleteDevice should remove a device', async () => {
    // Φτιάχνουμε μια συσκευή
    const created = await deviceService.createDevice({ name: 'To Delete', roomId: 'r1', type: 'sensor' });
    
    // Τη διαγράφουμε
    const result = await deviceService.deleteDevice(created._id);
    expect(result).toBe(true);

    // Ελέγχουμε ότι δεν υπάρχει πια
    const inDb = await Device.findById(created._id);
    expect(inDb).toBeNull();
  });

  test('deleteDevice should return false if device not found', async () => {
    // Δοκιμάζουμε να σβήσουμε ανύπαρκτο ID (τυχαίο Mongo ID)
    const result = await deviceService.deleteDevice('507f1f77bcf86cd799439011'); 
    // Προσοχή: Το findByIdAndDelete επιστρέφει null αν δεν βρει κάτι,
    // και το service σου επιστρέφει !!result, άρα false.
    expect(result).toBe(false);
  });

  // --- Update ---
  test('updateDevice should update device details', async () => {
    const created = await deviceService.createDevice({ name: 'Old Name', roomId: 'r1', type: 'sensor' });

    const updated = await deviceService.updateDevice(created._id, { name: 'New Name' });
    
    expect(updated.name).toBe('New Name');
    
    // Verify in DB
    const inDb = await Device.findById(created._id);
    expect(inDb.name).toBe('New Name');
  });

  // --- Status & Actions ---
  test('performDeviceAction should update the device state', async () => {
    const created = await deviceService.createDevice({ name: 'Lamp', roomId: 'r1', type: 'light' });

    // Αρχικά state είναι κενό
    const state1 = await deviceService.performDeviceAction(created._id, { on: true, brightness: 50 });
    expect(state1.on).toBe(true);
    expect(state1.brightness).toBe(50);

    // Ξανακάνουμε update (merge state)
    const state2 = await deviceService.performDeviceAction(created._id, { brightness: 100 });
    expect(state2.on).toBe(true); // Πρέπει να διατηρηθεί
    expect(state2.brightness).toBe(100); // Πρέπει να αλλάξει
  });

  test('updateSecurityState should call performDeviceAction logic', async () => {
    const created = await deviceService.createDevice({ name: 'Camera', roomId: 'r1', type: 'camera' });

    const state = await deviceService.updateSecurityState(created._id, { armed: true });
    expect(state.armed).toBe(true);
  });

  test('getDeviceStatus should return current state', async () => {
    const created = await deviceService.createDevice({ name: 'Fan', roomId: 'r1', type: 'fan' });
    // Βάζουμε ένα αρχικό state
    await deviceService.performDeviceAction(created._id, { speed: 'high' });

    const status = await deviceService.getDeviceStatus(created._id);
    expect(status.speed).toBe('high');
  });
});