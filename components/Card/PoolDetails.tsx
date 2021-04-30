import { useCallback } from "react";
import { PoolInfo } from "../../types";
import { formatMoney } from "../../utils/formatMoney";

type PoolDetailsProps = {
  pool: PoolInfo;
};
export const PoolDetails = ({ pool }: PoolDetailsProps) => {
  const onError = useCallback((e) => {
    e.target.onerror = null;
    e.target.src = "/unknown.png";
  }, []);

  return (
    <div className="p-2">
      <div>
        {pool.isLP ? (
          <ul className="grid gap-2">
            {[pool.lpInfo.token0, pool.lpInfo.token1].map(
              ({ price, addr, name, symbol, quantity }) => {
                return (
                  <li key={addr} className="flex items-center">
                    <img
                      onError={onError}
                      className="h-5 w-5 mr-2"
                      src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${addr}/logo.png`}
                      alt={symbol}
                    />
                    <p className="mr-2">{symbol}</p>
                    <p className="mr-2">{quantity.toFixed(4)}</p>
                    <p className="text-xs">{formatMoney(quantity * price)}</p>
                    <span className="mx-1">–</span>
                    <p className="text-xs ml-1">
                      Price{" "}
                      <span className="font-semibold">
                        {formatMoney(price)}
                      </span>
                      /token
                    </p>
                  </li>
                );
              }
            )}
          </ul>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};
