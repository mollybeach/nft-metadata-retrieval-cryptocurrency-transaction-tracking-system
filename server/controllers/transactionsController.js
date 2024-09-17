/**
 * Transaction Controller
 * @path server/controllers/transactionsController.js
 * @description This file contains controller functions for handling transaction-related operations.
 * It includes functions for creating transactions, retrieving user transactions,
 * fetching transactions for a specific cryptocurrency address, and querying transactions
 * based on address and date range.
 */

import TransactionsModel from "../models/transactionsModel.js";
import UserPortfolio from "../models/userPortfolioModel.js";

/**
 * Retrieves all transactions for the authenticated user.
 * @function getTransactionsController
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user._id - User ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user's transactions or error message
 */
const getTransactionsController = async (req, res) => {
  try {
    const userId = req.user._id;

    const userFolio = await UserPortfolio.findOne({ user_id: userId }).populate("transactions");

    if (!userFolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    res.status(200).json(userFolio.transactions);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while retrieving the user's portfolio.",
    });
  }
};

/**
 * Creates a new transaction for the authenticated user.
 * @function createTransactionController
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing transaction details
 * @param {string} req.body.id - Transaction ID
 * @param {number} req.body.quantity - Quantity of the asset
 * @param {number} req.body.price - Price of the asset
 * @param {number} req.body.spent - Amount spent on the transaction
 * @param {string} req.body.date - Date of the transaction
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user._id - User ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created transaction or error message
 */
const postTransactionController = async (req, res) => {
  const { id, quantity, price, spent, date } = req.body;
  const user_id = req.user._id;

  // Validation checks
  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  if (!id || !quantity || !price || !spent || !date) {
    return res.status(400).json({ error: "All fields (id, quantity, price, spent, date) are required" });
  }

  try {
    const transaction = await TransactionsModel.create({
      id,
      quantity,
      price,
      spent,
      date,
      user_id,
    });

    res.status(201).json(transaction); // Return 201 for success
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * PUT update a transaction
 * @function putTransactionController
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing transaction details
 * @param {string} req.params.id - Transaction ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated transaction or error message
 */

const putTransactionController = async (req, res) => {
  const { id, quantity, price, spent, date } = req.body;
  const user_id = req.user._id;
  
  // Validation checks
  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  } 

  if (!id || !quantity || !price || !spent || !date) {
    return res.status(400).json({ error: "All fields (id, quantity, price, spent, date) are required" });
  } 

  try {
    const updatedTransaction = await TransactionsModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * DELETE a transaction
 * @function deleteTransactionController
 * @param {Object} req - Express request object
 * @param {Object} req.params.id - Transaction ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with deleted transaction or error message
 */

const deleteTransactionController = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user._id;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const deletedTransaction = await TransactionsModel.findOneAndDelete({ _id: id, user_id });
    if (!deletedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Exporting controller functions
export {
  postTransactionController,
  getTransactionsController,
  putTransactionController,
  deleteTransactionController,
};
