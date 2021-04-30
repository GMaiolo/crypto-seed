import { Platform } from "../Platform";
import {
  AUTO_ADDR,
  AUTOFARM_CHEF_ABI,
  AUTOFARM_CHEF_ADDR,
} from "../../contracts/autofarm";
import { parseEthNumber } from "../../utils/etherUtils";

class Autofarm extends Platform {
  CHEF_ABI = AUTOFARM_CHEF_ABI;
  CHEF_ADDR = AUTOFARM_CHEF_ADDR;
  NATIVE_ADDR = AUTO_ADDR;
  PLATFORM_NAME = "Autofarm";
  PLATFORM_URL = "https://autofarm.network/";
  PENDING_HARVEST_FUNCTION_NAME = "pendingAUTO";
  POOL_ADDR_KEY = "want";

  cachedRawPoolsInfo: any = {};

  async getStakedTokens(pid: number, walletAddr: string) {
    try {
      const res = await this.farmContract.userInfo(pid, walletAddr);
      return parseEthNumber(res.shares);
    } catch {
      console.log("Error trying to get staked tokens");
      return 0;
    }
  }
}

export default new Autofarm();
