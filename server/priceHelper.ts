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

const calculatedPricesCache = new Cache<string, number>();
const apiPricesCache = new Cache<string, number>();
export const getPrice = async (address: string) => {
  if (apiPricesCache.size() === 0) {
    await updateApiPricesCache();
  }
  const cachedApiPrice = apiPricesCache.get(address.toLowerCase());
  const cachedCalculatedPrice = calculatedPricesCache.get(
    address.toLocaleLowerCase()
  );
  const price = cachedApiPrice || cachedCalculatedPrice;
  if (price) return price;
};

const updateApiPricesCache = async () => {
  try {
    const { data: response } = await axios.get<PricesResponse>(
      "https://api.pancakeswap.info/api/tokens"
    );
    const data = response.data;
    for (const addr in data) {
      apiPricesCache.put(
        addr.toLowerCase(),
        Number(data[addr].price),
        cacheTime
      );
    }
  } catch (err) {
    console.log(err);
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
      apiPricesCache.put(token0Addr, priceToken0, cacheTime);
    }
    if (priceToken1 == null) {
      priceToken1 = (supplyToken0 * priceToken0) / supplyToken1;
      apiPricesCache.put(token1Addr, priceToken1, cacheTime);
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
