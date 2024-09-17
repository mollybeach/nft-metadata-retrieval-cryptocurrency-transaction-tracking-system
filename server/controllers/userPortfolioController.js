/**
 * UserPortfolioController
 * @path server/controllers/userPortfolioController.js
 * @description Defines the controller functions for user portfolios.
 */

import PortfolioSchema from "../models/userPortfolioModel.js";

export const createPortfolio = async (req, res) => {
  const { id } = req.body;
  const user_id = req.user._id;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  if (!id) {
    return res
      .status(400)
      .json({ error: "Please provide an ID for the portfolio" });
  }

  try {
    let portfolio = await PortfolioSchema.findOne({ id });

    if (portfolio) {
      return res.status(200).json({ message: "Portfolio already exists" });
    }

    portfolio = await PortfolioSchema.create({
      id,
      user_id,
      transactions: [],
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserPortfolio = async (req, res) => {
  try {
    // 1. Identify the logged-in user
    const userId = req.user.id;

    // 2. Use the user ID to filter the data
    const userFolio = await PortfolioSchema.find({ user_id: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(userFolio);
  } catch (error) {
    res.status(500).json({
      error:
        "An error occurred while retrieving the user's portfolio.",
    });
  }
};
