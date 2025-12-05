// __tests__/dbHandler.js

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo;

export const connect = async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};

export const closeDatabase = async () => {
  if (mongo) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  }
};

export const clearDatabase = async () => {
  if (mongoose.connection.collections) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany(); 
    }
  }
};