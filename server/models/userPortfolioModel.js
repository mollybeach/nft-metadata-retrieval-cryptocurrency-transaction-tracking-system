/**
 * UserPortfolioModel
 * @path server/models/userPortfolioModel.js
 * @description Defines the Mongoose schema for user portfolios.
 */

import mongoose from 'mongoose';

const { Schema } = mongoose;

const PortfolioSchema = new Schema(
  {
    id: {
      type: String,
      unique: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Transactions",
      },
    ],
  },
  { timestamps: true }
);

const UserPortfolio = mongoose.model("Portfolio", PortfolioSchema);

export default UserPortfolio;
