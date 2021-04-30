import { useCallback } from "react";
import { PoolInfo } from "../../../types";

type PoolImageProps = {
  pool: PoolInfo;
};
export const PoolImage = ({ pool }: PoolImageProps) => {
  const onError = useCallback((e) => {
    e.target.onerror = null;
    e.target.src = "/unknown.png";
  }, []);

  if (pool.isLP)
    return (
      <figure className="ml-4 flex relative">
        {[pool.lpInfo.token0, pool.lpInfo.token1].map(({ addr, symbol }, i) => (
          <img
            key={symbol}
            onError={onError}
            src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${addr}/logo.png`}
            className={`w-6 rounded-full ${i === 0 ? "absolute -left-4" : ""}`}
            alt={symbol}
          />
        ))}
      </figure>
    );
  return (
    <img
      src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${pool.addr}/logo.png`}
      onError={onError}
      className="w-6 rounded-full"
      alt={pool.name}
    />
  );
};
