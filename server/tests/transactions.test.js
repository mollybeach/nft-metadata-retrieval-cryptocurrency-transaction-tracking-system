/**
 * Transactions API Test Suite
 * @path server/tests/transactions.test.js
 * @module tests/transactions
 * @requires supertest
 * @requires server
 * @requires mongodb-memory-server
 */

import request from 'supertest';
import { createApp, connectDB, mongoose } from '../server.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;
let app;

/**
 * Set up the test environment before all tests
 * @function
 * @name beforeAll
 * @async
 */
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await connectDB(mongoUri);
  app = createApp();
});

/**
 * Clean up the test environment after all tests
 * @function
 * @name afterAll
 * @async
 */
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

/**
 * Transactions API test suite
 * @function
 * @name describe
 */
describe('Transactions API', () => {
  /**
   * Test case for retrieving all transactions
   * @function
   * @name test
   * @async
   */
  it('GET /api/transactions should retrieve all transactions', async () => {
    const response = await request(app).get('/api/transactions');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'tx1' }),
        expect.objectContaining({ id: 'tx2' })
      ])
    );
  });

  /**
   * Test case for creating a new transaction
   * @function
   * @name test
   * @async
   */
  it('POST /api/transactions should create a new transaction', async () => {
    const newTransaction = {
      from: '0x123',
      to: '0x456',
      value: '1.5 ETH',
      hash: '0xabc'
    };

    const response = await request(app)
      .post('/api/transactions')
      .send(newTransaction);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toMatchObject(newTransaction);
  });

  // ... Add JSDoc comments for other test cases ...
});
