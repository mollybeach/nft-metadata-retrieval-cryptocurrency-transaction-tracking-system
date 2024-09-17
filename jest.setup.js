import { jest } from '@jest/globals';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

jest.mock('web3', () => ({
  Web3: jest.fn().mockImplementation(() => ({
    eth: {
      Contract: jest.fn().mockReturnValue({
        methods: {
          tokenURI: jest.fn().mockReturnValue({
            call: jest.fn().mockResolvedValue('https://example.com/token/1'),
          }),
        },
      }),
    },
  })),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ name: 'Test NFT', description: 'A test NFT', image: 'https://example.com/image.png' }),
  })
);

// Add any other global mocks or setup here

jest.mock('./server/middleware/requireAuth.js', () => ({
  requireAuth: jest.fn((req, res, next) => next()),
}));