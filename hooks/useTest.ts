import { ethers } from "ethers"; // https://docs.ethers.io/v5/getting-started/
import { useEffect, useMemo } from "react";
import { STRAT_ABI, SWAMP_CHEF_ABI } from "./foo";

const SWAMP_CHEF_ADDR = "0x33AdBf5f1ec364a4ea3a5CA8f310B597B8aFDee3";
const rewardTokenTicker = "SWAMP";

export const useTest = () => {
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const SWAMP_CHEF = new ethers.Contract(
      SWAMP_CHEF_ADDR,
      SWAMP_CHEF_ABI,
      provider
    );
    const run = async () => {
      const rewardsPerWeek =
        (((await SWAMP_CHEF.NATIVEPerBlock()) / 1e18) * 604800) / 3;
      console.log({ rewardsPerWeek });
    };
    run();
  }, []);
};
