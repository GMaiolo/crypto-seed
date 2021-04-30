import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import { useWalletAddress } from "../../hooks/useWalletAddress";
import { useMemo, useState } from "react";
import { Dither } from "../Dither";

interface NavbarProps {
  height?: string;
}
export function Navbar({ height }: NavbarProps) {
  const walletAddress = useWalletAddress();

  const [selectedView, setSelectedView] = useState<"summary" | "detail">(
    "summary"
  );

  const trimmedWalletAddr = useMemo(() => {
    if (!walletAddress) return;
    const firstFour = walletAddress.substr(0, 4);
    const lastFour = walletAddress.substr(walletAddress.length - 4);
    return `${firstFour}…${lastFour}`;
  }, [walletAddress]);

  return (
    <div
      className="mt-4 mx-auto flex items-center"
      style={{ height: height || "auto" }}
    >
      <Link href="/">
        <a>
          <Dither width={60} height={60} />
        </a>
      </Link>
      {trimmedWalletAddr && (
        <div className="ml-auto flex items-center">
          <div className="mr-8 flex items-center justify-center">
            <button
              className={`${
                selectedView === "summary"
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              } px-4 py-2 rounded-lg`}
              onClick={() => setSelectedView("summary")}
            >
              Summary
            </button>
            <button
              className={`${
                selectedView === "detail"
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              } ml-1 px-4 py-2 rounded-lg`}
              onClick={() => setSelectedView("detail")}
            >
              Detailed
            </button>
          </div>
          <button className="px-4 py-2 rounded-3xl bg-black text-white flex items-center">
            <span className="mr-2">{trimmedWalletAddr}</span>
            <FaChevronDown size="0.75rem" />
          </button>
        </div>
      )}
    </div>
  );
}
