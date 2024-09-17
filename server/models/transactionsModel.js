/**
 * TransactionsModel
 * @path server/models/transactionsModel.js
 * @description Defines the Mongoose schema for transactions.
 */

import mongoose from "mongoose";

/**
 *  @typedef {Object} TransactionsModel
 *  @property {string} id - The transaction ID.
 *  @property {string} from - The address the transaction was sent from.
 *  @property {string} to - The address the transaction was sent to.
 *  @property {number} quantity - The quantity of the transaction.
 *  @property {number} price - The price of the transaction.
 *  @property {number} spent - The amount spent on the transaction.
 *  @property {Date} date - The date the transaction was created.
 *  @property {string} user_id - The ID of the user who created the transaction.
 */

/**
 * Mongoose schema for Transactions
 * @type {mongoose.Schema<TransactionsModel>}
 */
const { Schema } = mongoose;

const transactionSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  spent: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  user_id: {
    type: String,
    required: true,
  },
});

const TransactionsModel = mongoose.model('Transaction', transactionSchema);

export default TransactionsModel;
