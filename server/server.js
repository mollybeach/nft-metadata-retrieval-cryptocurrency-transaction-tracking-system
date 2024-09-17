/**
 * Server
 * @path server/server.js
 * @description Main server file for the application.
 * @module server
 */

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import userRoutes from './routes/userRoute.js';
import transactionRoutes from './routes/transactionsRoute.js';
import nftRoutes from './routes/nftRoute.js';

// Load environment variables
dotenv.config();

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const createApp = () => {
  const app = express();

  // CORS configuration
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://your-production-domain.com' 
      : 'http://localhost:3000'
  }));

  // Middleware
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '../public')));

  // Routes
  app.use('/api/users', userRoutes);
  app.use('/api/transactions', transactionRoutes);
  app.use('/api/nft', nftRoutes);

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  // Unmatched routes for debugging
  app.use('*', (req, res) => {
    console.log(`Unmatched route: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: 'Not Found' });
  });

  return app;
};

// Connect to MongoDB
const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri || process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Only connect and create app if not in test environment
let server;
if (process.env.NODE_ENV !== 'test') {
  connectDB();
  const app = createApp();
  const PORT = process.env.PORT || 5000;
  server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for testing and app creation
export { mongoose, server, createApp, connectDB };
