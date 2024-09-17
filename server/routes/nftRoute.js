/**
 * NFT Routes
 * @path server/routes/nftRoute.js
 * @description This file defines the Express router for NFT-related routes.
 * It includes routes for retrieving NFT metadata from the blockchain or database.
 */

import express from 'express';
import { getNFTMetadataController, getStoredNFTMetadataController } from '../controllers/nftController.js';

/**
 * Express router to mount NFT related functions on.
 * @type {object}
 * @const
 * @namespace nftRoutes
 */
const router = express.Router();

/**
 * Route serving NFT metadata retrieval from the blockchain or database.
 * @name GET /api/nft/metadata/:contractAddress/:tokenId
 * @function
 * @memberof module:routers/nft~nftRoutes
 * @inner
 * @param {string} contractAddress - The contract address of the NFT
 * @param {string} tokenId - The ID of the specific NFT token
 * @returns {Object} JSON response with NFT metadata
 */
router.get('/metadata/:contractAddress/:tokenId', getNFTMetadataController);

/**
 * Route serving stored NFT metadata retrieval from MongoDB.
 * @name GET /api/nft/stored-metadata/:contractAddress/:tokenId
 * @function
 * @memberof module:routers/nft~nftRoutes
 * @inner
 * @param {string} contractAddress - The contract address of the NFT
 * @param {string} tokenId - The ID of the specific NFT token
 * @returns {Object} JSON response with NFT metadata from MongoDB
 */
router.get('/stored-metadata/:contractAddress/:tokenId', getStoredNFTMetadataController);

export default router;
