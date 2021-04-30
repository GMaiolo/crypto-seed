import Pancake from "../../../server/platforms/Pancake";

export default async function (req, res) {
  const { walletAddress } = req.query;
  if (!walletAddress) {
    res.status(400).send("Please provide a wallet address");
  }
  const result = await Pancake.getInfo(walletAddress, req.query);
  res.send(result);
}
