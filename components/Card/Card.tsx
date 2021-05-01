import { useMemo } from "react";
import { PlatformData, Status } from "../../types";
import { formatMoney } from "../../utils/formatMoney";
import { PlatformTable } from "./PlatformTable";
import {
  getTotalPendingRewards,
  getTotalStakedInUsd,
} from "../../utils/poolUtils";
import { FaExternalLinkAlt } from "react-icons/fa";

interface CardProps {
  name: string;
  status: Status;
  icon: string;
  data: PlatformData;
}
export function Card({ name, status, icon, data }: CardProps) {
  const [totalPendingRewards, totalPendingRewardsFormatted] = useMemo(() => {
    if (!data) return [];
    const total = getTotalPendingRewards(data.pools || []);
    const formatted = formatMoney(total * data.nativeTokenPrice);
    return [total, formatted];
  }, [data]);

  const totalStakedInUsd = useMemo(
    () => getTotalStakedInUsd(data?.pools || []),
    [data]
  );

  return (
    <div className="w-full">
      <div className="ml-4 mb-2 flex">
        <figure className="flex items-center">
          <img
            alt="swamp"
            className="w-12 h-12 object-cover rounded-full"
            src={icon}
          />
        </figure>
        <div className="ml-4">
          <div className="flex items-center font-semibold text-2xl">
            <span>{name}</span>
            {data && (
              <span className="ml-2 text-base">
                ({formatMoney(totalPendingRewards + totalStakedInUsd)})
              </span>
            )}
            {data && (
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 py-2 px-1"
              >
                <FaExternalLinkAlt className="h-3" />
              </a>
            )}
          </div>
          {data && (
            <p className="text-sm">
              <span>Native token price:</span>
              <span className="ml-1 font-semibold">
                {formatMoney(data.nativeTokenPrice)}
              </span>
            </p>
          )}
        </div>
      </div>
      <div className="relative p-8 shadow-chill bg-white rounded-3xl">
        {status === "ok" && (
          <PlatformTable
            data={data}
            totalPendingRewards={totalPendingRewards}
            totalPendingRewardsFormatted={totalPendingRewardsFormatted}
            totalStakedInUsd={totalStakedInUsd}
          />
        )}
        {status === "error" && (
          <div className="p-8 text-center">
            <p>
              Couldn't fetch pool information correctly, try again later or
              contact us
            </p>
          </div>
        )}
        {status === "loading" && (
          <div className="p-8 text-center">
            <div className="flex items-center justify-center">
              <img
                className="h-12 w-auto animate-pulse"
                src="/icons/dither_I.png"
                alt="S33D Logo"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
