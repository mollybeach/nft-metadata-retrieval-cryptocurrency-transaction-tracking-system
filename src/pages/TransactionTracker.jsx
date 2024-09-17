import { useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/SkeletonCard";

const TransactionTracker = () => {
  const [address, setAddress] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const trackTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/transactions/track', { address });
      setTransactions(response.data);
      setError('');
    } catch (error) {
      setTransactions([]);
      setError('Failed to track transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // New function to fill input with sample data
  const fillSampleData = () => {
    // Example: Ethereum address (Vitalik Buterin's address)
    setAddress('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
  };

  return (
    <div className="container mx-auto my-8">
      <div className="flex justify-center">
        <Card className="w-full md:w-2/3 lg:w-1/2">
          <CardHeader>
            <h2 className="text-2xl font-bold text-center">Cryptocurrency Transaction Tracking</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <Input
                type="text"
                placeholder="Cryptocurrency Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full"
              />
              <div className="flex space-x-2">
                <Button
                  onClick={trackTransactions}
                  className="bg-blue-500 text-white font-bold flex-grow hover:bg-blue-600"
                >
                  Track Transactions
                </Button>
                <Button
                  onClick={fillSampleData}
                  className="bg-green-500 text-white font-bold hover:bg-green-600"
                >
                  Use Sample Address
                </Button>
              </div>
            </div>

            {loading && <SkeletonCard />}

            {transactions.length > 0 && !loading && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Transactions</h3>
                <div className="border rounded-lg p-4 space-y-3">
                  {transactions.map((tx, index) => (
                    <div key={index} className="border-b pb-3 mb-3">
                      <p><strong>From:</strong> {tx.from}</p>
                      <p><strong>To:</strong> {tx.to}</p>
                      <p><strong>Value:</strong> {tx.value}</p>
                      <p><strong>Hash:</strong> {tx.hash}</p>
                    </div>
                  ))}
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

export default TransactionTracker;