import { Contract, ethers } from "ethers";
import { ERC20_ABI, STRAT_ABI } from "../hooks/foo";

const YOUR_ADDRESS = "0x824Fa976d081e1716F095c77d7E89F4dB4d588C2";

export const getProvider = (function () {
  let provider;
  return function getProvider(): ethers.providers.JsonRpcProvider {
    if (provider) return provider;
    const _provider = new ethers.providers.JsonRpcProvider(
      "https://bsc-dataseed.binance.org/"
    );
    provider = _provider;
    return provider;
  };
})();

export async function getPoolsInfo(chefContract: Contract) {
  const poolLength = Number(await chefContract.poolLength());
  const promises = [];
  for (let i = 0; i < poolLength; i++) {
    promises.push(getPoolInfo(chefContract, i));
  }
  return Promise.all(promises);
}

export async function getPoolInfo(chefContract: Contract, poolIndex: number) {
  const poolInfo = await chefContract.poolInfo(poolIndex);
  if (poolInfo.allocPoint == 0 || poolInfo.accNATIVEPerShare == 0) {
    return;
  }
  const poolToken = await getBscToken(poolInfo.want, poolInfo.strat);
  const strat = new Contract(poolInfo.strat, STRAT_ABI, getProvider());
  poolToken.staked = (await strat.wantLockedTotal()) / 1e18;
  const totalShares = await strat.sharesTotal();
  const userInfo = await chefContract.userInfo(poolIndex, YOUR_ADDRESS);
  const pendingRewardTokens = await chefContract.callStatic["pendingNATIVE"](
    poolIndex,
    YOUR_ADDRESS
  );
  const userStaked = (userInfo.shares / totalShares) * poolToken.staked;
  return {
    address: poolInfo.want,
    allocPoints: poolInfo.allocPoint ?? 1,
    poolToken,
    userStaked,
    pendingRewardTokens: pendingRewardTokens / 10 ** 18,
    stakedToken: null,
    userLPStaked: null,
    lastRewardBlock: poolInfo.lastRewardBlock,
  };
}

export async function getBscToken(
  tokenAddress: string,
  stakingAddress: string
) {
  const bep20 = new Contract(tokenAddress, ERC20_ABI, getProvider());
  const _name = await bep20.name();
  const bep20tok = await getBep20(bep20, tokenAddress, stakingAddress);
  return bep20tok;
}

export async function getBep20(
  token: Contract,
  tokenAddress: string,
  stakingAddress: string
) {
  if (tokenAddress == "0x0000000000000000000000000000000000000000") {
    return {
      tokenAddress,
      name: "Binance",
      symbol: "BNB",
      totalSupply: 1e8,
      decimals: 18,
      staked: 0,
      unstaked: 0,
      contract: null,
      tokens: [tokenAddress],
    };
  }
  const decimals = await token.decimals();
  return {
    tokenAddress,
    name: await token.name(),
    symbol: await token.symbol(),
    totalSupply: await token.totalSupply(),
    decimals: decimals,
    staked: (await token.balanceOf(stakingAddress)) / 10 ** decimals,
    unstaked: (await token.balanceOf(YOUR_ADDRESS)) / 10 ** decimals,
    contract: token,
    tokens: [tokenAddress],
  };
}
