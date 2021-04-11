import { Drawer } from "../components/Drawer/Drawer";
import { Navbar } from "../components/Navbar/Navbar";
import { CoinsList } from "../components/CoinsList/CoinsList";
import * as icons from "../icons/";

export function Home() {
  return (
    <div className="relative">
      <div className="mt-8 flex justify-center">
        <CoinsList />
      </div>
      <Drawer />
    </div>
  );
}
