import { Platform } from "../Platform";
import {
  CAKE_ADDR,
  PANCAKE_CHEF_ABI,
  PANCAKE_CHEF_ADDR,
} from "../../contracts/pancake";
import { parseEthNumber } from "../../utils/etherUtils";

class Pancake extends Platform {
  CHEF_ABI = PANCAKE_CHEF_ABI;
  CHEF_ADDR = PANCAKE_CHEF_ADDR;
  NATIVE_ADDR = CAKE_ADDR;
  PLATFORM_NAME = "Pancake";
  PLATFORM_URL = "https://pancakeswap.finance/";
  PENDING_HARVEST_FUNCTION_NAME = "pendingCake";
  POOL_ADDR_KEY = "lpToken";

  cachedRawPoolsInfo: any = {};

  async getStakedTokens(pid: number, walletAddr: string) {
    try {
      const res = await this.farmContract.userInfo(pid, walletAddr);
      return parseEthNumber(res.amount);
    } catch {
      console.log("Error trying to get staked tokens");
      return 0;
    }
  }
}

export default new Pancake();
