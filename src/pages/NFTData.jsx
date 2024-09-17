/**
 * NFTData
 * @path src/pages/NFTData.jsx
 * @description The component for displaying NFT metadata.
 */
import { useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/SkeletonCard";

const NFTData = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMetadata = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/nft/metadata/${contractAddress}/${tokenId}`);
      setMetadata(response.data);
      setError('');
    } catch (error) {
      setMetadata(null);
      setError('Failed to fetch NFT metadata');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // New function to fill inputs with sample data
  const fillSampleData = () => {
    // Example: CryptoPunks contract address and a random token ID
    setContractAddress('0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB');
    setTokenId('1234'); // You can randomize this if you want
  };

  return (
    <div className="container mx-auto my-8">
      <div className="flex justify-center">
        <Card className="w-full md:w-2/3 lg:w-1/2">
          <CardHeader>
            <h2 className="text-2xl font-bold text-center">NFT Metadata Retrieval</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <Input
                type="text"
                placeholder="Contract Address"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="w-full"
              />
              <Input
                type="text"
                placeholder="Token ID"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                className="w-full"
              />
              <div className="flex space-x-2">
                <Button
                  onClick={fetchMetadata}
                  className="bg-blue-500 text-white font-bold flex-grow hover:bg-blue-600"
                >
                  Fetch Metadata
                </Button>
                <Button
                  onClick={fillSampleData}
                  className="bg-green-500 text-white font-bold hover:bg-green-600"
                >
                  Use Sample Data
                </Button>
              </div>
            </div>

            {loading && <SkeletonCard />}
            {metadata && !loading && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">NFT Metadata</h3>
                <div className="border rounded-lg p-4 space-y-3">
                  <p><strong>Name:</strong> {metadata.name}</p>
                  <p><strong>Description:</strong> {metadata.description}</p>
                  <div className="flex justify-center">
                    <img
                      src={metadata.imageUrl}
                      alt={metadata.name}
                      className="w-40 h-40 object-contain rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}

            {error && !loading && (
              <div className="text-red-500 text-center mt-4">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {error && (
        <div className="flex justify-center mt-4">
          <Button
            onClick={handleRefresh}
            className="bg-black text-white font-bold w-1/4 hover:bg-gray-600"
          >
            Refresh
          </Button>
        </div>
      )}
    </div>
  );
};

export default NFTData;
