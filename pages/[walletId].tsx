import { Drawer } from "../components/Drawer/Drawer";
import { CoinsList } from "../components/CoinsList/CoinsList";
import { Card } from "../components/Card/Card";
import { useState } from "react";
import { useWalletAddress } from "../hooks/useWalletAddress";
import { usePlatform } from "../hooks/usePlatform";

const tokens = [
  { key: "swamp", name: "Swamp" },
  { key: "autofarm", name: "Autofarm" },
  { key: "pk", name: "Pancake" },
  { key: "bt", name: "Bitcoin" },
  { key: "eth", name: "Ether" },
  { key: "ada", name: "Cardano " },
];

export default function Dashboard() {
  const walletAddress = useWalletAddress();
  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [swampStatus, swampData] = usePlatform(walletAddress, "swamp");
  const [pancakeStatus, pancakeData] = usePlatform(walletAddress, "pancake");
  const [autofarmStatus, autofarmData] = usePlatform(walletAddress, "autofarm");

  return (
    <div className="pt-8">
      <div className="">
        <section>
          <div className="my-8 flex justify-center">
            <CoinsList
              tokens={tokens}
              selectedToken={selectedToken}
              onSelectToken={setSelectedToken}
            />
          </div>
          {selectedToken.key === "swamp" && (
            <Card
              name={selectedToken.name}
              icon={`/icons/${selectedToken.key}`}
              status={swampStatus}
              data={swampData}
            />
          )}
          {selectedToken.key === "pk" && (
            <Card
              name={selectedToken.name}
              icon={`/icons/${selectedToken.key}`}
              status={pancakeStatus}
              data={pancakeData}
            />
          )}
          {selectedToken.key === "autofarm" && (
            <Card
              name={selectedToken.name}
              icon={`/icons/${selectedToken.key}`}
              status={autofarmStatus}
              data={autofarmData}
            />
          )}
        </section>
      </div>
      {false && <Drawer />}
    </div>
  );
}
