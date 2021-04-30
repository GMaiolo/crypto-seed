import { Fragment } from "react";
import { PlatformData } from "../../../types";
import { formatMoney } from "../../../utils/formatMoney";
import { PoolRow } from "./PoolRow";

type Props = {
  data: PlatformData;
  totalPendingRewards: number;
  totalPendingRewardsFormatted: string | number;
  totalStakedInUsd: number;
};
export const PlatformTable = ({
  data,
  totalPendingRewards,
  totalPendingRewardsFormatted,
  totalStakedInUsd,
}: Props) => {
  return (
    <div
      className="grid gap-y-4 text-center"
      style={{ gridTemplateColumns: "2rem 1fr 1fr 1fr 1fr" }}
    >
      {/* headers row */}
      <div></div>
      <div className="font-bold text-left">Pool</div>
      <div className="font-bold text-right">Balance</div>
      <div className="font-bold text-right">Pending harvest</div>
      <div className="font-bold text-right">Value</div>
      {/* pools rows */}
      {data.pools.map((pool) => (
        <Fragment key={pool.addr}>
          <PoolRow pool={pool} nativeTokenPrice={data.nativeTokenPrice} />
        </Fragment>
      ))}
      {/* summary row */}
      <div></div>
      <div></div>
      <div className="font-bold text-right">
        {formatMoney(totalStakedInUsd)}
      </div>
      <div className="text-right">
        <span className="font-bold">{totalPendingRewards.toFixed(3)}</span>
        <span className="font-semibold text-xs ml-1">
          ({totalPendingRewardsFormatted})
        </span>
      </div>
      <div className="font-bold text-right">
        {formatMoney(totalPendingRewards + totalStakedInUsd)}
      </div>
    </div>
  );
};
