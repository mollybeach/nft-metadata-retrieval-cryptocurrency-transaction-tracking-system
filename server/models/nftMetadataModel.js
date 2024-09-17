/**
 * NFT Metadata
 * @file server/models/nftMetadata.js
 * @description Defines the Mongoose schema for NFT metadata.
 */

import mongoose from "mongoose";

/**
 * @typedef {Object} NFTMetadataModel
 * @property {string} contractAddress - The address of the NFT contract.
 * @property {string} tokenId - The unique identifier of the NFT within its contract.
 * @property {string} name - The name of the NFT.
 * @property {string} description - A description of the NFT.
 * @property {string} imageUrl - URL pointing to the NFT's image.
 */

/**
 * Mongoose schema for NFT metadata.
 * @type {mongoose.Schema<NFTMetadataModel>}
 */
const nftMetadataSchema = new mongoose.Schema({
  contractAddress: {
    type: String,
    required: true
  },
  tokenId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
}, { timestamps: true });

const NFTMetadataModel = mongoose.model('NFTMetadata', nftMetadataSchema);

export default NFTMetadataModel;
