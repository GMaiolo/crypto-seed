import { useSwamp } from "../hooks/useSwamp";
import { useWallet } from "../hooks/useWallet";
import { MainCard } from "../components/MainCard";
import { useTest } from "../hooks/useTest";

const address = "0x824Fa976d081e1716F095c77d7E89F4dB4d588C2";

export default function Home() {
  useTest();

  return <div className="bg-green-100 w-full min-h-screen h-full">hi</div>;
}
