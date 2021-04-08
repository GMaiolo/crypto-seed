import { BigNumber, ethers, Contract } from "ethers"; // https://docs.ethers.io/v5/getting-started/
import { useEffect, useMemo } from "react";
import { formatMoney } from "../utils/formatMoney";
import { STRAT_ABI, SWAMP_CHEF_ABI, ERC20_ABI, bscTokens } from "./foo";
import chunk from "lodash.chunk";
import axios from "axios";
import { getPoolsInfo } from "../utils/etherUtils";

const YOUR_ADDRESS = "0x824Fa976d081e1716F095c77d7E89F4dB4d588C2";

const FARM_CONTRACT = "0x33AdBf5f1ec364a4ea3a5CA8f310B597B8aFDee3";
const TOKEN_CONTRACT = "0xc5a49b4cbe004b6fd55b30ba1de6ac360ff9765d";
const rewardTokenTicker = "SWAMP";

interface PoolInfo {
  accNATIVEPerShare: BigNumber;
  allocPoint: BigNumber;
  lastRewardBlock: BigNumber;
  strat: string; // staking address
  want: string; // token address
}

export const useTest = () => {
  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://bsc-dataseed.binance.org/"
    );
    const run = async () => {
      console.log("Running...");
      const chefContract = new Contract(
        FARM_CONTRACT,
        SWAMP_CHEF_ABI,
        provider
      );
      const poolsInfo = await getPoolsInfo(chefContract);
      console.log(
        poolsInfo.filter(Boolean).filter((pool) => pool.userStaked > 0)
      );
      // me quede aca https://github.com/vfat-tools/vfat-tools/blob/9e286c856f938e0bcec987b461c685997d53a23f/src/static/js/bsc_swamp.js#L56
    };

    run();
  }, []);
};
