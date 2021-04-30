import { Contract, ethers } from "ethers";
import { getBscProvider, parseEthNumber } from "../utils/etherUtils";
import { BSC_VAULT_ABI, VALUE_LP_ABI } from "../contracts/bsc";
import { getLpPrices, getPrice } from "./priceHelper";
import { LPInfo, PlatformData, PoolInfo } from "../shared/types";
import { Cache } from "memory-cache";

export abstract class Platform {
  cache = new Cache<string, PlatformData>();
  cacheTime = 1000 * 60 * 60; // * 5;

  abstract CHEF_ABI: any;
  abstract CHEF_ADDR: string;
  abstract NATIVE_ADDR: string;
  abstract PENDING_HARVEST_FUNCTION_NAME: string;
  abstract POOL_ADDR_KEY: string;
  abstract PLATFORM_NAME: string;
  abstract PLATFORM_URL: string;

  provider: ethers.providers.JsonRpcProvider;
  farmContract: Contract;
  poolLength: number;

  cachedRawPoolsInfo: any = {};
  cachedContractNames: { [key: string]: string } = {};
  cachedContractSymbols: { [key: string]: string } = {};
  cachedContracts: { [key: string]: Contract } = {};
  cachedLpTokensInfo: {
    [addr: string]: {
      token0Addr: string;
      token1Addr: string;
      token0Name: string;
      token0Symbol: string;
      token1Name: string;
      token1Symbol: string;
    };
  } = {};
  totalSupplyCache = new Cache();
  reservesCache = new Cache();

