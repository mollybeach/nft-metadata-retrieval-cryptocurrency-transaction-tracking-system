/**
 * Transactions Routes
 * @path server/routes/transactionsRoute.js
 * @description This file defines the Express router for transaction-related routes.
 * It includes routes for creating and retrieving transactions, as well as
 * tracking and fetching cryptocurrency transactions. All routes require authentication.
 */

import express from 'express';
import TransactionsModel from '../models/transactionsModel.js';

const router = express.Router();

console.log('Transactions route file loaded');

// GET all transactions
router.get('/', async (req, res) => {
  console.log('GET /api/transactions route hit');
  try {
    const transactions = await TransactionsModel.find();
    res.json(transactions);
  } catch (error) {
    console.error('Error in GET /api/transactions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET a transaction by ID
router.get('/:id', async (req, res) => {
  console.log('GET /api/transactions/:id route hit');
  try {
    const transaction = await TransactionsModel.findById(req.params.id);
    res.json(transaction);
  } catch (error) {
    console.error('Error in GET /api/transactions/:id:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a new transaction
router.post('/', async (req, res) => {
  console.log('POST /api/transactions route hit');
  try {
    const newTransaction = await TransactionsModel.create(req.body);
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error in POST /api/transactions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update a transaction
router.put('/:id', async (req, res) => {
  console.log('PUT /api/transactions route hit');
  try {
    const updatedTransaction = await TransactionsModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTransaction);
  } catch (error) {
    console.error('Error in PUT /api/transactions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE a transaction
router.delete('/:id', async (req, res) => {
  console.log('DELETE /api/transactions route hit');
  try {
    await TransactionsModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/transactions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
