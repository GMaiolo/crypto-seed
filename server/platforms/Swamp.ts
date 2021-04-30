import { Platform } from "../Platform";
import {
  SWAMP_ADDR,
  SWAMP_CHEF_ABI,
  SWAMP_CHEF_ADDR,
} from "../../contracts/swamp";

class Swamp extends Platform {
  CHEF_ABI = SWAMP_CHEF_ABI;
  CHEF_ADDR = SWAMP_CHEF_ADDR;
  NATIVE_ADDR = SWAMP_ADDR;
  PLATFORM_NAME = "Swamp";
  PLATFORM_URL = "https://swamp.finance/app/";
  PENDING_HARVEST_FUNCTION_NAME = "pendingNATIVE";
  POOL_ADDR_KEY = "want";
}

export default new Swamp();
