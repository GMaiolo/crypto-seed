import axios from "axios";
import { useEffect, useState } from "react";
import { ApeResponse, Status } from "../types";
import { formatMoney } from "../utils/formatMoney";

export const useSwamp = (address: string) => {
  const [data, setData] = useState<ApeResponse | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      setStatus("loading");
      try {
        const { data } = await axios.get<ApeResponse>(
          `https://api.apeboard.finance/swamp/${address}`
        );
        const balance = data.farms.reduce((acc, farm) => {
          const tokensBalance = farm.tokens.reduce(
            (acc, token) => acc + token.balance * token.price,
            0
          );
          const rewardBalance = farm.reward.balance * farm.reward.price;
          return acc + tokensBalance + rewardBalance;
        }, 0);
        setData(data);
        setBalance(balance);
        setError(null);
        setStatus("ok");
        // if (data?.farms[0]?.reward.price < 75)
        // alert(`BUY Price is ${formatMoney(data.farms[0].reward.price)}`);
        // if (data?.farms[0]?.reward.price > 88)
        // alert(`SELL Price is ${formatMoney(data.farms[0].reward.price)}`);
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
