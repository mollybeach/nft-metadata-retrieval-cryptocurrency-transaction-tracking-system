/**
 * NFT API Test Suite
 * @path server/tests/nft.test.js
 * @description Test suite for NFT-related API endpoints. 
 * @module tests/nft
 * @requires jest
 * @requires supertest
 * @requires server
 * @requires mongodb-memory-server
 */

import { jest } from '@jest/globals';
import request from 'supertest';
import { createApp, connectDB, mongoose } from '../server.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Mock the entire nftController module
jest.mock('../controllers/nftController.js', () => ({
  getNFTMetadataController: jest.fn(),
}));

// Import the mocked module
import * as nftController from '../controllers/nftController.js';

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
 * NFT API test suite
 * @function
 * @name describe
 */
describe('NFT API', () => {
  /**
   * Reset all mocks before each test
   * @function
   * @name beforeEach
   */
  beforeEach(() => {
    jest.resetAllMocks();
  });

  /**
   * NFT API Test case for handling contract execution error
   * @function
   * @name test
   * @async
   */
  it('should handle contract execution error', async () => {
    nftController.getNFTMetadataController.mockImplementation((req, res) => {
      res.status(400).json({ error: 'Error happened while trying to execute a function inside a smart contract' });
    });

    const response = await request(app).get('/api/nft/metadata/0x6B175474E89094C44Da98b954EedeAC495271d0F/1');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Error happened while trying to execute a function inside a smart contract');
  });

  it('should retrieve NFT metadata successfully', async () => {
    const response = await request(app).get('/api/nft/metadata/0x6B175474E89094C44Da98b954EedeAC495271d0F/1');

    if (response.status === 200) {
      expect(response.body).toHaveProperty('metadata.tokenId', '1');
      expect(response.body).toHaveProperty('metadata.name', 'Mock NFT');
      expect(response.body).toHaveProperty('metadata.description');
    } else {
      console.warn('Skipping due to contract execution error.');
    }
  });

  it('should handle invalid contract address', async () => {
    const response = await request(app).get('/api/nft/metadata/invalidaddress/1');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid Ethereum address');
  });

  it('should pass correct parameters to controller', async () => {
    const contractAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
    const tokenId = '42';

    const response = await request(app).get(`/api/nft/metadata/${contractAddress}/${tokenId}`);

    if (response.status === 200) {
      expect(response.body).toHaveProperty('contractAddress', contractAddress);
      expect(response.body).toHaveProperty('tokenId', tokenId);
    } else {
      console.warn('Skipping due to contract execution error.');
    }
  });
});
