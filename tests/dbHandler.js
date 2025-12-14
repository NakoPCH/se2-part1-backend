import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod;

/**
 * Connect to the in-memory database.
 */
export const connect = async () => {
  // Αυξάνουμε το timeout για τη σύνδεση
  if (mongod) return; // Αν υπάρχει ήδη σύνδεση, μην ξαναπροσπαθείς
  
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  // Χρησιμοποιούμε το mongoose.connect χωρίς deprecated options
  await mongoose.connect(uri);
};

/**
 * Drop database, close the connection and stop mongod.
 */
export const closeDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongod) {
    await mongod.stop();
  }
};

/**
 * Remove all the data for all db collections.
 */
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    // ΔΙΟΡΘΩΣΗ: Προσθέσαμε το {} μέσα στο deleteMany
    await collection.deleteMany({});
  }
};