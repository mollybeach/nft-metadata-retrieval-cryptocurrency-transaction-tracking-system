/**
 * NFT ABI
 * @file server/utils/nftABI.js
 * @description Defines the ABI (Application Binary Interface) 
 * for interacting with ERC721 NFT contracts.
 */

/**
 * @type {Array<Object>}
 * @description ABI for ERC721 NFT contract. Includes the tokenURI function.
 */
const nftABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  // Add other relevant functions from your NFT contract
];

export default nftABI;





