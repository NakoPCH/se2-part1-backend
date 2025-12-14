// tests/models/User.test.js
import { connect, closeDatabase, clearDatabase } from '../dbHandler.js';
import { User } from '../../models/User.js';

jest.setTimeout(30000); // 30 δευτερόλεπτα timeout

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe('User Model Test', () => {

  it('should create and save a user successfully', async () => {
    const userData = {
      username: 'testuser',
      password: 'password123',
      email: 'test@example.com'
    };
    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.email).toBe(userData.email);
  });

  it('should fail if required fields are missing', async () => {
    const user = new User({ username: 'NoPasswordUser' }); // Λείπει password & email
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.password).toBeDefined();
    expect(err.errors.email).toBeDefined();
  });

  it('should fail if username is not unique', async () => {
    const userData = { username: 'uniqueUser', password: 'pw', email: 'a@a.com' };
    
    // Αποθηκεύουμε τον πρώτο
    await new User(userData).save();

    // Προσπαθούμε να αποθηκεύσουμε τον δεύτερο με ίδιο username
    let err;
    try {
      await new User(userData).save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    // Το error code 11000 είναι το duplicate key error της Mongo
    // Ή ελέγχουμε αν υπάρχει το username στο error message
  });
});