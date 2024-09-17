# NFT Metadata Retrieval and Cryptocurrency Transaction Tracking

## 1. Abstract
This RFC proposes the implementation of two key features for a blockchain-based application:

1. NFT Metadata Retrieval and Storage
2. Simple Cryptocurrency Transaction Tracking

These features will allow users to fetch and store NFT metadata from the blockchain and track cryptocurrency transactions for specified addresses.

## 2. Background
The increasing popularity of NFTs and cryptocurrency transactions necessitates efficient systems for metadata retrieval and transaction tracking. This implementation aims to provide a robust backend solution using Express.js and MongoDB, integrating with blockchain technologies via Web3.js and external APIs like Etherscan.

## 3. Goals
- Implement an API endpoint for NFT metadata retrieval and storage.
- Create an API endpoint for tracking and storing cryptocurrency transactions.
- Ensure efficient data storage and retrieval using MongoDB.
- Implement proper error handling and logging.
- Provide comprehensive test coverage.

## 4. Non-Goals
- Frontend implementation.
- Support for multiple blockchain networks (focus is on Ethereum).
- Real-time updates of NFT metadata or transaction data.

## 5. Architecture Overview
The application follows a typical Express.js backend architecture:

+-------------------+
| Express.js |
| Server |
+-------------------+
|
v
+-------------------+
| Controllers |
| (NFT & Transaction)|
+-------------------+
|
v
+-------------------+
| Models |
| (MongoDB Schema) |
+-------------------+
|
v
+-------------------+
| Database |
| (MongoDB) |
+-------------------+


- Express.js Server: Handles HTTP requests and routes them to appropriate controllers.
- Controllers: Handle the logic for fetching and storing NFT metadata and cryptocurrency transactions.
- Services: Interface with blockchain (via Web3.js) and external APIs (like Etherscan).
- Models: Define the data structure for NFT metadata and transactions.
- Database: MongoDB for persistent storage of NFT metadata and transaction history.

External Integrations:
- Ethereum Blockchain (via Web3.js)
- Etherscan API for transaction data

This architecture ensures a clear separation of concerns, making the system modular and easier to maintain and scale.

## 6. Detailed Design

### 6.1 NFT Metadata Retrieval and Storage

#### API Endpoint
- `GET /api/nft/metadata/:contractAddress/:tokenId`

#### Implementation Details
1. Check if metadata exists in MongoDB
2. If not found, use Web3.js to interact with the NFT contract
3. Fetch metadata from the blockchain
4. Store the metadata in MongoDB
5. Return the metadata to the user

#### Data Model (nftMetadata.js)

```
{
contractAddress: String,
tokenId: String,
name: String,
description: String,
imageUrl: String
}
```

### 6.2 Cryptocurrency Transaction Tracking

#### API Endpoints
- `POST /api/transactions/track`
- `GET /api/transactions`

#### Implementation Details
1. Receive a cryptocurrency address
2. Fetch the last 5 transactions from Etherscan API
3. Store transactions in MongoDB
4. Implement querying functionality by address and date range

#### Data Model (transaction.js)

```
{
  address: String,
  transactionHash: String,
  blockNumber: Number,
  timestamp: Date,
  from: String,
  to: String,
  value: Number,
  gasUsed: Number,
  gasPrice: Number
}
```

## 7. Security Considerations

- Use environment variables for sensitive data (API keys, database URIs)
- Implement input validation for all API endpoints
- Use HTTPS for all external API calls
- Implement rate limiting to prevent abuse

## 8. Testing Strategy

- Unit tests for individual components (controllers, models)
- Integration tests for API endpoints
- Mock external services (Web3, Etherscan API) in tests
- Test both success and error scenarios

## 9. Deployment and Scalability

- Deploy on a Node.js-compatible hosting platform
- Use a production-grade MongoDB instance
- Implement caching mechanisms for frequently accessed data
- Consider implementing a queue system for handling blockchain interactions

## 10. Monitoring and Logging

- Implement request logging middleware
- Use a logging library (e.g., Winston) for application-level logging
- Set up monitoring for API endpoint performance and error rates

## 11. Future Considerations

- Support for multiple blockchain networks
- Implement WebSocket for real-time updates
- Enhance caching mechanisms for improved performance
- Implement pagination for transaction history retrieval


This RFC provides a comprehensive overview of the project, including its architecture, implementation details, and considerations for future enhancements. It serves as a guide for understanding the current state of the project and potential areas for improvement or expansion.


# CryptoView

## Crypto Trading Platform

This is a simple MERN stack application that displays current prices of cryptocurrencies and allows users to trade them.

**Features:**

- **Real-time Cryptocurrency Prices:** Retrieves and displays the latest prices from a trusted cryptocurrency API.
- **Trading Functionality:** Allows users to buy and sell cryptocurrencies.
- **Secure Authentication:** Uses JWT authentication to protect user accounts.
- **User Dashboard:** Displays trading history, portfolio, and other relevant information.

**Getting Started:**

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/labs-web3/CryptoView.git
   ```

2. **Install Dependencies:**

   ```bash
   cd CryptoView
   npm install
   ```

3. **Set up Environment Variables:**

   - Create a `.env` file at the root of the project.
   - Add the following environment variables:
     ```
     SECRET=cryptoviewsecret
     MONG_URI=mongodb+srv://salceanu:f34mqJgy29B61Mm7@labsdatabase.5913czx.mongodb.net/?retryWrites=true&w=majority&appName=labsdatabase
     PORT=5000
     VITE_X_CG_DEMO_API_KEY=CG-1t8kdBZJMA1YUmpjF5nypF6R
     ```

4. **Start the Server:**

   ```bash
   npm start
   ```

5. **Access the Application:**
   Open your browser and navigate to `http://localhost:5173`.

**Project Structure:**

```
crypto-trading-platform/
├── src/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── App.js
│   └── index.js
├── public/
└── server/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── server.js
```

**Technologies Used:**

- **Frontend:** React, Redux, Axios, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, JWT
- **API:** [Cryptocurrency API](https://example.com/api)

**Contributing:**

Contributions are welcome! Please create a pull request with your changes.

**License:**

This project is licensed under the MIT License.
