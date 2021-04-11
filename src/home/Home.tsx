import { Drawer } from "../components/Drawer/Drawer";
import { Navbar } from "../components/Navbar/Navbar";
import { CoinsList } from "../components/CoinsList/CoinsList";
import * as icons from "../icons/";

export function Home() {
  return (
    <div className="relative">
      <Navbar />
      <CoinsList />
      <Drawer />
    </div>
  );
}
