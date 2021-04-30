import Swamp from "../../../server/platforms/Swamp";

export default async function (req, res) {
  const { walletAddress } = req.query;
  if (!walletAddress) {
    res.status(400).send("Please provide a wallet address");
  }
  const result = await Swamp.getInfo(walletAddress, req.query);
  res.send(result);
}
