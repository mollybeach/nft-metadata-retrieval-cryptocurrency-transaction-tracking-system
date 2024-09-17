/**
 * Detailed
 * @path src/pages/Detailed.jsx
 * @description The component for displaying the detailed page.
 */
import FetchCrypto from "@/hooks/FetchCrypto";
import { useParams } from "react-router-dom";
import LineChart from "@/components/LineChart";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Detailed() {
  const [days, setDays] = useState("days=1");
  const { id } = useParams();
  const options = { mode: "no-cors" };

  const getCrypto = FetchCrypto(
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&${days}`,
    options
  );

  const getCryptoId = FetchCrypto(
    `https://api.coingecko.com/api/v3/coins/${id}`,
    options
  );

  const formattedPrices = useMemo(() => {
    return (
      getCrypto?.data?.prices?.map((entry) => ({
        time: new Date(entry[0]).toLocaleTimeString([], {
          month: "long",
          day: "numeric",
        }),
        value: entry[1],
      })) || []
    );
  }, [getCrypto]);

  const lastPrice = useMemo(() => {
    return getCrypto?.data?.prices?.pop();
  }, [getCrypto]);

  const arrowUpOrDown = (value) => {
    const direction = value.toString().startsWith("-") ? "down" : "up";
    return (
      <div className="flex items-center">
        <span className="font-bold text-4xl">
          {lastPrice[1] > 1 ? lastPrice[1].toFixed(2) : lastPrice[1].toFixed(5)}
          $US
        </span>
        <svg
          fill="currentColor"
          className={`w-7 h-7 ${
            direction === "down" ? "text-red-500" : "text-green-500"
          }`}
          viewBox="0 0 20 20"
        >
          <path
            d={direction === "up" ? "M7 14l5-5 5 5H7z" : "M7 10l5 5 5-5H7z"}
          />
        </svg>
        <span
          className={`font-semibold text-xl ${
            direction === "down" ? "text-red-500" : "text-green-500"
          }`}
        >
          {value}%
        </span>
      </div>
    );
  };

  const handleDays = () => {
    setDays("days=1");
  };

  const handleSevenDays = () => {
    setDays("days=7");
  };

  const handleOneMonth = () => {
    setDays("days=30");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (getCrypto?.loading || getCryptoId?.loading) {
    return <p>Loading...</p>;
  }

  if (getCrypto?.data === undefined && getCryptoId?.data === undefined) {
    return (
      <div className="container">
        <div className="flex justify-center h-full items-center flex-col space-y-4">
          <h1 className="text-red-500 text-7xl font-bold">loading</h1>
        </div>
      </div>
    );
  }

  if (getCrypto?.error || getCryptoId?.error) {
    return (
      <div className="container">
        <div className="flex justify-center h-full items-center flex-col space-y-4">
          <h1 className="text-red-500 text-7xl font-bold">An error occured</h1>
          <Button
            onClick={handleRefresh}
            className="bg-black text-white font-bold w-1/4 hover:bg-gray-600"
          >
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container p-10">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 border-r-2 space-y-3">
            <div className="flex space-x-2">
              <img src={getCryptoId?.data?.image?.thumb} alt="" />
              <h1 className="text-xl font-bold">{getCryptoId?.data?.name}</h1>
              <button className="bg-gray-300 px-2 rounded cursor-auto">
                #{getCryptoId?.data?.market_cap_rank}
              </button>
            </div>
            {arrowUpOrDown(
              getCryptoId?.data?.market_data.price_change_percentage_24h.toFixed(
                1
              )
            )}
          </div>
          <div className="col-span-3">
            <div className="flex justify-end">
              <div className="inline-flex rounded-lg shadow-sm">
                <button
                  onClick={() => handleDays()}
                  type="button"
                  className={`${
                    days === "days=1" ? "bg-gray-300 cursor-auto" : "bg-white"
                  } py-2 px-3 inline-flex justify-center items-center gap-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200  text-gray-800 shadow-sm hover:bg-gray-300 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 `}
                >
                  24h
                </button>
                <button
                  onClick={() => handleSevenDays()}
                  type="button"
                  className={`${
                    days === "days=7" ? "bg-gray-300 cursor-auto" : "bg-white"
                  } py-2 px-3 inline-flex justify-center items-center gap-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200  text-gray-800 shadow-sm hover:bg-gray-300 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 `}
                >
                  7j
                </button>
                <button
                  type="button"
                  onClick={() => handleOneMonth()}
                  className={`${
                    days === "days=30" ? "bg-gray-300 cursor-auto" : "bg-white"
                  } py-2 px-3 inline-flex justify-center items-center gap-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200  text-gray-800 shadow-sm hover:bg-gray-300 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 `}
                >
                  1m
                </button>
              </div>
            </div>
            <LineChart data={formattedPrices} />
          </div>
        </div>
        <span
          dangerouslySetInnerHTML={{ __html: getCryptoId?.data.description.en }}
        ></span>
      </div>
    </>
  );
}
