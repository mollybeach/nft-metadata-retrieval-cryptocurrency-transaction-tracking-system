/**
 * FetchCrypto
 * @path src/hooks/FetchCrypto.jsx
 * @description The hook for fetching data from the API.
 */

import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function FetchCrypto(url, option) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchAsync = useCallback(async () => {
    try {
      const response = await axios({
        url,
        method: "GET",
        headers: {
          // Your headers here
        },
        ...option,
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  }, [url, option]);

  useEffect(() => {
    fetchAsync();
  }, [fetchAsync]);

  return { loading, data, error };
}
