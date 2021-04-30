import { PoolInfo } from "../types";
import { formatMoney } from "./formatMoney";

export const getPoolTokenPrice = (pool: PoolInfo) =>
  pool.isLP ? pool.lpInfo.price || 0 : pool.price || 0;

export const getUserStakedPrice = (pool: PoolInfo) =>
  getPoolTokenPrice(pool) * pool.userStaked;

export const getUserStakedPriceFormatted = (pool: PoolInfo) =>
  formatMoney(getUserStakedPrice(pool));

export const getTotalPendingRewards = (pools: PoolInfo[]) =>
  pools.reduce((acc, pool) => acc + pool.pendingHarvest, 0);

export const getTotalStakedInUsd = (pools: PoolInfo[]) =>
  pools.reduce((acc, pool) => acc + getUserStakedPrice(pool), 0);

export const getPoolValue = (pool: PoolInfo, nativeTokenPrice: number) =>
  pool.pendingHarvest * nativeTokenPrice + getUserStakedPrice(pool);

export const getPoolValueFormatted = (
  pool: PoolInfo,
  nativeTokenPrice: number
) => formatMoney(getPoolValue(pool, nativeTokenPrice));
