/**
 * Home
 * @path src/pages/Home.jsx
 * @description The component for displaying the home page.
 */
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FetchCrypto from "@/hooks/FetchCrypto";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import Categories from "@/components/Categories";
import CoinsList from "@/components/CoinsList";
import { InputHome } from "@/components/ui/input";
import { useState } from "react";
import { Popover } from "react-tiny-popover";
import { Search } from "lucide-react";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Label } from "@/components/ui/label";

export default function Home() {
  const { pageNumber = 1 } = useParams();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [valueHover, setValueHover] = useState({});

  const setPage = (num) => navigate(`/page/${num}`);

  const totalCoins = 14038;
  const coinPerPage = 100;
  const totalPages = Math.ceil(totalCoins / coinPerPage);

  const top = FetchCrypto(
    `https://api.coingecko.com/api/v3/coins/markets?page=${pageNumber}&vs_currency=usd&price_change_percentage=1h%2C24h%2C7d&sparkline=true&x_cg_demo_api_key=${
      import.meta.env.VITE_X_CG_DEMO_API_KEY
    }`
  );
  const trend = FetchCrypto(
    `https://api.coingecko.com/api/v3/search/trending?x_cg_demo_api_key=${
      import.meta.env.VITE_X_CG_DEMO_API_KEY
    }`
  );

  const categories = FetchCrypto(
    `https://api.coingecko.com/api/v3/coins/categories?x_cg_demo_api_key=${
      import.meta.env.VITE_X_CG_DEMO_API_KEY
    }`
  );

  const query = FetchCrypto(
    `https://api.coingecko.com/api/v3/search?query=${searchText}&x_cg_demo_api_key=${
      import.meta.env.VITE_X_CG_DEMO_API_KEY
    }`
  );

  const handleCategories = () => {
    navigate("/categories");
  };

  const handleCrypto = () => {
    navigate("/");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const arrowUpOrDown = (value) => {
    const direction = value?.toString().startsWith("-") ? "down" : "up";
    return (
      <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
        <path
          d={direction === "up" ? "M7 14l5-5 5 5H7z" : " M7 10l5 5 5-5H7z"}
        />
      </svg>
    );
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filterSearch = query.data?.coins?.filter((elem) => {
    if (searchText === "") {
      return true;
    } else {
      return (
        elem.name.toLowerCase().includes(searchText) ||
        elem.symbol.toLowerCase().includes(searchText)
      );
    }
  });

  const handleHoverStats = async (e) => {
    const targetId = e.target.id;
    const valueId = trend.data.coins.filter(
      (filter) => filter.item.id === targetId
    );
    await valueId.map((item) => {
      return setValueHover({
        symbol: item.item.symbol,
        rank: item.item.market_cap_rank,
        price: item.item.data.price,
        percent: item.item.data.price_change_percentage_24h.usd,
        marketCap: item.item.data.market_cap,
        volume: item.item.data.total_volume,
        sparkline: item.item.data.sparkline,
      });
    });
  };

  // if (top.loading || trend.loading || categories.loading || query.loading) {
  //   return <div>Loading...</div>;
  // }

  if (top.error || trend.error || categories.error || query.error) {
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
    <div className="container">
      <div className="flex my-5">
        {trend.loading ? (
          <SkeletonCard />
        ) : (
          <Card className="w-1/3">
            <CardHeader>
              <span className="font-bold px-3 text-xl">🔥 Tendance</span>
            </CardHeader>
            <CardContent>
              {/* utilisation de slice a la place de filter plus optimisé */}
              {/* filter parcourt tout le tableau alors que slice s'arrete a 3 dans ce cas */}
              {trend.data.coins.slice(0, 3).map((coin) => {
                return (
                  <Link key={coin.item.id} to={`/${coin.item.id}`}>
                    <div className="flex items-center space-x-3 hover:bg-gray-500 p-3 rounded-xl font-semibold">
                      <img
                        src={coin.item.small}
                        alt={coin.item.name}
                        width={25}
                      />
                      <span>{coin.item.name}</span>
                      <div className="flex flex-grow justify-end font-semibold">
                        <span>{coin.item.data.price.toFixed(4)} $US</span>
                        <span
                          className={`flex items-center ${
                            coin.item.data.price_change_percentage_24h.usd
                              .toString()
                              .startsWith("-")
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {arrowUpOrDown(
                            coin.item.data.price_change_percentage_24h.usd.toFixed(
                              1
                            )
                          )}
                          {coin.item.data.price_change_percentage_24h.usd.toFixed(
                            1
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
      <div className="flex mb-3">
        <Button
          onClick={handleCrypto}
          className={`bg-transparent text-dark hover:bg-gray-200 ${
            location.pathname === "/" ? "bg-slate-200 cursor-auto" : ""
          }`}
        >
          Crypto
        </Button>
        <Button
          onClick={handleCategories}
          className={`bg-transparent text-dark hover:bg-gray-200 ${
            location.pathname === "/categories"
              ? "bg-slate-200 cursor-auto"
              : ""
          }`}
        >
          Catégories
        </Button>
        <div className="flex justify-end flex-grow">
          <Popover
            isOpen={isPopoverOpen}
            positions={"bottom"}
            padding={10}
            onClickOutside={() => setIsPopoverOpen(false)}
            transform={{ top: -50, left: -140 }}
            transformMode="relative"
            content={
              <div className="md:w-[1000px] lg:w-[1000px] container rounded bg-white border px-3">
                <Label htmlFor="search" className="sr-only">
                  search
                </Label>
                <InputHome
                  id="search"
                  type="search"
                  placeholder="Rechercher un token"
                  onChange={handleSearch}
                  value={searchText}
                />
                {searchText ? (
                  ""
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-1 py-3">
                      <div className="p-3 pt-0 flex flex-grow items-center justify-between">
                        <span className="w-full text-gray-500">
                          Tendance Recherche 🔥
                        </span>
                        <hr className="border w-full" />
                      </div>
                      {trend.data.coins?.map((coin) => (
                        <Link
                          id={coin.item.id}
                          key={coin.item.id}
                          to={`/${coin.item.id}`}
                          className="block hover:bg-gray-200 p-3 rounded-xl"
                          onMouseOver={handleHoverStats}
                        >
                          <div className="flex items-center space-x-2">
                            <img
                              src={coin.item.small}
                              alt={coin.item.name}
                              width={25}
                            />
                            <span className="font-semibold">
                              {coin.item.name}
                            </span>
                            <span className="text-gray-500">
                              {coin.item.symbol}
                            </span>
                            <div className="flex justify-end flex-grow">
                              <span
                                className={`flex items-center ${
                                  coin.item.data.price_change_percentage_24h.usd
                                    .toString()
                                    .startsWith("-")
                                    ? "text-red-500"
                                    : "text-green-500"
                                }`}
                              >
                                {arrowUpOrDown(
                                  coin.item.data.price_change_percentage_24h.usd.toFixed(
                                    1
                                  )
                                )}
                                {coin.item.data.price_change_percentage_24h.usd.toFixed(
                                  1
                                )}
                                %
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="col-span-1 py-3 space-y-4">
                      <span className="font-semibold">
                        Satistiques {valueHover.symbol}
                      </span>
                      <div className="flex justify-between">
                        <span>Rang</span>
                        <span className="font-semibold">{valueHover.rank}</span>
                      </div>
                      <hr className="border" />
                      <div className="flex justify-between">
                        <span>Cours</span>
                        <span className="font-semibold">
                          {valueHover.price?.toFixed(6)} $US
                        </span>
                      </div>
                      <hr className="border" />
                      <div className="flex justify-between">
                        <span>24h%</span>
                        <span
                          className={`flex items-center font-semibold ${
                            valueHover.percent?.toString().startsWith("-")
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {arrowUpOrDown(valueHover.percent?.toFixed(1))}
                          {valueHover.percent?.toFixed(1)}%
                        </span>
                      </div>
                      <hr className="border" />
                      <div className="flex justify-between">
                        <span>Capitalisation boursière</span>
                        <span className="font-semibold">
                          {valueHover?.marketCap} $US
                        </span>
                      </div>
                      <hr className="border" />
                      <div className="flex justify-between">
                        <span>Volume sur 24 h</span>
                        <span className="font-semibold">
                          {valueHover?.volume} $US
                        </span>
                      </div>
                      <hr className="border" />
                      <div className="flex flex-col space-y-5">
                        <span>7 derniers jours</span>
                        <div className="flex justify-center">
                          <img
                            loading="lazy"
                            alt="graphique sparkline"
                            src={valueHover?.sparkline}
                            width={300}
                            height={300}
                          ></img>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="py-3 grid grid-cols-2">
                  {filterSearch?.map((data) => {
                    if (data.market_cap_rank == null) {
                      return;
                    }
                    return (
                      <div className="col-span-1" key={data.id}>
                        <Link
                          to={`/${data.id}`}
                          className="block hover:bg-gray-200 p-3 rounded-xl"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="mr-2">
                              {data.market_cap_rank}.
                            </span>
                            <img
                              width={25}
                              alt={data.name}
                              src={data.thumb}
                              style={{ marginRight: "5px" }}
                            />
                            <span className="font-semibold">{data.name}</span>
                            <span className="text-gray-500">{data.symbol}</span>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            }
          >
            <div
              className="bg-gray-300 rounded flex items-center px-3 w-1/4 space-x-2 hover:bg-gray-400 transition "
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            >
              <Search className="size-5" />
              <span className="font-semibold">Rechercher</span>
            </div>
          </Popover>
        </div>
      </div>
      {location.pathname === "/categories" ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Name </TableHead>
                <TableHead className="font-bold">Top 3 Coins </TableHead>
                <TableHead className="font-bold">24 h</TableHead>
                <TableHead className="font-bold">Volume sur 24 h</TableHead>
                <TableHead className="font-bold">
                  Capitalisation boursière
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.data.map((post, index) => {
                return <Categories post={post} key={index} index={index} />;
              })}
            </TableBody>
          </Table>
        </>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Name </TableHead>
                <TableHead className="font-bold">Price </TableHead>
                <TableHead className="font-bold">1 h</TableHead>
                <TableHead className="font-bold">24 h </TableHead>
                <TableHead className="font-bold">7 j </TableHead>
                <TableHead className="font-bold">ATH </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {top.data.map((post, index) => {
                return <CoinsList post={post} key={index} />;
              })}
            </TableBody>
          </Table>
        </>
      )}
      <div className="flex justify-center my-5">
        {location.pathname !== "/categories" && (
          <Pagination
            totalPages={totalPages}
            currentPage={parseInt(pageNumber, 10)}
            setCurrentPage={setPage}
            pagesCount={totalPages}
            pagesCutCount={5}
          />
        )}
      </div>
    </div>
  );
}
