/**
 * NFT Controller
 * @path server/routes/transactions.js
 * @description This file contains the controller functions for fetching NFT metadata from the blockchain and storing it in MongoDB.
 */

import { Web3 } from 'web3';
import NFTMetadataModel from '../models/nftMetadataModel.js';
import nftABI from '../utils/nftABI.js';
import dotenv from 'dotenv';
import axios from 'axios'; // Assuming axios is needed for the new code block

// Load environment variables from .env file
dotenv.config();

// Initialize Web3 directly with the Infura URL
const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`);

/**
 * Retrieves NFT metadata for a given contract address and token ID.
 * If the metadata is not in the database, it fetches from the blockchain and stores it.
 *
 * @async
 * @function getNFTMetadataController
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.contractAddress - The NFT contract address
 * @param {string} req.params.tokenId - The token ID of the NFT
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Sends a JSON response with NFT metadata or an error message
 */
export const getNFTMetadataController = async (req, res) => {
  try {
    const { contractAddress, tokenId } = req.params;

    // Validate Ethereum address
    if (!web3.utils.isAddress(contractAddress)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    // Create contract instance
    const contract = new web3.eth.Contract(nftABI, contractAddress);

    // Fetch token URI
    const tokenURI = await contract.methods.tokenURI(tokenId).call();

    if (!tokenURI) {
      return res.status(404).json({ error: 'Token URI not found' });
    }

    // Fetch metadata from tokenURI
    const response = await axios.get(tokenURI);
    const metadata = response.data;

    const nft = {
      contractAddress,
      tokenId,
      metadata
    };

    return res.status(200).json(nft);
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);

    if (error.cause) {
      console.error('Cause:', error.cause);
      return res.status(500).json({ error: 'Contract execution failed', cause: error.cause.message });
    }

    return res.status(400).json({ error: error.message });
  }
};


/**
 * Retrieves stored NFT metadata from MongoDB.
 *
 * @async
 * @function getStoredNFTMetadataController
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.contractAddress - The NFT contract address
 * @param {string} req.params.tokenId - The token ID of the NFT
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Sends a JSON response with stored NFT metadata or an error message
 */
export const getStoredNFTMetadataController = async (req, res) => {
  const { contractAddress, tokenId } = req.params;

  try {
    // Find the NFT metadata in MongoDB
    const nft = await NFTMetadataModel.findOne({ contractAddress, tokenId });

    if (!nft) {
      return res.status(404).json({ error: 'NFT metadata not found' });
    }

    res.status(200).json(nft);
  } catch (error) {
    console.error('Error retrieving stored NFT metadata:', error);
    res.status(500).json({ error: error.message });
  }
};
