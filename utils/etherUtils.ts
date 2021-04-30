import { ethers } from "ethers";

export const getBscProvider = (function () {
  let provider;
  return async function getProvider(): Promise<ethers.providers.JsonRpcProvider> {
    if (provider) return provider;
    let _provider = new ethers.providers.JsonRpcProvider(
      "https://bsc-dataseed.binance.org/"
    );
    await _provider.ready;
    _provider.on("noNetwork", async () => {
      console.log("There was an error on the provider, getting it back up...");
      let _provider = new ethers.providers.JsonRpcProvider(
        "https://bsc-dataseed.binance.org/"
      );
      await _provider.ready;
      provider = _provider;
    });
    provider = _provider;
    return provider;
  };
})();

export const parseEthNumber = (n: any) =>
  parseFloat(ethers.utils.formatEther(n));
