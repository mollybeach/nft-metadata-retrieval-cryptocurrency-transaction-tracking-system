**Time Limit: 40 minutes**

**Task:** Implement a basic trading functionality using a pre-configured backend and frontend, integrating with a test blockchain network.

**Environment:**

- **Backend:** Node.js, Express, MongoDB. Pre-configured with basic API endpoints and database setup.
- **Frontend:** React. Pre-configured with basic components for UI elements.
- **Blockchain Network:** Ethereum testnet. You will have access to the test network and its API.
- **Libraries:** You will be provided with necessary libraries for blockchain interactions.

**Tasks:**

**1. Backend (Node.js, Express, MongoDB)**

- **1.1 Place Order Endpoint:**

  - Implement the `/api/trade` API endpoint to handle order placement.
  - This endpoint should:
    - Receive order parameters (currency pair, amount, price, order type - market or limit).
    - Validate the order parameters (e.g., ensure amount is positive, price is valid).
    - Generate a signed transaction using a provided private key (provided in the test environment).
    - Broadcast the transaction to the Ethereum testnet.
    - Return the transaction hash to the frontend.

- **1.2 Database Interaction:**

  - Update the database schema to include a `trades` collection for storing order information.
  - Each order should have:
    - User ID
    - Timestamp
    - Currency Pair
    - Amount
    - Price
    - Order Type
    - Transaction Hash
    - Status (pending, confirmed, failed)

- **1.3 Error Handling:**
  - Handle potential errors during blockchain interactions (e.g., insufficient funds, invalid signature).
  - Return appropriate error messages and status codes to the frontend.

**2. Frontend (React)**

- **2.1 Trading Panel:**
  - Create a form for users to place orders. The form should include:
    - Currency pair selection (ETH/USDT).
    - Amount input field.
    - Price input field (for limit orders).
    - Order type selection (market or limit).
    - "Place Order" button.
- **2.2 Transaction Confirmation:**
  - After placing an order, display the transaction hash to the user.
  - Implement functionality to periodically check the transaction status on the Ethereum testnet using the transaction hash.
  - Update the UI to display the order status (pending, confirmed, failed).
  - Display a success message when the order is confirmed.

**Submission:**

- Submit the completed project code (frontend and backend).
- Include detailed comments explaining your code and design choices.
- Provide a simple README file describing how to run the application.

**Evaluation:**

- **Functionality:** The code should work correctly according to the specified requirements.
- **Code Quality:** The code should be well-organized, readable, and follow best practices.
- **Error Handling:** The code should handle potential errors gracefully and inform the user appropriately.
- **Efficiency:** The code should be efficient and perform reasonably well.

**Note:**

- This test focuses on basic blockchain integration and trading functionality.
- You are not expected to implement advanced features like order cancellation or real-time price updates.
- Prioritize functionality and code clarity over complex features.
- You are provided with a basic code structure. Focus on completing the missing parts and integrating with the blockchain network.
- Be sure to test your code thoroughly before submission.

Good luck!
