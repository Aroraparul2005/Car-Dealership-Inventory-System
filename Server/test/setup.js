import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { beforeAll, afterAll, afterEach } from '@jest/globals';

dotenv.config({ path: '.env.test' });

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST);
});

afterEach(async () => {
  // Clean all collections after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});