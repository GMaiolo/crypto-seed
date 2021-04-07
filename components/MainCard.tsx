import { useState } from "react";
import { Farm, Status, Token } from "../types";
import { formatMoney } from "../utils/formatMoney";
import { TokenCard } from "./TokenCard";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface Props {
  title: string;
  balance: number;
  status: Status;
  tokens?: Token[];
  farms?: Farm[];
}
export const MainCard = ({ title, balance, status, tokens, farms }: Props) => {
  const [collapsed, collapse] = useState(false);
  return (
    <div className="px-12 py-8 shadow-2xl bg-white rounded-xl relative">
      <button
        onClick={() => collapse(!collapsed)}
        className="absolute top-8 right-12"
      >
        {collapsed ? <FaChevronDown /> : <FaChevronUp />}
      </button>
      <p className="font-semibold">
        {title} – ({formatMoney(balance)})
      </p>
      {!collapsed && status !== "error" && (
        <div>
          {tokens && (
            <div className="grid grid-cols-3 gap-8">
              {tokens?.map((token: Token, i) => (
                <TokenCard key={token.symbol || i} token={token} />
              ))}
            </div>
          )}
          {farms && (
            <div className="grid grid-cols-3 gap-8">
              {farms.map((farm) =>
                farm.tokens.map((token) => <TokenCard token={token} />)
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
