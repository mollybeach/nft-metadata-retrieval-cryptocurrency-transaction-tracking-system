import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Web3 } from "web3";
import { useState, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import data from "../data/data.json";
import BigNumber from "bignumber.js";
// import LineChart from "@/components/LineChart";
import { Input } from "@/components/ui/input";

export default function MyAccount() {
  const [connectedAccount, setConnectedAccount] = useState();
  const [balance, setBalance] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState({ balance: "" });
  const [tokenList, setTokenList] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);
  const [selectedSecondItem, setSelectedSecondItem] = useState([]);
  const [isOpenFirst, setIsOpenFirst] = useState(false);
  const [isOpenSecond, setIsOpenSecond] = useState(false);
  const [tokenPrice, setTokenPrice] = useState([]);
  const [current, setCurrent] = useState({
    from: "",
    to: "",
    decimals: 18,
  });
  const [gasFee, setGasFee] = useState([]);
  const [tokenPriceUSDT, setTokenPriceUSDT] = useState("");
  const [estimatedPriceImpact, setEstimatedPriceImpact] = useState("");
  const [calcPriceImpact, setCalcPriceImpact] = useState("");
  const [accountTransaction, setAccountTransaction] = useState("");
  const [searchText, setSearchText] = useState({ first: "", second: "" });

  const getBalance = useCallback(async (connectedAccount) => {
    const provider = window.ethereum;
    const web3 = new Web3(provider);
    const balancePromises = tokenList.map(async (token) => {
      const tokenContract = new web3.eth.Contract(data, token.address);
      try {
        const balance = await tokenContract.methods
          .balanceOf(connectedAccount)
          .call();
        const divisor = new BigNumber(10).pow(new BigNumber(token.decimals));
        const balanceInToken = new BigNumber(balance).div(divisor);
        return {
          symbol: token.symbol,
          balance: balanceInToken.toFixed(),
          logo: token.logoURI,
          address: token.address,
        };
      } catch (error) {
        console.log(error.message);
        setErrorMessage(prevErrorMessage => ({
          ...prevErrorMessage,
          balance: (
            <span className="text-red-500">
              Veuillez connecter votre portefeuille au réseau Ethereum
            </span>
          ),
        }));
        return null;
      }
    });
    const balances = await Promise.all(balancePromises);
    return balances.filter(Boolean); // Filter out null values
  }, [tokenList]);

  useEffect(() => {
    if (connectedAccount) {
      setLoading(true);
      getBalance(connectedAccount)
        .then((balance) => {
          setBalance(balance);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [connectedAccount, getBalance]);

  const connectMetamask = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setConnectedAccount(accounts[0]);
        getBalance(accounts[0]);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const getAllTransactions = async () => {
    try {
      const response = await fetch(
        "https://api.etherscan.io/api?module=account&action=txlist&address=0x534A0076fb7c2b1f83FA21497429AD7ad3bD7587&startblock=0&endblock=99999999&page=0-150&offset=10&sort=asc&apikey=STPJNTFV7Z3CMDTEIINHWIFZMXFE7J5YC9"
      );
      const transac = await response.json();
      const transactions = transac.result;

      const provider = window.ethereum;
      const web3 = new Web3(provider);

      transactions.map((transaction) => {
        if (transaction.value > 0) {
          const timeStamp = transaction.timeStamp;
          const from = transaction.from;
          const to = transaction.to;
          const value = transaction.value;
          const valueInTokens = web3.utils.fromWei(value, "ether");

          const formattedDate = new Date(timeStamp) * 1000;
          setAccountTransaction({
            from: from,
            timeStamp: formattedDate,
            to: to,
            value: valueInTokens,
          });
          // console.log(
          //   `Transaction: De: ${from}, À: ${to}, Valeur: ${valueInTokens} tokens, Horodatage: ${new Date(
          //     timeStamp * 1000
          //   )}`
          // );
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  console.log(accountTransaction);
  useEffect(() => {
    getAllTransactions();
  }, []);

  const fetchTokenList = async () => {
    try {
      const response = await fetch(
        "https://tokens.coingecko.com/uniswap/all.json"
      );
      const tokenListData = await response.json();
      const filteredToken = tokenListData.tokens.filter(
        (entry) => entry.chainId === 1
      );
      setTokenList(filteredToken);
      setLoadingList(false);
    } catch (error) {
      console.log(error.message);
      setLoadingList(true);
    }
  };

  useEffect(() => {
    fetchTokenList();
  }, []);

  const getPrice = useCallback(async () => {
    if (!selectedItem || !selectedSecondItem) return;
    const amount = Number(current.from) * Math.pow(10, selectedItem[3]);
    const params = new URLSearchParams({
      sellToken: selectedItem[2],
      buyToken: selectedSecondItem[2],
      sellAmount: amount,
      priceImpactProtectionPercentage: 0.9,
    });
    const paramsPriceAgainstUSDT = new URLSearchParams({
      sellToken: selectedItem[2],
      buyToken: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      sellAmount: amount,
    });
    const headers = { "0x-api-key": "f3226fc9-8580-402d-851d-808413124d2b" };
    try {
      const response = await fetch(
        `https://api.0x.org/swap/v1/price?${params}`,
        { headers }
      );
      const responseUSDT = await fetch(
        `https://api.0x.org/swap/v1/price?${paramsPriceAgainstUSDT}`,
        { headers }
      );
      const tokenPriceResponse = await response.json();
      const tokenPriceUSDTResponse = await responseUSDT.json();
      const convertedPrice =
        tokenPriceResponse.buyAmount / Math.pow(10, selectedSecondItem[3]);
      const convertedPriceUSDT =
        tokenPriceUSDTResponse.buyAmount / Math.pow(10, 6);
      const valueUSDT = convertedPriceUSDT.toFixed(2);
      const value = convertedPrice.toFixed(2);
      const priceImpact =
        valueUSDT * (1 - parseFloat(tokenPriceResponse.estimatedPriceImpact));
      setTokenPriceUSDT(valueUSDT);
      setTokenPrice(value);
      setGasFee(tokenPriceResponse.estimatedGas);
      setEstimatedPriceImpact(tokenPriceResponse.estimatedPriceImpact);
      setCalcPriceImpact(priceImpact);
    } catch (error) {
      console.log(error.message);
    }
  }, [selectedItem, selectedSecondItem, current.from]);

  useEffect(() => {
    getPrice();
  }, [current, selectedItem, selectedSecondItem, getPrice]);

  const getQuote = async () => {
    if (!selectedItem || !selectedSecondItem) return;
    const amount = Number(current.from) * Math.pow(10, selectedItem[3]);
    const params = new URLSearchParams({
      sellToken: selectedItem[2],
      buyToken: selectedSecondItem[2],
      sellAmount: amount.toString(),
      takerAdress: connectedAccount,
    });
    const headers = { "0x-api-key": "f3226fc9-8580-402d-851d-808413124d2b" };
    try {
      const response = await fetch(
        `https://api.0x.org/swap/v1/quote?${params}`,
        { headers }
      );
      const swapQuote = await response.json();
      return swapQuote;
    } catch (error) {
      console.log(error.message);
    }
  };

  const trySwap = async () => {
    const provider = window.ethereum;
    const web3 = new Web3(provider);
    if (!provider) {
      return;
    } else {
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      let takerAdress = accounts[0];
      const fromTokenAddress = selectedItem[2];

      const swapQuote = await getQuote();

      const ERC20TokenContract = new web3.eth.Contract(data, fromTokenAddress);

      const amountInWei = new BigNumber(current.from).multipliedBy(
        new BigNumber(10).pow(selectedItem[3])
      );

      await ERC20TokenContract.methods
        .approve(swapQuote.allowanceTarget, amountInWei.toString())
        .send({
          from: takerAdress,
          to: swapQuote.to,
          data: swapQuote.data,
          value: swapQuote.value,
          gasPrice: swapQuote.gasPrice,
          gas: swapQuote.gas,
        });
    }
  };

  const handleSelectItem = (symbol, logo, address, decimals) => {
    setSelectedItem(symbol, logo, address, decimals);
    setIsOpenFirst(false);
  };

  const handleSecondSelectItem = (symbol, logo, address, decimals) => {
    setSelectedSecondItem(symbol, logo, address, decimals);
    setIsOpenSecond(false);
  };

  const handleInputChange = (event) => {
    setCurrent({
      ...current,
      [event.target.name]: event.target.value,
    });
  };

  const handleSearch = (event) => {
    setSearchText({
      ...searchText,
      [event.target.name]: event.target.value,
    });
  };

  const filterSearchFirst = tokenList.filter((elem) => {
    if (searchText.first === "") {
      return tokenList;
    } else {
      return elem.symbol.toLowerCase().includes(searchText.first);
    }
  });

  const filterSearchSecond = tokenList.filter((elem) => {
    if (searchText.second === "") {
      return tokenList;
    } else {
      return elem.symbol.toLowerCase().includes(searchText.second);
    }
  });

  return (
    <>
      <div className="container py-16">
        <div className="flex min-w-full justify-between">
          <div className="bg-slate-500 min-h-[500px] min-w-[800px]">a</div>
          <div className="bg-black rounded-2xl flex-col justify-center max-h-1/3 max-w-[480px] mt-16 flex p-2 gap-3">
            <div className="flex bg-[#1B1B1B] rounded-lg p-3 focus-within:border-white border border-transparent min-h-[120px]">
              <div className="flex flex-col">
                <p className="text-[#838383]">FROM</p>
                <input
                  type="number"
                  value={current.from}
                  name="from"
                  onChange={handleInputChange}
                  placeholder="0"
                  className="rounded-xl w-full mr-3 max-h-[44px] text-3xl focus:outline-none text-white font-semibold bg-[#1B1B1B] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                {tokenPriceUSDT > 0 ? (
                  <p className="text-[#838383] mt-3">{tokenPriceUSDT} $</p>
                ) : (
                  ""
                )}
              </div>

              <Dialog open={isOpenFirst} onOpenChange={setIsOpenFirst}>
                <div
                  className={`flex flex-col ${
                    selectedItem[0] == undefined ||
                    connectedAccount === undefined
                      ? "justify-center"
                      : "justify-end"
                  } `}
                >
                  <Button
                    className="rounded-full h-min bg-[#2D2F36] hover:bg-[#41444F] text-xl font-medium p-2 mt-[-0.2rem]"
                    onClick={() => setIsOpenFirst(!isOpenFirst)}
                  >
                    {selectedItem.length > 0 ? (
                      <>
                        <img
                          className="mr-2 object-cover rounded-full"
                          src={selectedItem[1]}
                          alt={selectedItem[0]}
                          width={30}
                          height={30}
                          loading="lazy"
                        />
                        <span>{selectedItem[0]}</span>
                        <ChevronDown className="ml-2" width={50} />
                      </>
                    ) : (
                      <ChevronDown className="ml-3" />
                    )}
                  </Button>
                  {selectedItem[0] ? (
                    <div className="flex justify-end mr-2">
                      {loading ? (
                        <p className="text-white">Chargement...</p>
                      ) : errorMessage.balance ? (
                        <p className="text-white">
                          Erreur: {errorMessage.balance}
                        </p>
                      ) : balance ? (
                        balance.map((token, index) =>
                          token.symbol == selectedItem[0] ? (
                            <p
                              key={index}
                              className="text-[#838383] text-sm mt-3"
                            >
                              Solde : {token.balance}
                            </p>
                          ) : null
                        )
                      ) : null}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Sélectionnez un jeton</DialogTitle>
                    <Input
                      onChange={handleSearch}
                      value={searchText.first}
                      placeholder="Rechercher un token par son symbol"
                      name="first"
                      type="search"
                    />
                  </DialogHeader>
                  <div className="flex-1 overflow-auto h-full">
                    <ul>
                      {loadingList ? (
                        <p>Loading...</p>
                      ) : (
                        filterSearchFirst.map((token, index) => {
                          return (
                            <li key={index} height={20} width={20}>
                              <div
                                className="flex cursor-pointer hover:bg-slate-300 p-3 hover:rounded-lg"
                                onClick={() => {
                                  handleSelectItem([
                                    token.symbol,
                                    token.logoURI,
                                    token.address,
                                    token.decimals,
                                  ]);
                                }}
                              >
                                <img
                                  src={token.logoURI}
                                  alt={token.symbol}
                                  className="mr-3 rounded-full object-cover"
                                  loading="lazy"
                                  width={30}
                                  height={30}
                                />
                                <span>{token.symbol}</span>
                              </div>
                            </li>
                          );
                        })
                      )}
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex bg-[#1B1B1B] rounded-lg p-3 focus-within:border-white border border-transparent min-h-[120px]">
              <div className="flex flex-col">
                <p className="text-[#838383]">TO</p>
                <input
                  type="number"
                  value={current.to > 0 ? current.to : tokenPrice}
                  name="to"
                  onChange={handleInputChange}
                  placeholder="0"
                  className="rounded-xl w-full mr-3 max-h-[44px] text-3xl outline-none text-white font-semibold bg-[#1B1B1B] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                {tokenPriceUSDT > 0 ? (
                  calcPriceImpact < tokenPriceUSDT ? (
                    <p className="text-[#838383] mt-3">
                      {calcPriceImpact} $ (-{estimatedPriceImpact}%)
                    </p>
                  ) : (
                    <p className="text-[#838383] mt-3">{tokenPriceUSDT} $</p>
                  )
                ) : (
                  ""
                )}
              </div>
              <Dialog open={isOpenSecond} onOpenChange={setIsOpenSecond}>
                <div className="flex flex-col justify-center">
                  <Button
                    className={
                      selectedSecondItem.length > 0
                        ? "rounded-full h-min bg-[#2D2F36] hover:bg-[#41444F] text-xl font-medium p-2 mt-[-0.2rem]"
                        : "rounded-full font-bold bg-[#FC72FF] hover:bg-[#fd72ffdb] text-lg pr-0 mt-[-0.2rem]"
                    }
                    onClick={() => setIsOpenSecond(!isOpenSecond)}
                  >
                    {selectedSecondItem.length > 0 ? (
                      <>
                        <img
                          className="mr-2 object-cover rounded-full"
                          src={selectedSecondItem[1]}
                          alt={selectedSecondItem[0]}
                          width={30}
                          height={30}
                          loading="lazy"
                        />
                        <span>{selectedSecondItem[0]}</span>
                        <ChevronDown className="ml-2" width={50} />
                      </>
                    ) : (
                      <>
                        <span>Sélectionnez le jeton</span>
                        <ChevronDown width={50} />
                      </>
                    )}
                  </Button>
                  {selectedSecondItem[0] ? (
                    <div className="flex justify-end mr-2">
                      {loading ? (
                        <p>Chargement...</p>
                      ) : errorMessage.balance ? (
                        <p>Erreur: {errorMessage.balance}</p>
                      ) : balance ? (
                        balance.map((token, index) =>
                          token.symbol == selectedSecondItem[0] ? (
                            <p
                              key={index}
                              className="text-[#838383] text-sm mt-3"
                            >
                              Solde : {token.balance}
                            </p>
                          ) : null
                        )
                      ) : null}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Sélectionnez un jeton</DialogTitle>
                    <Input
                      onChange={handleSearch}
                      value={searchText.second}
                      name="second"
                      type="search"
                      placeholder="Rechercher un token par son symbol"
                    />
                  </DialogHeader>
                  <div className="flex-1 overflow-auto h-full">
                    <ul>
                      {loadingList ? (
                        <p>Loading...</p>
                      ) : (
                        filterSearchSecond.map((token, index) => {
                          return (
                            <li key={index}>
                              <div
                                className="flex cursor-pointer hover:bg-slate-300 hover:rounded-lg p-3"
                                onClick={() => {
                                  handleSecondSelectItem([
                                    token.symbol,
                                    token.logoURI,
                                    token.address,
                                    token.decimals,
                                  ]);
                                }}
                              >
                                <img
                                  src={token.logoURI}
                                  alt={token.symbol}
                                  className="mr-3 rounded-full object-cover"
                                  loading="lazy"
                                  width={30}
                                  height={30}
                                />
                                <span>{token.symbol}</span>
                              </div>
                            </li>
                          );
                        })
                      )}
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-white px-3">Estimated Gas: {gasFee}</p>
            {connectedAccount && loadingList === false ? (
              <Button
                className="w-full py-8 font-bold text-lg bg-[#311C31] hover:bg-[#432643] text-[#FC72FF]"
                onClick={() => trySwap()}
              >
                Swap
              </Button>
            ) : (
              <Button
                onClick={connectMetamask}
                className="w-full py-8 font-bold text-lg bg-[#311C31] hover:bg-[#432643] text-[#FC72FF]"
              >
                Connecter MetaMask
              </Button>
            )}
          </div>
        </div>

        <div className="flex justify-between text-center mt-3">
          <Card className="bg-[#eeeeee] shadow-xl w-full">
            <CardHeader className="pb-3">
              <CardDescription className="text-xl text-start text-black font-semibold">
                <div className="flex flex-1 justify-between">
                  <span>Portefeuille</span>
                  <span>
                    {loading ? (
                      <p>Chargement...</p>
                    ) : errorMessage.balance ? (
                      <p>Erreur: {errorMessage.balance}</p>
                    ) : balance ? (
                      balance.map((token, index) =>
                        token.balance != 0 ? (
                          <p key={index}>${token.balance}</p>
                        ) : null
                      )
                    ) : null}
                  </span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex text-black">Token</div>
                <div className="flex text-black">Price</div>
                <div className="flex text-black">Balance</div>
                <div className="flex text-black">Value</div>
              </div>
              <hr className="bg-black h-0.5 mt-3" />
              {loading ? (
                <p>Chargement...</p>
              ) : errorMessage.balance ? (
                <p>Erreur: {errorMessage.balance}</p>
              ) : balance ? (
                balance.map((token, index) =>
                  token.balance != 0 ? (
                    <div
                      key={index}
                      className="flex mt-3 items-center justify-between"
                    >
                      <div className="flex items-center">
                        <img
                          src={token.logo}
                          alt={token.symbol}
                          className="mr-2 rounded-full object-cover"
                          loading="lazy"
                          width={30}
                          height={30}
                        />
                        <p className="text-black font-bold">{token.symbol}</p>
                      </div>
                      <p className="text-black font-bold">{tokenPriceUSDT}</p>
                      <p className="text-black font-bold">1</p>
                      <p className="text-black font-bold">1</p>
                    </div>
                  ) : null
                )
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
