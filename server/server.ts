const express = require("express");
const cors = require("cors");
import Swamp from "./platforms/Swamp";
import Pancake from "./platforms/Pancake";
import Autofarm from "./platforms/Autofarm";
import { getBscProvider } from "../utils/etherUtils";
import { initUpdatePricesCacheInterval } from "./priceHelper";

(async function run() {
  await getBscProvider();
  await initUpdatePricesCacheInterval();

  const app = express();

  app.use(cors());

  app.get("/:walletAddress/swamp", async function (req, res) {
    const { walletAddress } = req.params;
    if (!walletAddress) {
      res.status(400).send("Please provide a wallet address");
    }
    const result = await Swamp.getInfo(walletAddress, req.query);
    res.send(result);
  });

  app.get("/:walletAddress/pancake", async function (req, res) {
    const { walletAddress } = req.params;
    if (!walletAddress) {
      res.status(400).send("Please provide a wallet address");
    }
    const result = await Pancake.getInfo(walletAddress, req.query);
    res.send(result);
  });

  app.get("/:walletAddress/autofarm", async function (req, res) {
    const { walletAddress } = req.params;
    if (!walletAddress) {
      res.status(400).send("Please provide a wallet address");
    }
    const result = await Autofarm.getInfo(walletAddress, req.query);
    res.send(result);
  });

  app.listen(8000, () => {
    console.log("App listening on port 8000");
  });
})();