  async getInfo(walletAddr: string, options?: any) {
    const cacheKey = `${walletAddr}:${this.NATIVE_ADDR}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;
    await this.ensureProvider();
    this.getFarmContract();
    await this.getPoolLength();

    const pools = await this.getAllPoolsInfo(walletAddr);
    const tokenPrice = await getPrice(this.NATIVE_ADDR);

    const platformInfo: PlatformData = {
      name: this.PLATFORM_NAME,
      url: this.PLATFORM_URL,
      requestedAddress: walletAddr,
      nativeTokenPrice: tokenPrice,
      pools: options?.onlyStaked
        ? pools.filter((x) => x?.userStaked > 1e-3)
        : pools.filter(Boolean),
    };

    this.cache.put(cacheKey, platformInfo, this.cacheTime);

    return platformInfo;
  }

  async ensureProvider() {
    if (!this.provider) {
      this.provider = await getBscProvider();
    }
  }

  getFarmContract() {
    if (this.farmContract) return this.farmContract;
    this.farmContract = new Contract(
      this.CHEF_ADDR,
      this.CHEF_ABI,
      this.provider
    );
    return this.farmContract;
  }

  getContract(addr: string, ABI) {
    const cached = this.cachedContracts[addr];
    if (cached) return cached;
    const contract = new Contract(addr, ABI, this.provider);
    this.cachedContracts[addr] = contract;
    return contract;
  }

  async getPoolLength() {
    if (this.poolLength) return this.poolLength;
    this.poolLength = await this.farmContract.poolLength();
    return this.poolLength;
  }

  async getAllPoolsInfo(walletAddr): Promise<PoolInfo[]> {
    const promises = [];
    for (let pid = 0; pid < this.poolLength; pid++) {
      promises.push(
        new Promise(async (resolve) => {
          try {
            const poolInfo = await this.getPoolInfo(pid, walletAddr);
            resolve(poolInfo);
          } catch (err) {
            console.log(err);
            resolve(null);
          }
        })
      );
    }
    return Promise.all(promises);
  }

  async getPoolInfo(pid: number, walletAddr: string): Promise<PoolInfo> {
    const rawPoolInfo = await this.getRawPoolInfo(pid);
    const poolContract = this.getContract(
      rawPoolInfo[this.POOL_ADDR_KEY],
      VALUE_LP_ABI
    );

    const [
      name,
      walletBalance,
      userStaked,
      pendingHarvest,
      price,
    ] = await Promise.all([
      this.getContractName(poolContract),
      this.getWalletBalance(walletAddr, poolContract),
      this.getStakedTokens(pid, walletAddr),
      this.getPendingHarvest(pid, walletAddr),
      getPrice(rawPoolInfo[this.POOL_ADDR_KEY]),
    ]);

    const lpInfo = await this.getLpInfo(poolContract, userStaked);

    const symbol = await this.getSymbol(poolContract, lpInfo);

    return {
      pid,
      name,
      symbol,
      walletBalance,
      userStaked,
      pendingHarvest,
      price,
      addr: rawPoolInfo[this.POOL_ADDR_KEY],
      strat: rawPoolInfo.strat,
      allocPoint: parseFloat(rawPoolInfo.allocPoint),
      accNATIVEPerShare: parseFloat(rawPoolInfo.accNATIVEPerShare),
      isLP: Boolean(lpInfo),
      lpInfo,
    };
  }

  async getRawPoolInfo(pid: number) {
    const cached = this.cachedRawPoolsInfo[pid];
    if (cached) return cached;
    const rawPoolInfo = await this.farmContract.poolInfo(pid);
    this.cachedRawPoolsInfo[pid] = rawPoolInfo;
    return rawPoolInfo;
  }

  async getContractName(contract: Contract) {
    const cached = this.cachedContractNames[contract.address];
    if (cached) return cached;
    try {
      const name: string = await contract.name();
      this.cachedContractNames[contract.address] = name;
      return name;
    } catch {
      console.log("Error getting contract name");
      return "";
    }
  }

  async getWalletBalance(walletAddr: string, contract: Contract) {
    try {
      const walletBalance = await contract.balanceOf(walletAddr);
      return parseEthNumber(walletBalance);
    } catch {
      console.log("Error getting wallet balance");
      return 0;
    }
  }

  async getStakedTokens(pid: number, walletAddr: string) {
    try {
      const stakedTokens = await this.farmContract.stakedWantTokens(
        pid,
        walletAddr
      );
      return parseEthNumber(stakedTokens);
    } catch {
      console.log("Error trying to get staked tokens");
      return 0;
    }
  }

  async getTotalSupply(contract: Contract) {
    const cached = this.totalSupplyCache.get(contract.address);
    if (cached) return cached;
    const totalSupply = await contract.totalSupply();
    this.totalSupplyCache.put(contract.address, totalSupply, this.cacheTime);
    return totalSupply;
  }

  async getReserves(contract: Contract) {
    const cached = this.reservesCache.get(contract.address);
    if (cached) return cached;
    const reserves = await contract.getReserves();
    this.reservesCache.put(contract.address, reserves, this.cacheTime);
    return reserves;
  }

  async getLpInfo(contract: Contract, userStaked: number) {
    try {
      const {
        token0Addr,
        token1Addr,
        token0Name,
        token0Symbol,
        token1Name,
        token1Symbol,
      } = await this.getLpTokensInfo(contract);

      const [totalSupply, [supplyToken0, supplyToken1]] = await Promise.all([
        this.getTotalSupply(contract),
        this.getReserves(contract),
      ]);
      const { priceToken0, priceToken1, tvl, lpPrice } = await getLpPrices(
        totalSupply,
        supplyToken0,
        supplyToken1,
        token0Addr,
        token1Addr
      );

      const totalPrice = userStaked * lpPrice;

      return {
        tvl,
        price: lpPrice,
        token0: {
          price: priceToken0,
          addr: token0Addr,
          name: token0Name,
          symbol: token0Symbol,
          quantity: totalPrice / 2 / priceToken0,
        },
        token1: {
          price: priceToken1,
          addr: token1Addr,
          name: token1Name,
          symbol: token1Symbol,
          quantity: totalPrice / 2 / priceToken1,
        },
      };
    } catch (err) {}
  }

  async getLpTokensInfo(contract: Contract) {
    const cached = this.cachedLpTokensInfo[contract.address];
    if (cached) return cached;
    try {
      const [token0Addr, token1Addr] = await Promise.all([
        contract.token0(),
        contract.token1(),
      ]);
      const token0Contract = this.getContract(token0Addr, BSC_VAULT_ABI);
      const token1Contract = this.getContract(token1Addr, BSC_VAULT_ABI);
      const [
        token0Name,
        token0Symbol,
        token1Name,
        token1Symbol,
      ] = await Promise.all([
        this.getContractName(token0Contract),
        this.getSymbol(token0Contract),
        this.getContractName(token1Contract),
        this.getSymbol(token1Contract),
      ]);

      const lpTokensInfo = {
        token0Addr,
        token1Addr,
        token0Name,
        token0Symbol,
        token1Name,
        token1Symbol,
      };
      this.cachedLpTokensInfo[contract.address] = lpTokensInfo;
      return lpTokensInfo;
    } catch {}
  }

  async getSymbol(contract: Contract, lpInfo?: LPInfo) {
    if (lpInfo) return `${lpInfo.token0.symbol} + ${lpInfo.token1.symbol}`;
    const cached = this.cachedContractSymbols[contract.address];
    if (cached) return cached;
    try {
      const name = await contract.symbol();
      this.cachedContractSymbols[contract.address] = name;
      return name;
    } catch {}
  }

  async getPendingHarvest(pid: number, walletAddr: string): Promise<number> {
    try {
      const pendingHarvest = await this.farmContract[
        this.PENDING_HARVEST_FUNCTION_NAME
      ](pid, walletAddr);
      return parseFloat(ethers.utils.formatEther(pendingHarvest));
    } catch {
      console.log("Error trying to get pending harvest");
      return 0;
    }
  }
}
