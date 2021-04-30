import { useMemo, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { PoolInfo } from "../../../types";
import { formatMoney } from "../../../utils/formatMoney";
import { getUserStakedPrice } from "../../../utils/poolUtils";
import { PoolImage } from "./PoolImage";
import { PoolDetails } from "../PoolDetails";

type PoolRowProps = {
  pool: PoolInfo;
  nativeTokenPrice: number;
};
export const PoolRow = ({ pool, nativeTokenPrice }: PoolRowProps) => {
  const [showDetail, setShowDetail] = useState(false);

  const [userStakedPrice, userStakedPriceFormatted] = useMemo(() => {
    const price = getUserStakedPrice(pool);
    const formatted = formatMoney(price);
    return [price, formatted];
  }, [pool]);

  const [pendingHarvestPrice, pendingHarvestPriceFormatted] = useMemo(() => {
    const price = pool.pendingHarvest * nativeTokenPrice; // puede que no sea el native token aca, investigar llegado el caso
    const formatted = formatMoney(price);
    return [price, formatted];
  }, [pool, nativeTokenPrice]);

  const totalPoolValueFormatted = useMemo(
    () => formatMoney(userStakedPrice + pendingHarvestPrice),
    [userStakedPrice, pendingHarvestPrice]
  );

  return (
    <>
      {/* detail button */}
      <button
        className={`${
          !showDetail ? "border-b border-gray-200 pb-3" : ""
        } cursor-pointer flex items-center justify-start`}
        onClick={() => setShowDetail(!showDetail)}
      >
        {showDetail ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      {/* pool */}
      <div
        className={`${
          !showDetail ? "border-b border-gray-200 pb-3" : ""
        } flex items-center`}
      >
        <PoolImage pool={pool} />
        <div className="ml-2 font-semibold">
          <span>{pool.symbol}</span>
          {pool.isLP && <span className="ml-1 text-xs">(LP)</span>}
        </div>
      </div>
      {/* balance */}
      <div
        className={`${
          !showDetail ? "border-b border-gray-200 pb-3" : ""
        } flex items-center justify-end`}
      >
        <p title={pool.userStaked.toString()}>
          <span>{pool.userStaked.toFixed(3)}</span>
          <span className="font-semibold ml-1 text-xs">
            ({userStakedPriceFormatted})
          </span>
        </p>
      </div>
      {/* pending harvest */}
      <div
        className={`${
          !showDetail ? "border-b border-gray-200 pb-3" : ""
        } flex items-center justify-end`}
      >
        <p title={pool.pendingHarvest.toString()}>
          <span>{pool.pendingHarvest.toFixed(3)}</span>
          <span className="font-semibold ml-1 text-xs">
            ({pendingHarvestPriceFormatted})
          </span>
        </p>
      </div>
      {/* value */}
      <div
        className={`${
          !showDetail ? "border-b border-gray-200 pb-3" : ""
        } flex items-center justify-end`}
      >
        {totalPoolValueFormatted}
      </div>
      {/* detail (full width row) */}
      {showDetail && (
        <div
          className="border-b border-gray-200 pb-5"
          style={{ gridColumn: "1 / -1" }}
        >
          <PoolDetails pool={pool} />
        </div>
      )}
    </>
  );
};
