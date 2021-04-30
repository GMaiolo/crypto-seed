import axios from "axios";
import { Cache } from "memory-cache";

const cacheTime = 1000 * 60 * 5;

interface PricesResponse {
  data: {
    [key: string]: {
      price: string;
      name: string;
      symbol: string;
      price_BNB: string;
    };
  };
}

let pricesCache: { [key: string]: number } = {};
export const getPrice = async (address: string) => {
  const price = pricesCache[address.toLowerCase()];
  if (price) return price;
};

export const initUpdatePricesCacheInterval = async () => {
  await updatePricesCache();
  setInterval(updatePricesCache, cacheTime);
};

const updatePricesCache = async () => {
  try {
    pricesCache = {};
    const { data: response } = await axios.get<PricesResponse>(
      "https://api.pancakeswap.info/api/tokens"
    );
    const data = response.data;
    for (const addr in data) {
      pricesCache[addr.toLowerCase()] = Number(data[addr].price);
    }
  } catch (err) {
    console.log("Could not get pancake token prices info");
  }
};

interface GetLpPricesResponse {
  priceToken0: number;
  priceToken1: number;
  tvl: number;
  lpPrice: number;
}
export const getLpPrices = async (
  totalSupply,
  supplyToken0,
  supplyToken1,
  token0Addr: string,
  token1Addr: string
): Promise<GetLpPricesResponse> => {
  try {
    let lpPrice, tvl;
    let [priceToken0, priceToken1] = await Promise.all([
      getPrice(token0Addr),
      getPrice(token1Addr),
    ]);
    if (priceToken0 == null && priceToken1 == null) {
      console.log("Could not get prices", token0Addr, token1Addr);
      return { priceToken0, priceToken1, tvl, lpPrice };
    }
    if (priceToken0 == null) {
      priceToken0 = (supplyToken1 * priceToken1) / supplyToken0;
      pricesCache[token0Addr] = priceToken0;
    }
    if (priceToken1 == null) {
      priceToken1 = (supplyToken0 * priceToken0) / supplyToken1;
      pricesCache[token1Addr] = priceToken1;
    }
    if (priceToken0 != null && priceToken1 != null) {
      tvl = supplyToken0 * priceToken0 + supplyToken1 * priceToken1;
      lpPrice = tvl / totalSupply;
    }
    return { priceToken0, priceToken1, tvl, lpPrice };
  } catch {
    return null;
  }
};
