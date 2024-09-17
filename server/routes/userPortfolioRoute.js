/**
 * UserPortfolioRoute
 * @path server/routes/userPortfolioRoute.js
 * @description Defines the Express router for user portfolios.
 */
import express from 'express';
import { 
  createUserPortfolio, 
  getUserPortfolio, 
  updateUserPortfolio, 
  deleteUserPortfolio 
} from '../controllers/userPortfolioController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// Use requireAuth for all user portfolio routes
router.use(requireAuth);

router.post('/', createUserPortfolio);
router.get('/', getUserPortfolio);
router.patch('/:id', updateUserPortfolio);
router.delete('/:id', deleteUserPortfolio);

export default router;