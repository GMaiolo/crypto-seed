import axios from "axios";
import { useEffect, useState } from "react";
import { Status, WalletToken } from "../types";

export const useWallet = (address: string) => {
  const [data, setData] = useState<WalletToken[] | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      setStatus("loading");
      try {
        const { data } = await axios.get<WalletToken[]>(
          `https://api.apeboard.finance/wallet/bsc/${address}`
        );
        const balance = data.reduce((acc, token) => {
          const tokenBalance = token.balance * token.price;
          return acc + tokenBalance;
        }, 0);
        setData(data);
        setBalance(balance);
        setError(null);
        setStatus("ok");
      } catch (err) {
        setError(err);
        setStatus("error");
      }
    };
    getData();
    const timer = setInterval(getData, 10000);
    return () => clearTimeout(timer);
  }, [address]);

  return {
    status,
    data,
    error,
    balance,
  };
};
